package ca.firstvoices.workers;

import static ca.firstvoices.data.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;

import ca.firstvoices.core.io.services.TransitionChildrenStateService;
import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import ca.firstvoices.publisher.Constants;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.util.List;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.lifecycle.LifeCycleService;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.transaction.TransactionHelper;

/**
 * Clean Confusables worker will search for words and phrases that contain confusable characters,
 * and clean them. While this worker could potentially queue a full custom order recompute on the
 * dialect, it does not since a new custom order is calculated for each entry in the clean service
 */
@SuppressWarnings("java:S2160") // Nuxeo does not override equals in workers
public class PublishDialectWorker extends AbstractWork {

  private static final String LC_CONFUSABLES = "fvcharacter:confusable_characters";
  private static final String UC_CONFUSABLES = "fvcharacter:upper_case_confusable_characters";

  private static final long serialVersionUID = 1L;

  private final String job;

  private final DocumentRef jobContainerRef;

  private final int batchSize;

  private final transient FirstVoicesPublisherService fvPublisherService = Framework
      .getService(FirstVoicesPublisherService.class);

  private final TransitionChildrenStateService transitionChildrenService = Framework
      .getService(TransitionChildrenStateService.class);

  public PublishDialectWorker(DocumentRef dialectRef, String job, int batchSize) {
    super(Constants.PUBLISH_DIALECT_JOB_ID);
    this.jobContainerRef = dialectRef;
    this.job = job;
    this.batchSize = batchSize;

    RepositoryManager rpm = Framework.getService(RepositoryManager.class);

    // See https://doc.nuxeo.com/nxdoc/work-and-workmanager/#work-construction
    setDocument(rpm.getDefaultRepositoryName(), jobContainerRef.toString(), true);
  }

  @Override
  public void work() {

    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }

    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              DocumentModel dialect = session.getDocument(jobContainerRef);
              setStatus("Starting publishing of dialect `" + dialect.getTitle() + "`");

              try {
                // Transition dialect to publish
                fvPublisherService.transitionDialectToPublished(session, dialect);

                // Create proxy for dialect
                // Will create proxies for language/language family if not available
                fvPublisherService.publish(session, dialect);

                // Transition children
                for (DocumentModel child : session.getChildren(dialect.getRef())) {
                  // Publish direct children of dialect
                  if (StateUtils.followTransitionIfAllowed(child, PUBLISH_TRANSITION)) {
                    List<String> nonRecursiveTransitions = Framework
                        .getService(LifeCycleService.class)
                        .getNonRecursiveTransitionForDocType(child.getType());

                    if (nonRecursiveTransitions.contains(PUBLISH_TRANSITION)) {
                      // Handle publishing children if type not configured to do that automatically
                      // as defined by `noRecursionForTransitions` on the type.
                      transitionChildrenService
                          .transitionChildren(PUBLISH_TRANSITION, ENABLED_STATE, child);
                    }
                  }

                  session.save();

                  // commit the first child
                  TransactionHelper.commitOrRollbackTransaction();

                  // start a new transaction for following
                  TransactionHelper.startTransaction();
                }

                setStatus("Done");
                RequiredJobsUtils.removeFromRequiredJobs(dialect, job, true);
              } catch (Exception e) {
                setStatus("Failed");
                RequiredJobsUtils.removeFromRequiredJobs(dialect, job, false);
                workFailed(new NuxeoException(
                    "worker" + job + " failed on " + dialect.getTitle() + ": " + e.getMessage()));
              }
            });
  }

  /**
   * Method will find all the dictionary items that contain a confusable character Clean those
   * confusables (i.e. convert to the correct character), then publish, If no changes exist on the
   * document
   */
  private void processProxies(CoreSession session, DocumentModelList documents) {
    for (DocumentModel document : documents) {
      fvPublisherService.publish(session, document);
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
