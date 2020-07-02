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

package ca.firstvoices.listeners;

import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import org.jboss.seam.core.Events;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.publisher.api.PublicationTree;
import org.nuxeo.ecm.platform.publisher.api.PublishedDocument;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.webapp.helpers.EventNames;
import org.nuxeo.runtime.api.Framework;

/**
 * Approves or Rejects Language Administrators' publishing a dialect based on whether it is their
 * dialect.
 */
public class RestrictFVDialectPublishing implements EventListener {

  protected static PublisherService publisherService = Framework.getService(PublisherService.class);

  protected void rejectDocument(String publishingComment, DocumentModel docToReject,
      CoreSession session) {

    PublicationTree tree = publisherService.getPublicationTreeFor(docToReject, session);
    PublishedDocument publishedDocument = tree.wrapToPublishedDocument(docToReject);
    tree.validatorRejectPublication(publishedDocument, publishingComment);

    Events.instance().raiseEvent(EventNames.DOCUMENT_PUBLICATION_REJECTED);
  }

  @Override
  public void handleEvent(Event event) throws NuxeoException {
    EventContext ctx = event.getContext();
    CoreSession session = ctx.getCoreSession();
    NuxeoPrincipal principal = ctx.getPrincipal();

    // Skip non-document events and administrator
    if (!(ctx instanceof DocumentEventContext) || principal.isAdministrator()) {
      return;
    }

    for (Object doc : ctx.getArguments()) {
      // A Language Administrator trying TO PUBLISH someone else's Dialect
      if (doc instanceof DocumentModel && ((DocumentModel) doc).getType().equals(FV_DIALECT)) {
        DocumentModel currentDoc = (DocumentModel) doc;

        // Check if principal has EVERYTHING permission on the source dialect,
        // approve publishing immediately
        if (session.hasPermission(principal, new IdRef(currentDoc.getSourceId()),
            SecurityConstants.EVERYTHING)) {
          // By default, Language Administrators do not seem to need approval for this level.
          return;
        } else {
          // They don't have EVERYTHING on the source dialect, reject publishing immediately
          rejectDocument("Can't publish someone else's Dialect.", currentDoc, session);
        }
      }
    }

  }
}
