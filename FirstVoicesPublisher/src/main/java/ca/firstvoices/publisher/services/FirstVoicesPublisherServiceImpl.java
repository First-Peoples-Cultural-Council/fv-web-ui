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
import static ca.firstvoices.data.lifecycle.Constants.UNPUBLISH_TRANSITION;
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

import ca.firstvoices.core.io.services.TransitionChildrenStateService;
import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.SessionUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.publisher.listeners.ProxyPublisherListener;
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
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;

/**
 * @author loopingz
 */
public class FirstVoicesPublisherServiceImpl implements FirstVoicesPublisherService {

  private static final Log log = LogFactory.getLog(FirstVoicesPublisherServiceImpl.class);

  private static final String MEDIA_ORIGIN_FIELD = "fvmedia:origin";

  private final TransitionChildrenStateService transitionChildrenService = Framework
      .getService(TransitionChildrenStateService.class);

  private CoreSession session;

  @Override
  public void transitionDialectToPublished(CoreSession session, DocumentModel dialect) {
    this.session = session;

    // Transition the dialect to the PUBLISHED state
    // This event will not be handled by publisher listener
    if (dialect.getAllowedStateTransitions().contains(PUBLISH_TRANSITION)) {
      dialect.followTransition(PUBLISH_TRANSITION);
    } else {
      log.warn(
          String.format("Tried to publish document that is in an unpublishable state (%s)",
              dialect.getCurrentLifeCycleState()));
      return;
    }

    // This code may not be needed?
    //    for (DocumentModel child : session.getChildren(dialect.getRef())) {
    //      if (StateUtils.followTransitionIfAllowed(child, PUBLISH_TRANSITION)) {
    //        List<String> nonRecursiveTransitions = Framework
    //            .getService(LifeCycleService.class)
    //            .getNonRecursiveTransitionForDocType(child.getType());
    //
    //        if (nonRecursiveTransitions.contains(PUBLISH_TRANSITION)) {
    //          // Handle publishing children if type is not configured to do that automatically
    //          // as defined by `noRecursionForTransitions` on the type.
    //          transitionChildrenService.transitionChildren(PUBLISH_TRANSITION,
    //          ENABLED_STATE, child);
    //        }
    //      }
    //    }
  }


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

  private DocumentModel transitionAndCreateProxy(CoreSession session, DocumentModel doc) {
    // Ensure a listener does not fire for this event
    doc.putContextData(ProxyPublisherListener.DISABLE_PUBLISHER_LISTENER, true);
    StateUtils.followTransitionIfAllowed(doc, PUBLISH_TRANSITION);

    // Get parent and publish
    // Stop at dialect. If dialect is not published, we shouldn't proceed
    DocumentModel parent = session.getParentDocument(doc.getRef());
    if (!StateUtils.isPublished(parent) && !DialectUtils.isDialect(parent)) {
      transitionAndCreateProxy(session, parent);
    }

    return publish(session, doc);
  }

  private DocumentModel getOrCreateParentProxy(DocumentModel doc) {
    DocumentModel parent = session.getDocument(doc.getParentRef());
    DocumentModel parentSection = getPublication(session, parent.getRef());

    if (parentSection == null) {
      // Parent does not have proxy, create proxy for parent first
      parentSection = publish(session, parent);
    }

    return parentSection;
  }

  @Override
  public DocumentModel getPublication(CoreSession session, DocumentRef docRef) {
    DocumentModelList sections = session.getProxies(docRef, null);

    if (!sections.isEmpty()) {
      DocumentModel publishedSection = sections.get(0);
      if (session.exists(publishedSection.getRef())) {
        // in the past getProxies very rarely would return a non-existent document
        // ensure document exists before returning
        return publishedSection;
      }
    }

    return null;
  }

  private boolean isAssetType(String type) {
    return FV_BOOK_ENTRY.equals(type) || FV_BOOK.equals(type) || FV_PHRASE.equals(type)
        || FV_WORD.equals(type) || FV_LABEL.equals(type) || FV_PICTURE.equals(type) || FV_VIDEO
        .equals(type) || FV_AUDIO.equals(type) || FV_CATEGORY.equals(type) || FV_CHARACTER
        .equals(type) || FV_GALLERY.equals(type) || FV_LINK.equals(type);
  }

  private boolean isDialectChild(DocumentModel child) {
    return child.getParentRef().equals(DialectUtils.getDialect(child).getRef());
  }

  @Override
  public void republish(DocumentModel doc) {
    if (doc == null) {
      return;
    }

    if (doc.getCoreSession() != null) {
      this.session = doc.getCoreSession();
    }

    DocumentModel publishedDoc = null;

    if (isAssetType(doc.getType())) {
      publishedDoc = createProxyForAsset(doc);
    } else if (DialectUtils.isDialect(doc)) {
      // Create proxy for portal
      createProxyForPortal(session.getChild(doc.getRef(), FV_PORTAL_NAME));

      // Create proxy for dialect
      publishedDoc = createProxyForDialect(doc);
    }

    // After republish move back to publish state if applicable
    // If doRepublish is called directly, no transition is required
    StateUtils.followTransitionIfAllowed(doc, PUBLISH_TRANSITION);

    if (publishedDoc == null) {
      log.error(String.format(
          "Republishing (overwriting proxy) not successful on doc %s (%s)",
          doc.getTitle(), doc.getId()));
    }
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

  //================================================================================
  // PUBLISH METHODS
  // These will handle creating proxies.
  // Generally, triggered by a lifecycle state change
  //================================================================================

  @Override
  public DocumentModel publish(CoreSession session, DocumentModel doc) {
    this.session = session;

    if (FV_DIALECT.equals(doc.getType())) {
      return createProxyForDialect(doc);
    } else if (FV_PORTAL.equals(doc.getType())) {
      return createProxyForPortal(doc);
    } else if (isAssetType(doc.getType())) {
      return createProxyForAsset(doc);
    } else {
      return createProxy(doc);
    }
  }

  //================================================================================
  // PROXY METHODS
  // Proxies are copies of Workspace documents that are stored in `sections`
  //================================================================================

  /**
   * Create a proxy for a basic document. Does not require any special field mapping.
   *
   * @param doc the document to create a proxy for
   * @return the created proxy
   */
  private DocumentModel createProxy(DocumentModel doc) {
    if (!PUBLISHED_STATE.equals(doc.getCurrentLifeCycleState())
        || !PUBLISHED_STATE.equals(DialectUtils.getDialect(doc).getCurrentLifeCycleState())) {
      return null;
    }

    return session.publishDocument(doc, getOrCreateParentProxy(doc), true);
  }

  /**
   * Create a proxy for a dialect, creating proxies for the parents (language family/language) if
   * needed. Will also publish dependencies within the dialect and map ID fields to the correct
   * proxy field (e.g. "fvdialect:keyboards" -> "fvproxy:proxied_keyboards")
   *
   * @param dialect Workspace dialect to create a proxy for
   * @return the proxy that was created
   */
  private DocumentModel createProxyForDialect(DocumentModel dialect) {
    // (LanguageFamily/Language/Dialect)
    Map<String, DocumentModel> ancestors = getAncestors(dialect);

    DocumentModel languageFamily = ancestors.get("LanguageFamily");

    DocumentModel section = getRootSection(dialect);

    // Create proxy for grand parent
    if (!isPublished(languageFamily, section)) {
      session.publishDocument(languageFamily, section);
    }

    // assign Language Family to section
    section = getPublication(session, languageFamily.getRef());

    // Create proxy for parent
    DocumentModel language = ancestors.get("Language");

    if (!isPublished(language, section)) {
      session.publishDocument(language, section);
    }

    // assign Language to section
    section = getPublication(session, language.getRef());

    // Create proxy for dialect
    DocumentModel dialectProxy = session.publishDocument(dialect, section);

    // Set properties on proxy
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

        if (session.exists(dependencyRef) && !session.isTrashed(dependencyRef)) {
          // Publish dependency (overwriting if needed)
          DocumentModel publishedDep = transitionAndCreateProxy(session,
              session.getDocument(dependencyRef));
          dependencyPublishedPropertyValues.add(publishedDep.getRef().toString());
        }
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

  /**
   * Create a proxy for a portal object. Similar to dialect for most functionality, however maps
   * different fields.
   *
   * @param portal to create a proxy for
   * @return proxy that was created
   */
  private DocumentModel createProxyForPortal(DocumentModel portal) {
    // Get dialect section
    DocumentModel dialectSection = getOrCreateParentProxy(portal);

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

        if (session.exists(dependencyRef) && !session.isTrashed(dependencyRef)) {
          // Publish dependency (overwriting if needed)
          DocumentModel publishedDep =
              transitionAndCreateProxy(session, session.getDocument(dependencyRef));

          // Handle exception property values as arrays
          if (dependencyEntry.getKey().equals("fv-portal:featured_words") || dependencyEntry
              .getKey()
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
    }

    return SessionUtils.saveDocumentWithoutEvents(session, input, true, null);
  }

  /**
   * Creates a proxy for an asset type (as defined by isAssetType). This will map fields for words,
   * phrases, publish categories (and parent categories), and publish other dependencies.
   *
   * @param asset to create a proxy for
   * @return proxy that was created for asset
   */
  private DocumentModel createProxyForAsset(DocumentModel asset) {
    // Get parent section
    DocumentModel parentSection = getOrCreateParentProxy(asset);

    // Create proxy (overwriting existing one if applicable)
    DocumentModel input = session.publishDocument(asset, parentSection, true);

    if (input == null) {
      log.error("Create proxy failed for " + asset.getId());
      return null;
    }
    // TODO: Extract common pieces of dependencies into common method
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

        if (MEDIA_ORIGIN_FIELD.equals(dependencyEntry.getKey())) {
          // Origin should be grabbed if it is published
          // Shouldn't be automatically published
          DocumentModel originPublication = getPublication(session, dependencyRef);

          if (originPublication != null) {
            input.setPropertyValue(dependencyEntry.getValue(), String.valueOf(originPublication));
          }

        } else {
          if (session.exists(dependencyRef) && !session.isTrashed(dependencyRef)) {
            // Publish dependency (overwriting if needed)
            DocumentModel publishedDep =
                transitionAndCreateProxy(session, session.getDocument(dependencyRef));

            // Handle as array
            String[] updatedProperty = PublisherUtils.constructDependencyPropertyValueAsArray(
                (String[]) input.getPropertyValue(dependencyEntry.getValue()), publishedDep);
            input.setPropertyValue(dependencyEntry.getValue(), updatedProperty);
          }
        }
      }
    }

    return SessionUtils.saveDocumentWithoutEvents(session, input, true, null);
  }

  //================================================================================
  // UNPUBLISH METHODS
  // These will handle a mixture of transitions and removing proxies
  //================================================================================

  @Override
  public void unpublish(DocumentModel doc) {
    if (doc == null) {
      return;
    }

    if (doc.getCoreSession() != null) {
      this.session = doc.getCoreSession();
    }

    if (FV_DIALECT.equals(doc.getType())) {
      unpublishDialect(doc);
    } else if (isAssetType(doc.getType())) {
      unpublishAsset(doc);
    } else if (isDialectChild(doc)) {
      unpublishDialectChild(doc);
    }
  }

  /**
   * Will remove all proxies for a dialect, including the parent language and family if empty. Will
   * also transition all children from the `Published` state Intended to trigger after a lifecycle
   * transition event of `Unpublish` on the dialect.
   */
  public void unpublishDialect(DocumentModel dialect) {
    session = dialect.getCoreSession();
    Map<String, DocumentModel> ancestors = getAncestors(dialect);
    DocumentModel languageFamily = ancestors.get("LanguageFamily");
    DocumentModel language = ancestors.get("Language");

    if (session.hasChild(getRootSection(dialect).getRef(), languageFamily.getName())) {
      // If language family exists in `sections`
      DocumentModel languageFamilySection = session
          .getChild(getRootSection(dialect).getRef(), languageFamily.getName());

      if (session.hasChild(languageFamilySection.getRef(), language.getName())) {
        // If language exists in `sections`
        DocumentModel languageSection = session
            .getChild(languageFamilySection.getRef(), language.getName());

        if (session.hasChild(languageSection.getRef(), dialect.getName())) {
          // If dialect exists in `sections`
          DocumentModel dialectSection =
              session.getChild(languageSection.getRef(), dialect.getName());

          // Remove dialect from `sections`
          session.removeDocument(dialectSection.getRef());
        }

        if (session.getChildren(languageSection.getRef()).isEmpty()) {
          // Language section is empty, remove language
          session.removeDocument(languageSection.getRef());
        }
      }

      if (session.getChildren(languageFamilySection.getRef()).isEmpty()) {
        // Language family section is empty, remove language
        session.removeDocument(languageFamilySection.getRef());
      }
    }

    // Transition the state of the children
    transitionChildrenService.transitionChildren(UNPUBLISH_TRANSITION, PUBLISHED_STATE, dialect);
  }


  /**
   * Remove an asset proxy; won't clear proxies for related assets since they may be used by other
   * assets.
   */
  public void unpublishAsset(DocumentModel asset) {
    DocumentModel proxy = getPublication(asset.getCoreSession(), asset.getRef());
    if (proxy != null && session.exists(proxy.getRef())) {
      asset.getCoreSession().removeDocument(proxy.getRef());
    }
  }

  /**
   * Remove a direct child of a dialect (container) and transition relevant children
   */
  public void unpublishDialectChild(DocumentModel dialectChild) {
    DocumentModel proxy = getPublication(dialectChild.getCoreSession(), dialectChild.getRef());
    if (proxy != null && session.exists(proxy.getRef())) {
      dialectChild.getCoreSession().removeDocument(proxy.getRef());
    }

    // Transition all children that are in the published state
    transitionChildrenService.transitionChildren(UNPUBLISH_TRANSITION,
        PUBLISHED_STATE, dialectChild);
  }
}
