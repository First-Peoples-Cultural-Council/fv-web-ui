package ca.firstvoices.workers;

import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import ca.firstvoices.publisher.Constants;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
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
 * Clean Confusables worker will search for words and phrases that contain confusable characters,
 * and clean them. While this worker could potentially queue a full custom order recompute on the
 * dialect, it does not since a new custom order is calculated for each entry in the clean service
 */
@SuppressWarnings("java:S2160") // Nuxeo does not override equals in workers
public class CreateProxiesWorker extends AbstractWork {

  private static final long serialVersionUID = 1L;

  private final String job;

  private final DocumentRef dialectRef;

  private final int batchSize;

  private final transient FirstVoicesPublisherService fvPublisherService = Framework
      .getService(FirstVoicesPublisherService.class);

  public CreateProxiesWorker(DocumentRef dialectRef, int batchSize) {
    super(Constants.PUBLISH_DIALECT_JOB_ID);

    this.job = Constants.PUBLISH_DIALECT_JOB_ID;
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
              setStatus("Starting create proxies for dialect `" + dialect.getTitle() + "`");

              try {
                // Create proxies for everything that is in the published state
                String query = String.format(
                    "SELECT * FROM Document WHERE ecm:ancestorId = '%s' "
                        + "AND ecm:isVersion = 0 AND ecm:isProxy = 0 "
                        + "AND ecm:currentLifeCycleState LIKE 'Published' ORDER BY ecm:path",
                    dialect.getId());

                DocumentModelList documents = session
                    .query(query, null, batchSize, 0, true);

                setProgress(new Progress(0, documents.size()));

                createProxies(session, documents);
                session.save();

                // commit the first page
                TransactionHelper.commitOrRollbackTransaction();

                // loop on other documents
                long nbChildren = documents.totalSize();
                for (long offset = batchSize; offset < nbChildren; offset += batchSize) {
                  long i = offset;
                  // start a new transaction
                  TransactionHelper.runInTransaction(() -> {
                    DocumentModelList docs = session.query(query, null, batchSize, i, false);
                    createProxies(session, docs);
                    session.save();
                  });

                  setProgress(new Progress(i, documents.size()));
                }

                // Start new transaction
                TransactionHelper.startTransaction();

                setStatus("Done");
                RequiredJobsUtils.removeFromRequiredJobs(dialect, job, true);
              } catch (Exception e) {
                setStatus("Failed");
                RequiredJobsUtils.removeFromRequiredJobs(dialect, job, false);
                workFailed(new NuxeoException(
                    "worker " + job + " failed on " + dialect.getTitle() + ": "
                        + e.getMessage()));
              }
            });
  }

  private void createProxies(CoreSession session, DocumentModelList docs) {
    for (DocumentModel doc : docs) {
      fvPublisherService.publish(session, doc);
    }
  }

  @Override
  public String getTitle() {
    return Constants.PUBLISH_DIALECT_JOB_ID;
  }

  @Override
  public String getCategory() {
    return Constants.PUBLISHING_WORKERS_QUEUE;
  }
}
