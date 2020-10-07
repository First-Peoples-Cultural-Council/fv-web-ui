/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.publisher.services;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_AUDIO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_BOOK;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_BOOK_ENTRY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_GALLERY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_LABEL;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_LINK;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PICTURE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PORTAL;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PORTAL_NAME;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_VIDEO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;

import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.SessionUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.publisher.utils.PublisherUtils;
import java.io.Serializable;
import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.schema.FacetNames;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;

/**
 * @author loopingz
 */
public class FirstVoicesPublisherServiceImpl implements FirstVoicesPublisherService {

  private static final Log log = LogFactory.getLog(FirstVoicesPublisherServiceImpl.class);

  private static final String MEDIA_ORIGIN_FIELD = "fvmedia:origin";

  private CoreSession session;

  protected Map<String, DocumentModel> getAncestors(DocumentModel model) {
    if (model == null || !model.getDocumentType().getName().equals(FV_DIALECT)) {
      throw new InvalidParameterException("Document must be a FVDialect type");
    }
    Map<String, DocumentModel> map = new HashMap<>();
    session = model.getCoreSession();
    DocumentModel language = session.getDocument(model.getParentRef());
    if (language == null || !language.getDocumentType().getName().equals(FV_LANGUAGE)) {
      throw new InvalidParameterException("Parent document must be a FVLanguage type");
    }
    map.put("Language", language);
    DocumentModel languageFamily = session.getDocument(language.getParentRef());
    if (languageFamily == null || !languageFamily.getDocumentType().getName()
        .equals(FV_LANGUAGE_FAMILY)) {
      throw new InvalidParameterException("Parent document must be a FVLanguageFamily type");
    }
    map.put("LanguageFamily", languageFamily);
    return map;
  }

  @Override
  public DocumentModel publishDialect(DocumentModel dialect) {
    return publishDialect(dialect, true);
  }

  @Override
  public DocumentModel publishDialect(DocumentModel dialect, boolean publishChildren) {
    // Arguments checks : need to be a FVDialect in a normal tree
    // (LanguageFamily/Language/Dialect)
    Map<String, DocumentModel> ancestors = getAncestors(dialect);

    DocumentModel languageFamily = ancestors.get("LanguageFamily");
    session = dialect.getCoreSession();

    DocumentModel section = getRootSection(dialect);

    // Publish grand parent
    if (!isPublished(languageFamily, section)) {
      session.publishDocument(languageFamily, section);
    }

    // Publish parent
    DocumentModel language = ancestors.get("Language");
    section = session.getChild(section.getRef(), languageFamily.getName());
    if (!isPublished(language, section)) {
      session.publishDocument(language, section);
    }

    // Publish dialect, or republish (overwrite)
    section = session.getChild(section.getRef(), language.getName());

    DocumentModel dialectProxy = session.publishDocument(dialect, section);
    setDialectProxies(dialectProxy);

    if (publishChildren) {
      // Now publish all the children
      section = session.getChild(section.getRef(), dialect.getName());
      DocumentModelList children = session.getChildren(dialect.getRef());
      for (DocumentModel child : children) {
        if (!child.hasFacet(FacetNames.PUBLISHABLE)) {
          continue;
        }
        if (!isPublished(child, section)) {
          session.publishDocument(child, section);
        }
      }
      // Need to republish all assets that were published
      // Note: Can we avoid what could be a very long operation?
      for (DocumentModel child : session.query(
          "SELECT * FROM Document WHERE ecm:ancestorId = '" + dialect.getId()
              + "' AND ecm:currentLifeCycleState='Published'")) {
        publishAsset(child);
      }
    }

    return section;
  }

  @SuppressWarnings("BooleanMethodIsAlwaysInverted")
  private boolean isPublished(DocumentModel doc, DocumentModel section) {
    DocumentModelList proxies = doc.getCoreSession().getProxies(doc.getRef(), section.getRef());
    return proxies != null && !proxies.isEmpty();
  }

  private DocumentModel getRootSection(DocumentModel doc) {
    DocumentModel workspace = doc;
    session = doc.getCoreSession();
    while (workspace != null && !"Workspace".equals(workspace.getType())) {
      workspace = session.getParentDocument(workspace.getRef());
    }
    DocumentModelList roots = null;
    if (workspace != null) {
      PublisherService publisherService = Framework.getService(PublisherService.class);
      roots = publisherService.getRootSectionFinder(session).getSectionRootsForWorkspace(workspace);
    }
    if (roots == null || roots.isEmpty()) {
      PublisherService publisherService = Framework.getService(PublisherService.class);
      roots = publisherService.getRootSectionFinder(session).getDefaultSectionRoots(true, true);
    }
    if (roots.isEmpty()) {
      throw new NuxeoException("Can't publish, no section available");
    }
    return roots.get(0);
  }

  @Override
  public void unpublishDialect(DocumentModel dialect) {
    // Arguments checks : need to be a FVDialect in a normal tree
    // (LanguageFamily/Language/Dialect)
    session = dialect.getCoreSession();
    Map<String, DocumentModel> ancestors = getAncestors(dialect);
    DocumentModel languageFamily = ancestors.get("LanguageFamily");
    DocumentModel language = ancestors.get("Language");
    DocumentModel section = session
        .getChild(getRootSection(dialect).getRef(), languageFamily.getName());
    if (section == null) {
      throw new InvalidParameterException("Dialect is not published");
    }
    DocumentModel languageFamilySection;
    languageFamilySection = section;
    section = session.getChild(section.getRef(), language.getName());
    if (section == null) {
      throw new InvalidParameterException("Dialect is not published");
    }
    DocumentModel languageSection;
    languageSection = section;
    section = session.getChild(section.getRef(), dialect.getName());
    if (section == null) {
      throw new InvalidParameterException("Dialect is not published");
    }
    session.removeDocument(section.getRef());
    if (session.getChildren(languageSection.getRef()).isEmpty()) {
      session.removeDocument(languageSection.getRef());
    }
    if (session.getChildren(languageFamilySection.getRef()).isEmpty()) {
      session.removeDocument(languageFamilySection.getRef());
    }
  }

  @Override
  public DocumentModel publishDocument(CoreSession session, DocumentModel doc,
      DocumentModel section) {
    DocumentModel proxy = session.publishDocument(doc, section, true);
    if (doc.getAllowedStateTransitions().contains(PUBLISH_TRANSITION)) {
      doc.followTransition(PUBLISH_TRANSITION);
    }
    return proxy;
  }

  @Override
  public DocumentModel publishAsset(DocumentModel asset) {
    session = asset.getCoreSession();

    DocumentModel dialect = DialectUtils.getDialect(session, asset);
    if (dialect == null) {
      throw new InvalidParameterException("Asset should be inside a dialect");
    }
    DocumentModelList proxies = session.getProxies(dialect.getRef(), null);
    if (proxies.isEmpty()) {
      throw new InvalidParameterException("Dialect should be published");
    }
    DocumentModel input = getPublication(session, asset.getRef());
    if (input != null && input.getCurrentLifeCycleState().equals(PUBLISHED_STATE)) {
      // Already published
      return input;
    }

    input = publishDocument(session, asset, getPublication(session, asset.getParentRef()));

    Map<String, String> dependencies = PublisherUtils.addAssetDependencies(asset);

    for (Entry<String, String> dependencyEntry : dependencies.entrySet()) {

      String dependency = dependencyEntry.getKey();
      // Check if input has schema
      if (!input.hasSchema(dependency.split(":")[0])) {
        continue;
      }

      String[] dependencyPropertyValue;

      // Handle exception property value as string
      if (MEDIA_ORIGIN_FIELD.equals(dependency)) {
        dependencyPropertyValue = PublisherUtils
            .extractDependencyPropertyValueAsString(input, dependency);

      } else {
        // Handle as array

        dependencyPropertyValue = (String[]) input.getPropertyValue(dependency);
      }

      if (PublisherUtils.dependencyIsEmpty(dependencyPropertyValue)) {
        input.setPropertyValue(dependencyEntry.getValue(), null);
        continue;
      }

      // input is the document in the section
      for (String relatedDocUUID : dependencyPropertyValue) {
        IdRef dependencyRef = new IdRef(relatedDocUUID);
        DocumentModel publishedDep = getPublication(session, dependencyRef);

        // If dependency isn't published, need to publish
        if (publishedDep == null) {

          // Origin shouldn't be automatically published
          if (MEDIA_ORIGIN_FIELD.equals(dependencyEntry.getKey())) {
            continue;
          }

          DocumentModel dependencyDocModel = session.getDocument(dependencyRef);
          DocumentModel parentDependencySection;
          if (FV_CATEGORY.equals(dependencyDocModel.getType())) {
            PublisherService publisherService = Framework.getService(PublisherService.class);
            publishedDep = PublisherUtils
                .publishAncestors(session, FV_CATEGORY, dependencyDocModel, publisherService);
          } else {
            parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());
            publishedDep = publishDocument(session, dependencyDocModel, parentDependencySection);
          }
        }
        if (publishedDep == null) {
          continue;
        }

        // Handle exception property values as string
        if (MEDIA_ORIGIN_FIELD.equals(dependencyEntry.getKey())) {
          input.setPropertyValue(dependencyEntry.getValue(), publishedDep.getRef().toString());

        } else {
          // Handle as array

          String[] updatedProperty = PublisherUtils.constructDependencyPropertyValueAsArray(
              (String[]) input.getPropertyValue(dependencyEntry.getValue()), publishedDep);
          input.setPropertyValue(dependencyEntry.getValue(), updatedProperty);
        }
      }
    }
    session.saveDocument(input);
    return input;
  }

  public DocumentModel republishAsset(DocumentModel asset) {
    session = asset.getCoreSession();

    DocumentModel dialect = DialectUtils.getDialect(asset);
    if (dialect == null) {
      throw new InvalidParameterException("Asset should be inside a dialect");
    }
    DocumentModelList proxies = session.getProxies(dialect.getRef(), null);
    if (proxies.isEmpty()) {
      throw new InvalidParameterException("Dialect should be published");
    }

    // Always publish changes
    DocumentModel input = publishDocument(session, asset,
        getPublication(session, asset.getParentRef()));

    Map<String, String> dependencies = PublisherUtils.addAssetDependencies(asset);

    for (Entry<String, String> dependencyEntry : dependencies.entrySet()) {

      String dependency = dependencyEntry.getKey();
      // Check if input has schema
      if (!asset.hasSchema(dependency.split(":")[0])) {
        continue;
      }

      String[] dependencyPropertyValue;

      // Handle exception property value as string
      if (MEDIA_ORIGIN_FIELD.equals(dependency)) {
        dependencyPropertyValue = PublisherUtils
            .extractDependencyPropertyValueAsString(input, dependency);
      } else {
        // Handle as array

        dependencyPropertyValue = (String[]) input.getPropertyValue(dependency);
      }

      if (PublisherUtils.dependencyIsEmpty(dependencyPropertyValue)) {
        input.setPropertyValue(dependencyEntry.getValue(), null);
        continue;
      }

      input.setPropertyValue(dependencyEntry.getValue(), null);

      // input is the document in the section
      for (String relatedDocUUID : dependencyPropertyValue) {
        IdRef dependencyRef = new IdRef(relatedDocUUID);

        // Origin shouldn't be automatically published
        if (MEDIA_ORIGIN_FIELD.equals(dependencyEntry.getKey())) {
          continue;
        }

        // If dependency does not exist (e.g. deleted), skip
        if (!session.exists(dependencyRef)) {
          continue;
        }

        DocumentModel publishedDep = null;

        try {
          publishedDep = getPublication(session, dependencyRef);
        } catch (DocumentNotFoundException e) {
          // Continue. Considered null.
        }

        // If dependency isn't published, need to publish
        if (publishedDep == null) {

          DocumentModel dependencyDocModel = session.getDocument(dependencyRef);
          DocumentModel parentDependencySection;
          if (FV_CATEGORY.equals(dependencyDocModel.getType())) {
            PublisherService publisherService = Framework.getService(PublisherService.class);
            publishedDep = PublisherUtils
                .publishAncestors(session, FV_CATEGORY, dependencyDocModel, publisherService);
          } else {
            parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());
            publishedDep = publishDocument(session, dependencyDocModel, parentDependencySection);
          }
        }

        // Handle exception property values as string
        if (MEDIA_ORIGIN_FIELD.equals(dependencyEntry.getKey())) {
          input.setPropertyValue(dependencyEntry.getValue(), publishedDep.getRef().toString());
        } else {
          // Handle as array

          String[] updatedProperty = PublisherUtils.constructDependencyPropertyValueAsArray(
              (String[]) input.getPropertyValue(dependencyEntry.getValue()), publishedDep);
          input.setPropertyValue(dependencyEntry.getValue(), updatedProperty);
        }
      }
    }
    session.saveDocument(input);
    return input;
  }

  @Override
  public void unpublishAsset(DocumentModel asset) {
    DocumentModel proxy = getPublication(asset.getCoreSession(), asset.getRef());
    if (proxy == null) {
      return;
    }
    asset.getCoreSession().removeDocument(proxy.getRef());
  }

  @Override
  public DocumentModel getPublication(CoreSession session, DocumentRef docRef) {
    DocumentModelList sections = session.getProxies(docRef, null);

    if (!sections.isEmpty()) {
      return sections.get(0);
    }

    return null;
  }

  @Override
  public void unpublish(DocumentModel doc) {
    if (doc == null) {
      return;
    }
    if (FV_DIALECT.equals(doc.getType())) {
      unpublishDialect(doc);
    } else if (isAssetType(doc.getType())) {
      unpublishAsset(doc);
    }
  }

  private boolean isAssetType(String type) {
    return FV_BOOK_ENTRY.equals(type) || FV_BOOK.equals(type) || FV_PHRASE.equals(type)
        || FV_WORD.equals(type) || FV_LABEL.equals(type) || FV_PICTURE.equals(type) || FV_VIDEO
        .equals(type) || FV_AUDIO.equals(type) || FV_CATEGORY.equals(type) || FV_CHARACTER
        .equals(type) || FV_GALLERY.equals(type) || FV_LINK.equals(type);
  }

  @Override
  public DocumentModel publish(DocumentModel doc) {
    if (doc == null) {
      return null;
    }
    if (FV_DIALECT.equals(doc.getType())) {
      return publishDialect(doc);
    } else if (FV_PORTAL.equals(doc.getType())) {
      return publishPortalAssets(doc);
    } else if (isAssetType(doc.getType())) {
      return publishAsset(doc);
    }
    return null;
  }

  @Override
  public void queueRepublish(DocumentModel doc) {
    if (doc.getAllowedStateTransitions().contains(REPUBLISH_TRANSITION)) {
      doc.followTransition(REPUBLISH_TRANSITION);
    }
  }

  @Override
  public DocumentModel doRepublish(DocumentModel doc) {
    if (doc == null) {
      return null;
    }

    DocumentModel publishedDoc = null;

    if (isAssetType(doc.getType())) {
      publishedDoc = republishAsset(doc);
    } else if (FV_DIALECT.equals(doc.getType())) {
      // Set session
      session = doc.getCoreSession();

      // Publish Portal
      publishPortalAssets(session.getChild(doc.getRef(), FV_PORTAL_NAME));

      // Publish dialect without children
      publishedDoc = publishDialect(doc, false);
    }

    // After republish move back to publish state if applicable
    // If doRepublish is called directly, no transition is required
    if (doc.getAllowedStateTransitions().contains(PUBLISH_TRANSITION)) {
      doc.followTransition(PUBLISH_TRANSITION);
    } else {
      log.error(String.format(
          "Tried to follow transition `Publish` on Document %s (%s). Not allowed from state %s",
          doc.getTitle(), doc.getId(), doc.getCurrentLifeCycleState()));
    }

    if (publishedDoc == null) {
      log.error(String.format(
          "Published document was not successful on Document %s (%s)",
          doc.getTitle(), doc.getId()));
    }

    return publishedDoc;
  }

  /**
   * Sets relevant related proxies on published dialect proxy
   *
   * @param dialectProxy
   * @return
   */
  @Override
  public DocumentModel setDialectProxies(DocumentModel dialectProxy) {
    session = dialectProxy.getCoreSession();

    Map<String, String> dependencies = new HashMap<>();

    if (!dialectProxy.hasSchema("fvproxy")) {
      log.warn(
          String.format("Proxy with ID %s does not have `fvproxy` schema.", dialectProxy.getId()));
      return dialectProxy;
    }

    dependencies.put("fvdialect:keyboards", "fvproxy:proxied_keyboards");
    dependencies.put("fvdialect:language_resources", "fvproxy:proxied_language_resources");

    for (Entry<String, String> dependencyEntry : dependencies.entrySet()) {

      String dependency = dependencyEntry.getKey();
      String[] dependencyPropertyValue;
      ArrayList<String> dependencyPublishedPropertyValues = new ArrayList<>();

      // Handle values as arrays
      if (dependencyEntry.getKey().equals("fvdialect:keyboards") || dependencyEntry.getKey()
          .equals("fvdialect:language_resources")) {
        dependencyPropertyValue = (String[]) dialectProxy.getPropertyValue(dependency);
      } else {
        // Handle as string

        dependencyPropertyValue = PublisherUtils
            .extractDependencyPropertyValueAsString(dialectProxy, dependency);
      }

      if (PublisherUtils.dependencyIsEmpty(dependencyPropertyValue)) {
        dialectProxy.setPropertyValue(dependencyEntry.getValue(), null);
        continue;
      }

      // input is the document in the section
      for (String relatedDocUUID : dependencyPropertyValue) {
        IdRef dependencyRef = new IdRef(relatedDocUUID);
        DocumentModel publishedDep = getPublication(session, dependencyRef);

        try {
          session.getDocument(publishedDep.getRef());
        } catch (NullPointerException | DocumentNotFoundException e) {
          publishedDep = null;
        }

        // If dependency isn't published, needs publishing
        if (publishedDep == null) {
          DocumentModel dependencyDocModel = session.getDocument(dependencyRef);
          DocumentModel parentDependencySection;

          parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());

          // Publish parent if not yet published
          if (parentDependencySection == null) {
            DocumentModel parent = session.getDocument(dependencyDocModel.getParentRef());
            parentDependencySection = publishDocument(session, parent,
                getPublication(session, parent.getParentRef()));
          }

          publishedDep = publishDocument(session, dependencyDocModel, parentDependencySection);
        }

        dependencyPublishedPropertyValues.add(publishedDep.getRef().toString());
      }

      // Handle property values as arrays
      if (dependencyEntry.getKey().equals("fvdialect:keyboards") || dependencyEntry.getKey()
          .equals("fvdialect:language_resources")) {
        dialectProxy.setPropertyValue(dependencyEntry.getValue(), dependencyPublishedPropertyValues
            .toArray(new String[dependencyPublishedPropertyValues.size()]));
      } else {
        // Handle as string

        dialectProxy
            .setPropertyValue(dependencyEntry.getValue(), dependencyPublishedPropertyValues.get(0));
      }
    }

    // Save changes to property values
    return SessionUtils.saveDocumentWithoutEvents(session, dialectProxy, true, null);
  }

  @Override
  public void removeTrashedCategoriesOrPhrasebooksFromWordsOrPhrases(CoreSession session,
      DocumentModel doc) {
    String wordQuery = "SELECT * FROM FVWord WHERE fv-word:categories IN ('" + doc.getId()
        + "') AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
    DocumentModelList documentModels = session.query(wordQuery);
    String phraseQuery = "SELECT * FROM FVPhrase WHERE fv-phrase:phrase_books IN ('" + doc.getId()
        + "') AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";

    DocumentModelList phrases = session.query(phraseQuery);
    documentModels.addAll(phrases);

    documentModels.stream().forEach(wordOrPhrase -> {
      String propertyValue = "";
      if (wordOrPhrase.getType().equals(FV_WORD)) {
        propertyValue = "categories";
      } else {
        propertyValue = "phrase_books";
      }

      // TODO: Move to this to maintenance worker
      // There is an edge-case that seems to be a race condition when you bulk delete categories.
      Serializable documentModelPropertyValue = wordOrPhrase.getPropertyValue(propertyValue);
      if (documentModelPropertyValue != null) {
        String[] categories = (String[]) documentModelPropertyValue;
        String categoryId = doc.getId();
        Serializable updated = (Serializable) Arrays.stream(categories).filter(id -> {
          IdRef idRef = new IdRef(id);
          DocumentModel category = session.getDocument(idRef);
          return !category.isTrashed() && !id.equals(categoryId);
        }).collect(Collectors.toList());
        wordOrPhrase.setPropertyValue(propertyValue, updated);
        session.saveDocument(wordOrPhrase);
      }
    });

  }

  @Override
  public DocumentModel publishDocumentIfDialectPublished(CoreSession session, DocumentModel doc) {
    //  Will only publish document if the parent dialect is published

    DocumentModel dialect = DialectUtils.getDialect(session, doc);

    if (StateUtils.isPublished(dialect)) {
      if (StateUtils.isPublished(doc)) {
        doRepublish(doc);
      } else {
        publish(doc);
      }
    }
    return doc;
  }

  @Override
  public DocumentModel publishPortalAssets(DocumentModel portal) {

    if (portal.getCoreSession() != null) {
      session = portal.getCoreSession();
    }

    DocumentModel dialect = DialectUtils.getDialect(portal);
    if (dialect == null) {
      throw new InvalidParameterException("Asset should be inside a dialect");
    }
    DocumentModelList proxies = session.getProxies(dialect.getRef(), null);
    if (proxies.isEmpty()) {
      throw new InvalidParameterException("Dialect should be published");
    }
    DocumentModel dialectSection = proxies.get(0);

    // Publish changes
    DocumentModel input = session.publishDocument(portal, dialectSection, true);

    Map<String, String> dependencies = new HashMap<>();

    // Portal
    dependencies.put("fv-portal:featured_words", "fvproxy:proxied_words");
    dependencies.put("fv-portal:background_top_image", "fvproxy:proxied_background_image");
    dependencies.put("fv-portal:featured_audio", "fvproxy:proxied_featured_audio");
    dependencies.put("fv-portal:logo", "fvproxy:proxied_logo");
    dependencies.put("fv-portal:related_links", "fvproxy:proxied_related_links");

    for (Entry<String, String> dependencyEntry : dependencies.entrySet()) {

      String dependency = dependencyEntry.getKey();
      // Check if input has schema
      if (!input.hasSchema(dependency.split(":")[0])) {
        continue;
      }

      String[] dependencyPropertyValue;

      // Handle expection property values as arrays
      if (dependencyEntry.getKey().equals("fv-portal:featured_words") || dependencyEntry.getKey()
          .equals("fv-portal:related_links")) {
        dependencyPropertyValue = (String[]) input.getPropertyValue(dependency);
      } else {      // Handle as string

        dependencyPropertyValue = PublisherUtils
            .extractDependencyPropertyValueAsString(input, dependency);
      }

      if (PublisherUtils.dependencyIsEmpty(dependencyPropertyValue)) {
        input.setPropertyValue(dependencyEntry.getValue(), null);
        continue;
      }

      // input is the document in the section
      for (String relatedDocUUID : dependencyPropertyValue) {
        IdRef dependencyRef = new IdRef(relatedDocUUID);
        DocumentModel publishedDep = getPublication(session, dependencyRef);

        try {
          // TODO: Bug? getProxies seems to return documents that don't exist anymore.
          // Force check to see if
          // doc exists.
          session.getDocument(publishedDep.getRef());
        } catch (NullPointerException | DocumentNotFoundException e) {
          publishedDep = null;
        }

        // If dependency isn't published, needs publishing
        if (publishedDep == null) {
          DocumentModel dependencyDocModel = session.getDocument(dependencyRef);
          DocumentModel parentDependencySection;

          parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());
          publishedDep = publishDocument(session, dependencyDocModel, parentDependencySection);
        }

        // Handle exception property values as arrays
        if (dependencyEntry.getKey().equals("fv-portal:featured_words") || dependencyEntry.getKey()
            .equals("fv-portal:related_links")) {
          String[] property = (String[]) input.getPropertyValue(dependencyEntry.getValue());

          if (property == null) {
            property = new String[0];
          }
          if (!Arrays.asList(property).contains(publishedDep.getRef().toString())) {
            String[] updatedProperty = Arrays.copyOf(property, property.length + 1);
            updatedProperty[updatedProperty.length - 1] = publishedDep.getRef().toString();
            input.setPropertyValue(dependencyEntry.getValue(), updatedProperty);
          }
        } else {
          // Handle as string

          input.setPropertyValue(dependencyEntry.getValue(), publishedDep.getRef().toString());
        }
      }
    }
    session.saveDocument(input);
    return input;
  }
}
