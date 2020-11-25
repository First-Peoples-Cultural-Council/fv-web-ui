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

package ca.firstvoices.security.operations;

import java.util.List;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentLocationImpl;
import org.nuxeo.ecm.platform.publisher.api.PublicationTree;
import org.nuxeo.ecm.platform.publisher.api.PublishedDocument;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;

public abstract class AbstractFVPublishOperation {

  protected PublicationTree tree;

  protected CoreSession session;

  protected PublisherService ps = Framework.getService(PublisherService.class);

  protected AutomationService service = Framework.getService(AutomationService.class);

  /**
   * @param doc document to check published versions for.
   * @return {@code true} if document has ANY published version; {@code false} otherwise
   */
  protected boolean hasPublication(DocumentModel doc) {

    List<PublishedDocument> publishedDocuments = tree
        .getExistingPublishedDocument(new DocumentLocationImpl(doc));

    return !publishedDocuments.isEmpty();
  }

  /**
   * Method finds a section to publish to based on the document TODO: Ensure this is a little more
   * intelligent than selecting the first section found.
   *
   * @param doc
   * @return section to publish to or {@code null}
   */
  protected DocumentModel getSectionToPublishTo(DocumentModel doc) {

    DocumentModelList sections = session.getProxies(doc.getRef(), null);

    for (DocumentModel section : sections) {
      // Ensure section is within the publication target
      if (section.getPath().toString().indexOf(tree.getPath()) == 0) {
        return section;
      }
    }

    return null;
  }

}
