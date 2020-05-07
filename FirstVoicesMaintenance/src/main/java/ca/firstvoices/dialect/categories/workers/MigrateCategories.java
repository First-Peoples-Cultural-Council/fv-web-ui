package ca.firstvoices.dialect.categories.workers;

import ca.firstvoices.dialect.categories.Constants;
import ca.firstvoices.dialect.categories.services.MigrateCategoriesService;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

public class MigrateCategories extends AbstractWork {

  private DocumentRef dialect;
  private DocumentRef alphabet;
  private MigrateCategoriesService service = Framework.getService(MigrateCategoriesService.class);

  public MigrateCategories(DocumentRef dialectRef, DocumentRef alphabetRef) {
    super(Constants.MIGRATE_CATEGORIES_JOB_ID);
    this.dialect = dialectRef;
    this.alphabet = alphabetRef;
  }

  @Override
  public void work() {

    //    WorkManager workManager = Framework.getService(WorkManager.class);
//    for (DocumentModel alphabet : alphabets) {
//      DocumentModel dialect = session.getParentDocument(alphabet.getRef());
//
//      AddConfusablesToAlphabetWorker worker = new AddConfusablesToAlphabetWorker(
//          dialect.getRef(), alphabet.getRef());
//
//      workManager.schedule(worker);

    // This should be done in a worker!
//    if (!migrateToLocalCategoriesService.migrateWords(session, dialect, 500)) {
//      // remove flag from jobs
//      Set<String> requiredJobs = new HashSet<>(Arrays.asList((String[]) dialect.getPropertyValue("fv-maintenance:required_jobs")));
//
//      if (!requiredJobs.isEmpty()) {
//        requiredJobs.remove(Constants.MIGRATE_CATEGORIES_JOB_ID);
//        dialect.setProperty("fv-maintenance", "required_jobs", requiredJobs);
//
//        // Update dialect
//        session.saveDocument(dialect);
//      }
//
//      // A good place to set feature as enabled?
//    }


    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              // Something....
            });
  }

  @Override
  public String getTitle() {
    return Constants.MIGRATE_CATEGORIES_JOB_ID;
  }

  @Override
  public String getCategory() {
    return Constants.MIGRATE_CATEGORIES_JOB_ID;
  }
}
