package ca.firstvoices.operations.audience.operations;

import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.javers.common.collections.Lists;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CloseableCoreSession;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.PropertyException;
import org.nuxeo.ecm.core.api.ScrollResult;
import org.nuxeo.runtime.transaction.TransactionHelper;

@Operation(id = UpdateAudienceOperation.ID,
    category = Constants.CAT_CONVERSION,
    label = "UpdateAudienceOperation",
    description = "Copy audience (child-focused/for games) into new schema in preparation"
        + " to deprecate")
public class UpdateAudienceOperation {

  public static final String ID = "DataCleanup.UpdateAudienceOperation";
  public static final Log log = LogFactory.getLog(UpdateAudienceOperation.class);

  @Context CoreSession coreSession;

  @OperationMethod(async = true)
  public void run() {
    log.warn("Beginning update of all documents");

    if (!coreSession.getPrincipal().isAdministrator()) {
      throw new IllegalArgumentException("You must be an administrator to run this operation");
    }

    ExecutorService executor = new ThreadPoolExecutor(12,
        12,
        1,
        TimeUnit.MINUTES,
        new ArrayBlockingQueue<>(24),
        new ThreadPoolExecutor.CallerRunsPolicy());

    AtomicLong processed = new AtomicLong(0);
    AtomicBoolean failed = new AtomicBoolean(false);

    CoreInstance.doPrivileged(coreSession, session -> {
      try {

        ScrollResult<String> results = session.scroll("Select * from DOCUMENT WHERE "
                + "ecm:isTrashed = 0 AND ecm:isVersion = 0",
            500,
            1800);


        do {
          final List<String> localResults = Lists.immutableCopyOf(results.getResults());

          executor.execute(() -> {
            if (failed.get() == true) {
              return;
            }

            TransactionHelper.runInNewTransaction(() -> {
              final CloseableCoreSession localSession = CoreInstance.openCoreSessionSystem(null);

              try {
                for (String documentId : localResults) {

                  DocumentModel document = localSession.getDocument(new IdRef(documentId));

                  if (document.hasSchema("fvaudience")) {
                    Boolean childrensArchiveValue = null;

                    try {
                      childrensArchiveValue = (Boolean) document.getPropertyValue(
                          "fv:available_in_childrens_archive");

                      if (childrensArchiveValue != null) {
                        childrensArchiveValue = (Boolean) document.getPropertyValue(
                            "fvm" + ":fvmedia_child_focused");
                      }
                      if (childrensArchiveValue != null) {
                        childrensArchiveValue = (Boolean) document.getPropertyValue(
                            "FVThumbnailView_cv" + ":fvmedia_child_focused");
                      }
                      if (childrensArchiveValue != null) {
                        childrensArchiveValue = (Boolean) document.getPropertyValue(
                            "fvmedialisting_cv" + ":fvmedia_child_focused");
                      }

                    } catch (PropertyException e) {
                      // swallow the exception
                    }

                    if (childrensArchiveValue != null) {
                      document.setPropertyValue(
                          "fvaudience:children", childrensArchiveValue);
                      localSession.saveDocument(document);
                    }

                    Boolean gamesArchive = null;

                    try {
                      gamesArchive = (Boolean) document.getPropertyValue(
                          "fv-word:available_in_games");
                    } catch (PropertyException e) {
                      // swallow the exception
                    }

                    if (gamesArchive != null) {
                      document.setPropertyValue("fvaudience:games", gamesArchive);

                      localSession.saveDocument(document);
                    }

                  }
                  processed.incrementAndGet();
                }
              } catch (Exception e) {
                log.error(e);
                failed.set(true);
              } finally {
                localSession.close();
              }
            });
          });


          results = session.scroll(results.getScrollId());

        } while (results.hasResults());
      } catch (Exception exception) {
        log.warn("Caught an exception", exception);
      }

    });
    log.warn("all ids queued, awaiting completion");

    executor.shutdown();
    while (true) {
      try {
        if (executor.awaitTermination(5, TimeUnit.SECONDS)) {
          log.warn("done! (success == " + !failed.get() + ")");
          break;
        } else {
          log.warn("awaiting completion");
        }
      } catch (InterruptedException e) {
        log.error(e);
        Thread.currentThread().interrupt();
      }

    }

  }

}
