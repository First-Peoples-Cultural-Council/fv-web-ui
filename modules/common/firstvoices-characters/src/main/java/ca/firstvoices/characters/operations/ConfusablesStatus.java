package ca.firstvoices.characters.operations;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.services.CleanupCharactersService;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.runtime.api.Framework;

@Operation(id = ConfusablesStatus.ID, category = Constants.GROUP_NAME,
    label = Constants.CONFUSABLES_STATUS_ACTION_ID,
    description = "Operation to show the status of confusables on a dialect")
public class ConfusablesStatus {

  public static final String ID = Constants.CONFUSABLES_STATUS_ACTION_ID;
  private static final Logger log = Logger.getLogger(ConfusablesStatus.class.getCanonicalName());
  private final CleanupCharactersService cleanupCharactersService = Framework
      .getService(CleanupCharactersService.class);

  @OperationMethod
  public Blob run(DocumentModel dialect) throws OperationException {

    if (dialect == null || !dialect.getType().equals(FV_DIALECT)) {
      throw new OperationException("Document type must be FVDialect");
    }

    JSONObject json = new JSONObject();

    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              try {
                String dictionaryId = session
                    .getChild(dialect.getRef(), DialectTypesConstants.FV_DICTIONARY_NAME).getId();

                List<String> allConfusables = cleanupCharactersService.getAllConfusables(dialect);

                for (String confusable : allConfusables) {
                  DocumentModelList dictionaryItems = cleanupCharactersService
                      .getAllWordsPhrasesForConfusable(session, dictionaryId, confusable, 20);

                  JSONObject confusablesJson = new JSONObject();
                  confusablesJson.put("Words/Phrases", dictionaryItems.totalSize());
                  confusablesJson.put("Top 20 Matches", dictionaryItems.stream()
                      .map(doc -> Collections.singletonMap(doc.getId(), doc.getTitle()))
                      .collect(Collectors.toList()));
                  confusablesJson.put("Occurrences",
                      allConfusables.stream().filter(char1 -> char1.equals(confusable)).count());

                  json.put(confusable, confusablesJson);
                }
              } catch (Exception e) {
                log.severe(
                    () -> "Exception caught while trying to get confusable status message:" + e
                        .getMessage());
              }
            });

    return new StringBlob(json.toString(), "application/json");
  }
}
