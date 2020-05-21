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

import ca.firstvoices.publisher.utils.PublisherUtils;
import ca.firstvoices.services.AbstractService;
import java.io.Serializable;
import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
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
public class FirstVoicesPublisherServiceImpl extends AbstractService implements
    FirstVoicesPublisherService {

  protected Map<String, DocumentModel> getAncestors(DocumentModel model) {
    if (model == null || !model.getDocumentType().getName().equals("FVDialect")) {
      throw new InvalidParameterException("Document must be a FVDialect type");
    }
    Map<String, DocumentModel> map = new HashMap<>();
    CoreSession session = model.getCoreSession();
    DocumentModel language = session.getDocument(model.getParentRef());
    if (language == null || !language.getDocumentType().getName().equals("FVLanguage")) {
      throw new InvalidParameterException("Parent document must be a FVLanguage type");
    }
    map.put("Language", language);
    DocumentModel languageFamily = session.getDocument(language.getParentRef());
    if (languageFamily == null || !languageFamily.getDocumentType().getName()
        .equals("FVLanguageFamily")) {
      throw new InvalidParameterException("Parent document must be a FVLanguageFamily type");
    }
    map.put("LanguageFamily", languageFamily);
    return map;
  }

  @Override
  public DocumentModel publishDialect(DocumentModel dialect) {
    // Arguments checks : need to be a FVDialect in a normal tree
    // (LanguageFamily/Language/Dialect)
    Map<String, DocumentModel> ancestors = getAncestors(dialect);

    DocumentModel languageFamily = ancestors.get("LanguageFamily");
    DocumentModel language = ancestors.get("Language");
    CoreSession session = dialect.getCoreSession();

    DocumentModel section = getRootSection(dialect);
    // Publish grand parent
    if (Boolean.FALSE.equals(isPublished(languageFamily, section))) {
      session.publishDocument(languageFamily, section);
    }
    // Publish parent
    section = session.getChild(section.getRef(), languageFamily.getName());
    if (Boolean.FALSE.equals(isPublished(language, section))) {
      session.publishDocument(language, section);
    }
    // Publish dialect
    section = session.getChild(section.getRef(), language.getName());
    if (Boolean.FALSE.equals(isPublished(dialect, section))) {
      session.publishDocument(dialect, section);
    }
    // Now publish all the children
    section = session.getChild(section.getRef(), dialect.getName());
    DocumentModelList children = session.getChildren(dialect.getRef());
    for (DocumentModel child : children) {
      if (!child.hasFacet(FacetNames.PUBLISHABLE)) {
        continue;
      }
      if (Boolean.FALSE.equals(isPublished(child, section))) {
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
    return section;
  }

  private Boolean isPublished(DocumentModel doc, DocumentModel section) {
    return Boolean.FALSE
        .equals(doc.getCoreSession().getProxies(doc.getRef(), section.getRef()).isEmpty());
  }

  private DocumentModel getRootSection(DocumentModel doc) {
    DocumentModel workspace = doc;
    CoreSession session = doc.getCoreSession();
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
    CoreSession session = dialect.getCoreSession();
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
    if ("fv-lifecycle".equals(doc.getLifeCyclePolicy()) && !"Published"
        .equals(doc.getCurrentLifeCycleState())) {
      doc.followTransition("Publish");
    }
    return proxy;
  }

  @Override
  public DocumentModel publishAsset(DocumentModel asset) {
    CoreSession session = asset.getCoreSession();

    DocumentModel dialect = getDialect(asset);
    if (dialect == null) {
      throw new InvalidParameterException("Asset should be inside a dialect");
    }
    DocumentModelList proxies = session.getProxies(dialect.getRef(), null);
    if (proxies.isEmpty()) {
      throw new InvalidParameterException("Dialect should be published");
    }
    DocumentModel input = getPublication(session, asset.getRef());
    if (input != null && input.getCurrentLifeCycleState().equals("Published")) {
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

      // Publish dependency
      // String documentPath = input.getPathAsString();

      String[] dependencyPropertyValue;

      // Handle exception property value as string
      if (dependency.equals("fvmedia:origin")) {
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
          if (dependencyEntry.getKey().equals("fvmedia:origin")) {
            continue;
          }

          DocumentModel dependencyDocModel = session.getDocument(dependencyRef);
          DocumentModel parentDependencySection;
          if ("FVCategory".equals(dependencyDocModel.getType())) {
            PublisherService publisherService = Framework.getService(PublisherService.class);
            publishedDep = PublisherUtils
                .publishAncestors(session, "FVCategory", dependencyDocModel, publisherService);
          } else {
            parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());
            publishedDep = publishDocument(session, dependencyDocModel, parentDependencySection);
          }
        }
        if (publishedDep == null) {
          continue;
        }

        // Handle exception property values as string
        if (dependencyEntry.getKey().equals("fvmedia:origin")) {
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
    CoreSession session = asset.getCoreSession();

    DocumentModel dialect = getDialect(asset);
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

      // Publish dependency
      // String documentPath = input.getPathAsString();

      String[] dependencyPropertyValue;

      // Handle exception property value as string
      if (dependency.equals("fvmedia:origin")) {
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
        if (dependencyEntry.getKey().equals("fvmedia:origin")) {
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
          if ("FVCategory".equals(dependencyDocModel.getType())) {
            PublisherService publisherService = Framework.getService(PublisherService.class);
            publishedDep = PublisherUtils
                .publishAncestors(session, "FVCategory", dependencyDocModel, publisherService);
          } else {
            parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());
            publishedDep = publishDocument(session, dependencyDocModel, parentDependencySection);
          }
        }

        // Handle exception property values as string
        if (dependencyEntry.getKey().equals("fvmedia:origin")) {
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
    if ("FVDialect".equals(doc.getType())) {
      unpublishDialect(doc);
    } else if (isAssetType(doc.getType())) {
      unpublishAsset(doc);
    }
  }

  private boolean isAssetType(String type) {
    return "FVBookEntry".equals(type) || "FVBook".equals(type) || "FVPhrase".equals(type)
        || "FVWord".equals(type) || "FVLabel".equals(type) || "FVPicture".equals(type) || "FVVideo"
        .equals(type) || "FVAudio".equals(type) || "FVCategory".equals(type) || "FVCharacter"
        .equals(type) || "FVGallery".equals(type) || "FVLink".equals(type);
  }

  @Override
  public DocumentModel publish(DocumentModel doc) {
    if (doc == null) {
      return null;
    }
    if ("FVDialect".equals(doc.getType())) {
      return publishDialect(doc);
    } else if ("FVPortal".equals(doc.getType())) {
      return publishPortalAssets(doc);
    } else if (isAssetType(doc.getType())) {
      return publishAsset(doc);
    }
    return null;
  }

  @Override
  public DocumentModel republish(DocumentModel doc) {
    if (doc == null) {
      return null;
    }

    if (isAssetType(doc.getType())) {
      return republishAsset(doc);
    } else if ("FVPortal".equals(doc.getType())) {
      return publishPortalAssets(doc);
    }

    return null;
  }

  /**
   * Sets relevant related proxies on published dialect proxy
   *
   * @param dialectProxy
   * @return
   */
  @Override
  public DocumentModel setDialectProxies(DocumentModel dialectProxy) {
    CoreSession session = dialectProxy.getCoreSession();

    Map<String, String> dependencies = new HashMap<>();

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
    return session.saveDocument(dialectProxy);
  }

  @Override
  public void removeTrashedCategoriesOrPhrasebooksFromWordsOrPhrases(CoreSession session,
      DocumentModel doc) {
    DocumentModel dialect = getDialect(session, doc);
    String wordQuery = "SELECT * FROM FVWord WHERE fv-word:categories IN ('" + doc.getId()
        + "') AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
    DocumentModelList documentModels = session.query(wordQuery);
    String phraseQuery = "SELECT * FROM FVPhrase WHERE fv-phrase:phrase_books IN ('" + doc.getId()
        + "') AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";

    DocumentModelList phrases = session.query(phraseQuery);
    documentModels.addAll(phrases);

    documentModels.stream().forEach(wordOrPhrase -> {
      String propertyValue = "";
      if (wordOrPhrase.getType().equals("FVWord")) {
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
  public DocumentModel publishPortalAssets(DocumentModel portal) {
    CoreSession session = portal.getCoreSession();

    DocumentModel dialect = getDialect(portal);
    if (dialect == null) {
      throw new InvalidParameterException("Asset should be inside a dialect");
    }
    DocumentModelList proxies = session.getProxies(dialect.getRef(), null);
    if (proxies.isEmpty()) {
      throw new InvalidParameterException("Dialect should be published");
    }
    DocumentModel dialectSection = proxies.get(0);
    // DocumentModel input = getPublication(session, portal.getRef());

    // Portal should always be published at this point, skip if not
    // if (input == null) {
    // Already published
    // return input;
    // }

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
