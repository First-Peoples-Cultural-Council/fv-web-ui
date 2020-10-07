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

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;

/**
 * @author loopingz
 */
public interface FirstVoicesPublisherService {

  /**
   * Publish a dialect, publishing its parents if needed and its direct publishable children
   *
   * @param dialect
   */
  DocumentModel publishDialect(DocumentModel dialect);

  /**
   * Publish a dialect, optionally publishing children
   *
   * @param dialect
   */
  DocumentModel publishDialect(DocumentModel dialect, boolean publishChildren);


  /**
   * Publish or republish a portal's assets (arrays or strings)
   *
   * @param portal
   */
  DocumentModel publishPortalAssets(DocumentModel portal);

  /**
   * Unpublish a dialect, cleaning its parent if they have no more child
   *
   * @param dialect
   */
  void unpublishDialect(DocumentModel dialect);

  /**
   * Publish an asset, publishing its related assets and adding proxies information
   *
   * @param asset
   */
  DocumentModel publishAsset(DocumentModel asset);

  /**
   * Unpublish an asset, it wont clean the related assets
   *
   * @param asset
   */
  void unpublishAsset(DocumentModel asset);

  /**
   * Will split depending on the document between unpublishAsset and unpublishDialect
   *
   * @param doc to unpublish
   */
  void unpublish(DocumentModel doc);

  /**
   * Will split depending on the document between publishAsset and publishDialect
   *
   * @param doc to publish
   */
  DocumentModel publish(DocumentModel doc);

  /**
   * Method to queue a republish
   * Transitions lifecycle state to Republish, to be picked up by listener
   * @param doc document to republish
   */
  void queueRepublish(DocumentModel doc);

  /**
   * Performs the republishing operation. Called via a listener.
   * It is preferred to not call this directly to give documents an opportunity
   * to save properly. Call queueRepublish instead.
   * @param doc
   * @return
   */
  DocumentModel doRepublish(DocumentModel doc);

  DocumentModel getPublication(CoreSession session, DocumentRef docRef);

  DocumentModel publishDocument(CoreSession session, DocumentModel doc, DocumentModel section);

  DocumentModel setDialectProxies(DocumentModel dialectProxy);

  void removeTrashedCategoriesOrPhrasebooksFromWordsOrPhrases(CoreSession session,
      DocumentModel doc);

  DocumentModel publishDocumentIfDialectPublished(CoreSession session,
      DocumentModel documentModel);

}
