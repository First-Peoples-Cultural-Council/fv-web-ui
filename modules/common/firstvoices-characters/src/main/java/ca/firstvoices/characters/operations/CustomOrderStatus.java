package ca.firstvoices.characters.operations;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.services.CharactersCoreService;
import ca.firstvoices.characters.services.CustomOrderComputeService;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Map;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;
import org.nuxeo.runtime.api.Framework;

@Operation(id = CustomOrderStatus.ID, category = Constants.GROUP_NAME,
    label = Constants.CUSTOM_ORDER_STATUS_ACTION_ID,
    description = "Operation to test the status of custom order. Evaluated just first chars.")
public class CustomOrderStatus {

  public static final int BASE = 34;

  public static final String ID = Constants.CUSTOM_ORDER_STATUS_ACTION_ID;

  private static final Logger log = Logger.getLogger(CustomOrderStatus.class.getCanonicalName());

  private final CustomOrderComputeService cos = Framework
      .getService(CustomOrderComputeService.class);

  private final CharactersCoreService cs = Framework
      .getService(CharactersCoreService.class);

  @Context
  protected CoreSession session;

  private final ArrayList<String> wordValues = new ArrayList<>();

  @OperationMethod
  public Blob run(DocumentModel dialect) throws OperationException {

    if (dialect == null || !dialect.getType().equals(FV_DIALECT)) {
      throw new OperationException("Document type must be FVDialect");
    }

    JSONObject json = new JSONObject();

    try {
      // Get alphabet
      DocumentModel alphabet = cs.getAlphabet(session, dialect);

      ArrayList<String> words = getWordsCustomOrder(dialect.getId());

      JSONArray jsonResults = new JSONArray();

      // check character custom order
      if (!cos.validateAlphabetOrder(session, alphabet)) {
        json.put("result", "Calculated sort mapping on FVAlphabet not in order.");

        int i = 1;

        DocumentModelList charactersByCustomOrder =
            cs.getCharacters(session, alphabet, "fv:custom_order");

        for (DocumentModel characterDoc : charactersByCustomOrder) {

          StringBuilder sb = new StringBuilder();

          sb.append(String.format("Character: %s", characterDoc.getTitle()));

          // Check ASCII mapping (actual vs. expected)
          String mappedCustomOrder =
              String.valueOf(characterDoc.getPropertyValue("fv:custom_order"));

          char baseCustomOrder = (char) (BASE + i);

          if (!mappedCustomOrder.equals(String.valueOf(baseCustomOrder))) {
            sb.append(String.format(" | Mapped ASCII %s ≠ %s",
                mappedCustomOrder, baseCustomOrder));
          }

          // Check order (actual vs. expected)
          String expectedAlphabetOrder =
              String.valueOf(characterDoc.getPropertyValue("fvcharacter:alphabet_order"));

          if (!String.valueOf(i).equals(expectedAlphabetOrder)) {
            sb.append(String.format(" | Actual order %s ≠ %s",
                i, expectedAlphabetOrder));
          }

          jsonResults.put(sb.toString());

          ++i;
        }

        json.put("results", jsonResults);

        return new StringBlob(json.toString(), "application/json");
      }

      if (!checkWordOrder(words,
          cs.getCustomOrderValues(session, alphabet),
          json)) {
        json.put("result", "Words not in order");
        return new StringBlob(json.toString(), "application/json");
      }

    } catch (Exception e) {
      log.severe(
          () -> "Exception caught while trying to get custom order status message:" + e
              .getMessage());
    }

    return new StringBlob(json.toString(), "application/json");
  }

  private boolean checkWordOrder(ArrayList<String> words,
      ArrayList<String> chars, JSONObject json) throws JSONException {
    int i;

    for (i = 0; i + 1 < words.size(); ++i) {

      char firstChar = words.get(i).charAt(0);
      char nextChar = words.get(i + 1).charAt(0);

      int alphabetPosChar1 = chars.indexOf(String.valueOf(firstChar));
      int alphabetPosChar2 = chars.indexOf(String.valueOf(nextChar));

      if (alphabetPosChar1 > alphabetPosChar2) {
        json.put("explanation", String.format("Word %s (%s) is before %s (%s)",
            wordValues.get(i),
            words.get(i),
            wordValues.get(i + 1),
            words.get(i + 1)));
        break;
      }
    }

    json.put("evaluated", String.valueOf(i + 1) + "/" + words.size());

    return i + 1 >= words.size();
  }

  private ArrayList<String> getWordsCustomOrder(String dictionaryId) {
    ArrayList<String> wordCustomOrder = new ArrayList<>();

    String query = String.format("SELECT dc:title, fv:custom_order FROM %s"
        + " WHERE ecm:ancestorId='%s' "
        + " AND ecm:isTrashed = 0"
        + " AND ecm:isVersion = 0"
        + " ORDER BY %s ASC", FV_WORD, dictionaryId, "fv:custom_order");

    IterableQueryResult results = session
        .queryAndFetch(query, "NXQL");

    for (Map<String, Serializable> item : results) {
      wordCustomOrder.add(String.valueOf(item.get("fv:custom_order")));
      // Add word titles for human readable output
      wordValues.add(String.valueOf(item.get("dc:title")));
    }

    results.close();

    return wordCustomOrder;
  }
}
