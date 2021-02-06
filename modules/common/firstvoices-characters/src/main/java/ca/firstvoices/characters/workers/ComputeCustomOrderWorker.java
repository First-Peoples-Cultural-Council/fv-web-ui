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

package ca.firstvoices.characters.workers;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.services.CustomOrderComputeService;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.transaction.TransactionHelper;

/**
 * @author david
 */
@SuppressWarnings("java:S2160") // Nuxeo does not override equals in workers
public class ComputeCustomOrderWorker extends AbstractWork {

  private static final long serialVersionUID = 1L;

  private final DocumentRef dialectRef;
  private final int batchSize;

  private transient CustomOrderComputeService service = Framework
      .getService(CustomOrderComputeService.class);

  public ComputeCustomOrderWorker(DocumentRef dialectRef, int batchSize) {
    super(Constants.COMPUTE_ORDER_JOB_ID);
    this.dialectRef = dialectRef;
    this.batchSize = batchSize;

    RepositoryManager rpm = Framework.getService(RepositoryManager.class);
    setDocument(rpm.getDefaultRepositoryName(), dialectRef.toString(), true);
  }

  @Override
  public void work() {

    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }

    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {

              DocumentModel dialect = session.getDocument(dialectRef);
              setStatus("Recalculating custom order for `" + dialect.getTitle() + "`");

              try {
                // execute a first query to get total size and work on first batch
                String dictionaryId = session
                    .getChild(dialectRef, DialectTypesConstants.FV_DICTIONARY_NAME).getId();

                String query = "SELECT * FROM Document WHERE ecm:parentId='" + dictionaryId + "'"
                    + " AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0";

                DocumentModelList docs = session.query(query, null, batchSize, 0, true);

                long totalSize = docs.totalSize();

                setProgress(new Progress(0, totalSize));

                // Do work on first batch
                updateCustomOrderForEntries(session, docs);
                session.save();

                // commit the first batch
                TransactionHelper.commitOrRollbackTransaction();

                // Move on to next batches
                for (long offset = batchSize; offset < totalSize; offset += batchSize) {
                  long i = offset;
                  // start a new transaction
                  TransactionHelper.runInTransaction(() -> {
                    DocumentModelList nextDocs = session.query(query, null, batchSize, i, false);
                    updateCustomOrderForEntries(session, nextDocs);
                    session.save();
                  });

                  setProgress(new Progress(i, totalSize));
                }

                // start a new transaction for following
                TransactionHelper.startTransaction();

                setStatus("Done");
                RequiredJobsUtils
                    .removeFromRequiredJobs(dialect, Constants.COMPUTE_ORDER_JOB_ID, true);

              } catch (Exception e) {
                setStatus("Failed");
                RequiredJobsUtils
                    .removeFromRequiredJobs(dialect, Constants.COMPUTE_ORDER_JOB_ID, false);
                workFailed(new NuxeoException(
                    "worker" + Constants.COMPUTE_ORDER_JOB_ID + " failed on " + dialect.getTitle()
                        + ": " + e.getMessage()));
              }
            });
  }

  private void updateCustomOrderForEntries(CoreSession session, DocumentModelList docs) {
    for (DocumentModel doc : docs) {
      service.computeAssetNativeOrderTranslation(session, doc, true, false);
    }
  }

  @Override
  public String getTitle() {
    return Constants.COMPUTE_ORDER_JOB_ID;
  }

  @Override
  public String getCategory() {
    return Constants.CHARACTER_WORKERS_QUEUE;
  }


}
