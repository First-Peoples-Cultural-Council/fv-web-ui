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

import static ca.firstvoices.data.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.UNPUBLISH_TRANSITION;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_ALPHABET;
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
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_SHARED_DATA_NAME;

import ca.firstvoices.core.io.services.TransitionChildrenStateService;
import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.PropertyUtils;
import ca.firstvoices.core.io.utils.SessionUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.AbstractSession;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.PropertyException;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.lifecycle.LifeCycleService;
import org.nuxeo.ecm.core.model.Document;
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

  //================================================================================
  // TRANSITION METHODS
  // These do not deal with proxies; simply with transitioning state
  //================================================================================

  @Override
  public void transitionDialectToPublished(CoreSession session, DocumentModel dialect) {
    this.session = session;

    // Transition the dialect to the PUBLISHED state
    // This event will not be handled by publisher listener if this was executed via
    // the PublishDialect endpoint. Otherwise, consider that it will both TRANSITION and
    // create proxies
    if (dialect.getAllowedStateTransitions().contains(PUBLISH_TRANSITION)) {
      dialect.followTransition(PUBLISH_TRANSITION);
    } else {
      log.warn(
          String.format("Tried to publish document that is in an unpublishable state (%s)",
              dialect.getCurrentLifeCycleState()));
      return;
    }

    for (DocumentModel child : session.getChildren(dialect.getRef())) {
      if (StateUtils.followTransitionIfAllowed(child, PUBLISH_TRANSITION)) {
        List<String> nonRecursiveTransitions = Framework
            .getService(LifeCycleService.class)
            .getNonRecursiveTransitionForDocType(child.getType());

        if (nonRecursiveTransitions.contains(PUBLISH_TRANSITION)) {
          // Handle publishing children if type is not configured to do that automatically
          // as defined by `noRecursionForTransitions` on the type.
          if (FV_ALPHABET.equals(child.getType())) {
            // For alphabet we want to transition all characters to publish
            transitionChildrenService.transitionChildren(PUBLISH_TRANSITION, null, child);
          } else {
            // For all other types, we only want to transition enabled
            transitionChildrenService.transitionChildren(PUBLISH_TRANSITION, ENABLED_STATE, child);
          }
        }
      }
    }
  }

  //================================================================================
  // PUBLISH / REPUBLISH METHODS
  // These will handle creating proxies.
  // Generally, triggered by a lifecycle state change
  //================================================================================

  @Override
  public DocumentModel publish(CoreSession session, DocumentModel doc) {
    this.session = session;

    boolean isDialect = DialectUtils.isDialect(doc);

    // Skip if dialect is not published, and trying to publish within
    if (!isDialect && (!StateUtils.isPublished(DialectUtils.getDialect(doc))
        || getPublication(session, DialectUtils.getDialect(doc).getRef()) == null)) {
      log.warn(String
          .format("Tried to publish a `%s` type in a non-published dialect, "
                  + "or one without a proxy, doc id: %s",
              doc.getType(),
              doc.getId()));
      return null;
    }

    if (isDialect) {
      return createProxyForDialect(doc);
    } else if (FV_PORTAL.equals(doc.getType())) {
      return createProxyForPortal(doc);
    } else if (isPublishableAsset(doc.getType())) {
      DocumentModel proxyForAsset = createProxyForAsset(doc);

      if (FV_BOOK.equals(doc.getType())) {
        // For books, transition all direct children to publish
        // These events will be picked up by the listener
        // Better to do this here, then rely on BulkLifeCycleChangeListener
        // that may introduce the bug FW-1967
        transitionChildrenService.transitionChildren(PUBLISH_TRANSITION, null, doc);
      }

      return proxyForAsset;
    } else {
      return createProxy(doc);
    }
  }

  @Override
  public void republish(DocumentModel doc) {
    if (doc == null) {
      return;
    }

    if (doc.getCoreSession() != null) {
      this.session = doc.getCoreSession();
    }

    boolean isDialect = DialectUtils.isDialect(doc);

    // Skip if dialect is not published, and trying to republish within
    if (!isDialect && (!StateUtils.isPublished(DialectUtils.getDialect(doc))
        || getPublication(session, DialectUtils.getDialect(doc).getRef()) == null)) {
      log.warn(String
          .format("Tried to republish a `%s` type in a non-published dialect, "
                  + "or one without a proxy, doc id: %s",
              doc.getType(),
              doc.getId()));
      return;
    }

    DocumentModelList publishedDocs = new DocumentModelListImpl();

    // Update state from REPUBLISH->PUBLISH directly on a low-level doc
    // Will avoid going through life-cycle service and triggering
    // additional listener event. Proxy will have PUBLISH state too
    Document lowLevelDoc =
        ((AbstractSession) session).getSession().getDocumentByUUID(doc.getId());
    lowLevelDoc.setCurrentLifeCycleState(PUBLISHED_STATE);

    if (isPublishableAsset(doc.getType())) {
      publishedDocs.add(createProxyForAsset(doc));
    } else if (isDialect) {
      // Create proxy for portal
      publishedDocs.add(createProxyForPortal(session.getChild(doc.getRef(), FV_PORTAL_NAME)));

      // Create proxy for dialect
      publishedDocs.add(createProxyForDialect(doc));
    }

    if (publishedDocs.isEmpty() || publishedDocs.contains(null)) {
      log.error(String.format(
          "Republishing (overwriting proxy) not successful on doc %s (%s)",
          doc.getTitle(), doc.getId()));
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

    DocumentModel language = session.getParentDocument(dialect.getRef());
    DocumentModel languageFamily = session.getParentDocument(language.getRef());

    // Create proxy for language and parent
    DocumentModel languageProxy = getPublication(session, language.getRef());
    DocumentModel languageFamilyProxy = getPublication(session, languageFamily.getRef());

    DocumentModel rootSection = getRootSection(dialect);

    if (languageFamilyProxy == null) {
      languageFamilyProxy = session.publishDocument(languageFamily, rootSection);
    }

    if (languageProxy == null) {
      languageProxy = session.publishDocument(language, languageFamilyProxy);
    }

    // Create proxy for dialect
    DocumentModel proxy = session.publishDocument(dialect, languageProxy);

    if (proxy == null) {
      log.error("Create proxy failed for dialect " + dialect.getId());
      return null;
    }

    // Set properties on proxy
    Map<String, String> dependencies = new HashMap<>();

    dependencies.put("fvdialect:keyboards", "fvproxy:proxied_keyboards");
    dependencies.put("fvdialect:language_resources", "fvproxy:proxied_language_resources");

    handleProxyDependencies(proxy, dependencies, null);

    // Save changes to property values
    return SessionUtils.saveDocumentWithoutEvents(session, proxy, true, null);
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
    DocumentModel proxy = session.publishDocument(portal, dialectSection, true);

    if (proxy == null) {
      log.error("Create proxy failed for " + portal.getId());
      return null;
    }

    Map<String, String> dependencies = new HashMap<>();

    // Portal
    dependencies.put("fv-portal:featured_words", "fvproxy:proxied_words");
    dependencies.put("fv-portal:background_top_image", "fvproxy:proxied_background_image");
    dependencies.put("fv-portal:featured_audio", "fvproxy:proxied_featured_audio");
    dependencies.put("fv-portal:logo", "fvproxy:proxied_logo");
    dependencies.put("fv-portal:related_links", "fvproxy:proxied_related_links");

    handleProxyDependencies(proxy, dependencies, null);

    return SessionUtils.saveDocumentWithoutEvents(session, proxy, true, null);
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
    DocumentModel proxy = session.publishDocument(asset, parentSection, true);

    if (proxy == null) {
      log.error("Create proxy failed for " + asset.getId());
      return null;
    }

    // Add asset dependencies
    Map<String, String> dependencies = new HashMap<>();

    dependencies.put("fvcore:related_audio", "fvproxy:proxied_audio");
    dependencies.put("fvcore:related_pictures", "fvproxy:proxied_pictures");
    dependencies.put("fvcore:related_videos", "fvproxy:proxied_videos");
    dependencies.put("fvcore:source", "fvproxy:proxied_source");
    dependencies.put("fvcore:related_assets", "fvproxy:proxied_related_assets");

    if (asset.hasSchema("fvmedia")) {
      dependencies.put("fvmedia:source", "fvproxy:proxied_source");
      dependencies.put("fvmedia:recorder", "fvproxy:proxied_recorder");
      dependencies.put(MEDIA_ORIGIN_FIELD, "fvproxy:proxied_origin");
    }

    if (asset.hasSchema("fv-word")) {
      dependencies.put("fv-word:categories", "fvproxy:proxied_categories");
      dependencies.put("fv-word:related_phrases", "fvproxy:proxied_phrases");
    }

    if (asset.hasSchema("fvbook")) {
      dependencies.put("fvbook:author", "fvproxy:proxied_author");
    }

    if (asset.hasSchema("fv-phrase")) {
      dependencies.put("fv-phrase:phrase_books", "fvproxy:proxied_categories");
    }

    if (asset.hasSchema("fvcharacter")) {
      dependencies.put("fvcharacter:related_words", "fvproxy:proxied_words");
    }

    handleProxyDependencies(proxy, dependencies, Collections.singletonList(MEDIA_ORIGIN_FIELD));

    return SessionUtils.saveDocumentWithoutEvents(session, proxy, true, null);
  }


  /**
   * Iterates over dependencies (IDs referenced in fields such as `related_audio`) and publishes
   * those dependencies. The resulting ID of the proxy is assigned to the correct proxy field based
   * on the dependencies map. Can handle both single references and arrays.
   *
   * @param proxy                        the proxy to create values on (a proxy is a copy of a
   *                                     Workspace document in a sections)
   * @param dependencies                 a map of fields (workspace field : proxy field)
   * @param dependenciesToSkipPublishing optionally dependencies that should not be published
   */
  private void handleProxyDependencies(DocumentModel proxy, Map<String, String> dependencies,
      List<String> dependenciesToSkipPublishing) {

    if (dependenciesToSkipPublishing == null) {
      dependenciesToSkipPublishing = new ArrayList<>();
    }

    // Loop over dependencies and assign fields, or publish
    // These will either be single UUID, or arrays of UUIDs
    for (Entry<String, String> dependencyEntry : dependencies.entrySet()) {
      try {
        // Only proceed if the schema is present on the document
        String[] field = StringUtils.split(dependencyEntry.getKey(), ":");
        if (field == null || !proxy.hasSchema(field[0])) {
          continue;
        }

        String workspaceFieldName = dependencyEntry.getKey();
        String proxyFieldName = dependencyEntry.getValue();

        Property workspaceProperty = proxy.getProperty(workspaceFieldName);
        Property proxyProperty = proxy.getProperty(proxyFieldName);

        if (PropertyUtils.isEmpty(proxy, workspaceFieldName)) {
          // If the workspace field is empty, set proxy to null (empty)
          proxyProperty.setValue(null);
        } else {
          // If workspace field has a value, handle list/non list accordingly
          Set<String> workspacePropertyValues;

          if (workspaceProperty.isList()) {
            workspacePropertyValues =
                new HashSet<>(PropertyUtils.getValuesAsList(proxy, workspaceFieldName));
          } else {
            workspacePropertyValues = new HashSet<>(
                Collections.singleton(String.valueOf(workspaceProperty.getValueForWrite())));
          }

          // Iterate over each workspace id
          ArrayList<String> newProxyValues = new ArrayList<>();

          for (String workspaceDependencyId : workspacePropertyValues) {
            DocumentModel newProxy;
            IdRef dependencyRef = new IdRef(workspaceDependencyId);

            if (!session.exists(dependencyRef) || session.isTrashed(dependencyRef)) {
              // Skip if workspace dependency document is trashed or non-existent
              continue;
            }

            DocumentModel dependencyDoc = session.getDocument(dependencyRef);

            if (dependenciesToSkipPublishing.contains(workspaceFieldName)
                || dependencyDoc.getPathAsString().contains(FV_SHARED_DATA_NAME)) {
              // Do not attempt to publish origin field or SharedData dependencies
              // (e.g. Shared Links): both should get publication if available
              newProxy = getPublication(session, dependencyRef);
            } else {
              // Publish dependency (overwriting if needed)
              newProxy =
                  transitionAndCreateProxy(session, dependencyDoc);
            }

            if (newProxy != null && !newProxyValues.contains(newProxy.getId())) {
              // Add to list of values if it is not already there
              newProxyValues.add(newProxy.getId());
            }
          }

          // Set proxy values
          if (!newProxyValues.isEmpty()) {
            if (proxyProperty.isList()) {
              // Set as list
              proxyProperty.setValue(newProxyValues);
            } else {
              // Set as single value
              proxyProperty.setValue(newProxyValues.get(0));
            }
          }
        }
      } catch (PropertyException e) {
        log.warn(
            String.format("Could not handle property %s while writing proxy for %s of type %s",
                dependencyEntry.getKey(), proxy.getId(), proxy.getType()));
      }
    }
  }

  private DocumentModel transitionAndCreateProxy(CoreSession session, DocumentModel doc) {
    StateUtils.followTransitionIfAllowed(doc, PUBLISH_TRANSITION);

    // Get parent and publish
    // Stop at dialect. If dialect is not published, we shouldn't proceed
    DocumentModel parent = session.getParentDocument(doc.getRef());
    if (!StateUtils.isPublished(parent) && !DialectUtils.isDialect(parent)) {
      transitionAndCreateProxy(session, parent);
    }

    DocumentModel publishedDoc = publish(session, doc);

    if (publishedDoc == null) {
      // Warn if we could not create the proxy
      log.warn(String.format("transitionAndCreateProxy failed "
          + "for document %s of type %s", doc.getId(), doc.getType()));
    }

    return publishedDoc;
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
    } else if (isPublishableAsset(doc.getType())) {
      unpublishAsset(doc);
    } else if (DialectUtils.isDialectChild(doc)) {
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

    DocumentModel language = session.getParentDocument(dialect.getRef());
    DocumentModel languageFamily = session.getParentDocument(language.getRef());

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

  //================================================================================
  // GENERAL HELPER METHODS
  //================================================================================

  @Override
  public DocumentModel getPublication(CoreSession session, DocumentRef docRef) {
    DocumentModelList sections = session.getProxies(docRef, null);

    if (sections != null && !sections.isEmpty()) {
      DocumentModel publishedSection = sections.get(0);
      if (session.exists(publishedSection.getRef())) {
        // in the past getProxies very rarely would return a non-existent document
        // ensure document exists before returning
        return publishedSection;
      }
    }

    return null;
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

  /**
   * @return true if the asset should be handled by the asset publishing mechanism
   */
  private boolean isPublishableAsset(String type) {
    return FV_BOOK_ENTRY.equals(type) || FV_BOOK.equals(type) || FV_PHRASE.equals(type)
        || FV_WORD.equals(type) || FV_LABEL.equals(type) || FV_PICTURE.equals(type) || FV_VIDEO
        .equals(type) || FV_AUDIO.equals(type) || FV_CATEGORY.equals(type) || FV_CHARACTER
        .equals(type) || FV_GALLERY.equals(type) || FV_LINK.equals(type);
  }
}