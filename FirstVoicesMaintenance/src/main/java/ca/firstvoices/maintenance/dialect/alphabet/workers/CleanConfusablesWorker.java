package ca.firstvoices.maintenance.dialect.alphabet.workers;

import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;

import ca.firstvoices.maintenance.dialect.alphabet.Constants;
import ca.firstvoices.maintenance.services.MaintenanceLogger;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.services.CleanupCharactersService;
import ca.firstvoices.services.UnpublishedChangesService;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.transaction.TransactionHelper;

public class CleanConfusablesWorker extends AbstractWork {

  private static final long serialVersionUID = 1L;

  private final String job;
  private final DocumentRef jobContainerRef;
  private final int batchSize;

  private final transient CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  public CleanConfusablesWorker(DocumentRef jobContainerRef, String job, int batchSize) {
    super(Constants.CLEAN_CONFUSABLES_JOB_ID);
    this.jobContainerRef = jobContainerRef;
    this.job = job;
    this.batchSize = batchSize;

    RepositoryManager rpm = Framework.getService(RepositoryManager.class);

    // See https://doc.nuxeo.com/nxdoc/work-and-workmanager/#work-construction
    setDocument(rpm.getDefaultRepositoryName(), jobContainerRef.toString(), true);
  }

  @Override
  public void work() {

    MaintenanceLogger maintenanceLogger = Framework.getService(MaintenanceLogger.class);

    if (isSuspending()) {
      // don't run anything if we're being started while a suspend
      // has been requested
      suspended();
      return;
    }

    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }

    openSystemSession();

    DocumentModel jobContainer = session.getDocument(jobContainerRef);
    setStatus("Starting migrate category for words in `" + jobContainer.getTitle() + "`");

    try {
      DocumentModel alphabet = cleanupCharactersService.getAlphabet(jobContainer);
      DocumentModelList characters = cleanupCharactersService.getCharacters(alphabet);

      // Replace with a select (!) of just the chars that have confusables defined

      /// DO NOT DO ANY OF THIS IF A ADDCONFUSABLES task is pending

      for (DocumentModel character : characters) {

        String[] confusableLowercaseChars = (String[]) character
            .getPropertyValue("fvcharacter:confusable_characters");
        String[] uppercaseConfusableChars = (String[]) character
            .getPropertyValue("fvcharacter:upper_case_confusable_characters");

        for (String confusableChar : confusableLowercaseChars) {

          String query = "SELECT * FROM FVWord, FVPhrase WHERE "
              + "dc:title LIKE '%" + NXQL.escapeStringInner(confusableChar) + "%'"
              + " AND ecm:isTrashed = 0 AND ecm:isProxy = 0 AND ecm:isVersion = 0";

          DocumentModelList dictionaryItems = session.query(query);

          for (DocumentModel dictionaryItem : dictionaryItems) {

            // Check for unpublished changes (before we clean confusables)

            FirstVoicesPublisherService firstVoicesPublisherService = Framework
                .getService(FirstVoicesPublisherService.class);

            UnpublishedChangesService unpublishedChangesService = Framework
                .getService(UnpublishedChangesService.class);

            boolean unpublishedChangesExist = unpublishedChangesService
                .checkUnpublishedChanges(session, dictionaryItem);

            // Clean confusables for document
            cleanupCharactersService.cleanConfusables(session, dictionaryItem, true);

            if (!unpublishedChangesExist && dictionaryItem.getCurrentLifeCycleState()
                .equals(PUBLISHED_STATE)) {
              firstVoicesPublisherService.republish(dictionaryItem);
            }


          }

        }
      }

      // Get alphabet characters that have confusables
      // Find words that have those confusables

      int wordsRemaining = 1;

      while (wordsRemaining != 0) {

        // DO WORK!
        --wordsRemaining;

        // Create transaction for next batch
        // See examples:
        // nuxeo @ org/nuxeo/ecm/core/BatchProcessorWork.java
        // nuxeo @ org/nuxeo/elasticsearch/work/BucketIndexingWorker.java
        // nuxeo @ org/nuxeo/ai/transcribe/TranscribeWork
        TransactionHelper.commitOrRollbackTransaction();
        TransactionHelper.startTransaction();

        //Add real progress here when we can modify query for total words
        //setProgress(new Progress(((float) wordsRemaining / totalWords) * 100));
      }
    } catch (Exception e) {
      setStatus("Failed");
      maintenanceLogger.removeFromRequiredJobs(jobContainer, job, false);
      workFailed(new NuxeoException(
          "worker migration failed on " + jobContainer.getTitle() + ": " + e.getMessage()));
    }

    maintenanceLogger.removeFromRequiredJobs(jobContainer, job, true);
    setStatus("No more words to migrate in `" + jobContainer.getTitle() + "`");

  }

  @Override
  public void cleanUp(boolean ok, Exception e) {
    setStatus("Worker done for `" + jobContainerRef + "`");
    super.cleanUp(ok, e);
  }

  @Override
  public String getTitle() {
    return Constants.CLEAN_CONFUSABLES_JOB_ID;
  }

  @Override
  public String getCategory() {
    return ca.firstvoices.maintenance.Constants.EXECUTE_REQUIRED_JOBS_EVENT_ID;
  }
}
