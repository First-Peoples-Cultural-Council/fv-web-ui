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

package ca.firstvoices.core.io.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.runtime.transaction.TransactionHelper;


public class TransitionChildrenStateServiceImpl implements TransitionChildrenStateService {

  public void transitionChildren(String transition, String affectedState, DocumentModel doc) {
    CoreSession session = doc.getCoreSession();

    long pageSize = 500;

    StringBuilder query = new StringBuilder();

    // execute a first query to know total size
    query.append(String.format(
        "SELECT * FROM Document WHERE ecm:parentId ='%s' "
            + "AND ecm:isProxy = 0 "
            + "AND ecm:isTrashed = 0 "
            + "AND ecm:isVersion = 0",
        doc.getId()));

    if (affectedState != null) {
      query.append(String.format(" AND ecm:currentLifeCycleState = '%s' ", affectedState));
    }

    DocumentModelList documents = session.query(String.valueOf(query), null, pageSize, 0, true);
    changeDocumentState(documents, transition);
    session.save();

    // commit the first page
    TransactionHelper.commitOrRollbackTransaction();

    // loop on other children
    long nbChildren = documents.totalSize();
    for (long offset = pageSize; offset < nbChildren; offset += pageSize) {
      long i = offset;
      // start a new transaction
      TransactionHelper.runInTransaction(() -> {
        DocumentModelList docs = session.query(String.valueOf(query), null, pageSize, i, false);
        changeDocumentState(docs, transition);
        session.save();
      });
    }

    // start a new transaction for following
    TransactionHelper.startTransaction();
  }

  private void changeDocumentState(DocumentModelList docs, String transition) {
    for (DocumentModel doc : docs) {
      if (doc.getAllowedStateTransitions().contains(transition)) {
        doc.followTransition(transition);
      }
    }
  }
}
