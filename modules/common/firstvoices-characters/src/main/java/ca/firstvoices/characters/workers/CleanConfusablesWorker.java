package ca.firstvoices.characters.workers;

import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.services.CleanupCharactersService;
import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import ca.firstvoices.publisher.services.UnpublishedChangesService;
import org.apache.commons.lang3.ArrayUtils;
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
public class CleanConfusablesWorker extends AbstractWork {

  private static final String LC_CONFUSABLES = "fvcharacter:confusable_characters";
  private static final String UC_CONFUSABLES = "fvcharacter:upper_case_confusable_characters";

  private static final long serialVersionUID = 1L;

  private final String job;

  private final DocumentRef jobContainerRef;

  private final int batchSize;

  private final transient CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  public CleanConfusablesWorker(DocumentRef dialectRef, String job, int batchSize) {
    super(Constants.CLEAN_CONFUSABLES_JOB_ID);
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
              String dictionaryId = session
                  .getChild(dialect.getRef(), DialectTypesConstants.FV_DICTIONARY_NAME).getId();

              setStatus("Cleaning confusables `" + dialect.getTitle() + "`");

              try {
                DocumentModelList characters = cleanupCharactersService
                    .getCharactersWithConfusables(dialect);

                setProgress(new Progress(0, characters.size()));

                int i = 1;

                for (DocumentModel character : characters) {

                  String[] confusables = ArrayUtils
                      .addAll((String[]) character.getPropertyValue(LC_CONFUSABLES),
                          (String[]) character.getPropertyValue(UC_CONFUSABLES));

                  if (ArrayUtils.isNotEmpty(confusables)) {
                    for (String confusableChar : confusables) {
                      processWordsForConfusable(session, dictionaryId, confusableChar);
                    }
                  }

                  // Create transaction for next batch
                  TransactionHelper.commitOrRollbackTransaction();
                  TransactionHelper.startTransaction();

                  setProgress(new Progress(i, characters.size()));
                  ++i;
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
   *
   * @param confusableChar to search for
   */
  private void processWordsForConfusable(CoreSession session, String dictionaryId,
      String confusableChar) {

    for (DocumentModel dictionaryItem : cleanupCharactersService
        .getAllWordsPhrasesForConfusable(session, dictionaryId, confusableChar, batchSize)) {

      // Check for unpublished changes (before we clean)
      UnpublishedChangesService unpublishedChangesService = Framework
          .getService(UnpublishedChangesService.class);

      boolean unpublishedChangesExist = unpublishedChangesService
          .checkUnpublishedChanges(session, dictionaryItem);

      // Clean confusables for document
      cleanupCharactersService.cleanConfusables(session, dictionaryItem, true);

      if (!unpublishedChangesExist && StateUtils.isPublished(dictionaryItem)) {
        dictionaryItem.followTransition(REPUBLISH_TRANSITION);
      }
    }
  }

  @Override
  public String getTitle() {
    return Constants.CLEAN_CONFUSABLES_JOB_ID;
  }

  @Override
  public String getCategory() {
    return Constants.CHARACTER_WORKERS_QUEUE;
  }
}
