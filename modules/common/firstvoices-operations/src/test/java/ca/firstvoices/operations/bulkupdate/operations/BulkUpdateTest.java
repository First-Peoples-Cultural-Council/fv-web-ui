package ca.firstvoices.operations.bulkupdate.operations;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import ca.firstvoices.operations.bulkupdate.BulkUpdateMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.inject.Inject;
import org.junit.Test;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRefList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.impl.DocumentRefListImpl;
import testUtil.AbstractFirstVoicesOperationsTest;

// passing without throwing anything is the test case
@SuppressWarnings("java:S2699")
public class BulkUpdateTest extends AbstractFirstVoicesOperationsTest {

  @Inject AutomationService automationService;

  @Test
  public void updateMode() throws OperationException {
    String[] words =
        {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱", "la'oo'a'a",};

    List<DocumentModel> wordDocs = createWordsorPhrases(words, FV_WORD);

    DocumentRefList drf = new DocumentRefListImpl();
    drf.addAll(wordDocs.stream().map(d -> new IdRef(d.getId())).collect(Collectors.toList()));

    OperationContext ctx = new OperationContext(session);

    ctx.setInput(drf);

    Map<String, Object> params = new HashMap<>();
    params.put("field", "acknowledgement");
    params.put("value", "bulkupdated");
    params.put("mode", BulkUpdateMode.UPDATE_PROPERTY);

    automationService.run(ctx, BulkUpdate.ID, params);

  }

  @Test
  public void updateModeBoolean() throws OperationException {
    String[] words =
        {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱", "la'oo'a'a",};

    List<DocumentModel> wordDocs = createWordsorPhrases(words, FV_WORD);

    DocumentRefList drf = new DocumentRefListImpl();
    drf.addAll(wordDocs.stream().map(d -> new IdRef(d.getId())).collect(Collectors.toList()));

    OperationContext ctx = new OperationContext(session);

    ctx.setInput(drf);

    Map<String, Object> params = new HashMap<>();
    params.put("field", "compound");
    params.put("value", true);
    params.put("mode", BulkUpdateMode.UPDATE_PROPERTY);

    automationService.run(ctx, BulkUpdate.ID, params);

  }

  @Test
  public void addMode() throws OperationException {
    String[] words =
        {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱", "la'oo'a'a",};

    List<DocumentModel> wordDocs = createWordsorPhrases(words, FV_WORD);

    DocumentRefList drf = new DocumentRefListImpl();
    drf.addAll(wordDocs.stream().map(d -> new IdRef(d.getId())).collect(Collectors.toList()));

    OperationContext ctx = new OperationContext(session);

    ctx.setInput(drf);

    Map<String, Object> params = new HashMap<>();
    params.put("field", "plural");
    params.put("value", "pluralized_form_test");
    params.put("mode", BulkUpdateMode.ADD_TO_ARRAY_PROPERTY);

    automationService.run(ctx, BulkUpdate.ID, params);

  }

}
