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

package ca.firstvoices.editors.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;

public interface DraftEditorService {

  public void putUUIDInfo(CoreSession session, DocumentModel doc, String key, String value);

  public String getUUID(DocumentModel doc, String key);

  public void removeUUIDInfo(DocumentModel liveDoc, String referenceKey);

  public DocumentModel editDraftForDocument(DocumentModel doc);

  public DocumentModel publishDraftDocument(DocumentModel draftDoc);

  public void saveEditedDraftDocument(DocumentModel draftDoc);

  // public boolean canEditDraftDocument( DocumentModel doc ); // dont use it until verified to
  // work correctly
  public DocumentRef getDraftDocumentRefIfExists(DocumentModel liveDoc);

  public boolean releaseTimedOutLock(DocumentModel doc);

  public DocumentModel terminateDraftEditSession(DocumentModel doc);
}
