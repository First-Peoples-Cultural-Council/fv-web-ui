package ca.firstvoices.widgets.operations;

import ca.firstvoices.widgets.Constants;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import org.json.JSONException;
import org.json.JSONObject;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;


@Operation(id = TestWidget.ID, category = Constants.GROUP_NAME,
    label = Constants.TEST_WIDGET_ACTION_ID,
    description = "Operation to show the status of confusables on a dialect")
public class TestWidget {

  public static final String ID = Constants.TEST_WIDGET_ACTION_ID;

  @Context
  CoreSession session;

  @Context
  protected DirectoryService directoryService;

  @Param(name = "phase", values = {"1", "2", "3"})
  protected String phase = "1";

  @OperationMethod
  public Blob run(DocumentModel dialect) throws JSONException {

    JSONObject json = new JSONObject();

    if (phase.equals("1")) {

      // Settings
      HashMap<String, String> darkMode = new HashMap<>();
      darkMode.put("key", "mode");
      darkMode.put("value", "dark");
      darkMode.put("category", "presentation");

      // Widget 1
      DocumentModel widget1 = session.createDocumentModel("FVWidget");

      widget1.setPropertyValue("dc:title", "Hello World: Widget 1");

      widget1.setPropertyValue("dialect", dialect.getId());
      widget1.setPropertyValue("type", "SimpleWidget");
      widget1.setPropertyValue("format", "Full");

      ArrayList<HashMap<String, String>> widget1Settings = new ArrayList<>();
      widget1Settings.add(darkMode);

      widget1.setPropertyValue("settings", widget1Settings);

      // Widget 2
      DocumentModel widget2 = session.createDocumentModel("FVWidget");

      widget2.setPropertyValue("dc:title", "Map: Widget 2");

      widget2.setPropertyValue("dialect", dialect.getId());
      widget2.setPropertyValue("type", "MapWidget");
      widget2.setPropertyValue("format", "Abridged");

      HashMap<String, String> widget2Setting = new HashMap<>();
      widget2Setting.put("key", "embed");
      widget2Setting.put("value",
          "https://maps.fpcc.ca/languages/diitiidʔaaʔtx̣#55.678348649442825/-125.95849609375/4.039980636044236");
      widget2Setting.put("category", "general");

      ArrayList<HashMap<String, String>> widget2Settings = new ArrayList<>();
      widget2Settings.add(widget2Setting);
      widget2Settings.add(darkMode);

      widget2.setPropertyValue("settings", widget2Settings);

      // Widget 3
      DocumentModel widget3 = session.createDocumentModel("FVWidget");

      widget3.setPropertyValue("dc:title", "Hello World: Widget 3");

      widget3.setPropertyValue("dialect", dialect.getId());
      widget3.setPropertyValue("type", "SimpleWidget");
      widget3.setPropertyValue("format", "Full");

      // Create widgets
      DocumentModel widget1Doc = session.createDocument(widget1);
      DocumentModel widget2Doc = session.createDocument(widget2);
      DocumentModel widget3Doc = session.createDocument(widget3);

      List<String> widgetList = Arrays.asList(widget2Doc.getId(),
          widget1Doc.getId(), widget3Doc.getId());

      // Assign widgets to the dialect
      dialect.setProperty("widgets", "active", widgetList);

      // Sample layout?
      dialect.setProperty("widgets", "layout", "3-col");

      session.saveDocument(dialect);

      // Deactivate widget3
      dialect.setProperty("widgets", "active",
          widgetList.stream().filter(v -> !v.equals(widget3Doc.getId())).collect(
              Collectors.toList()));
      dialect.setProperty("widgets", "inactive", Collections.singletonList(widget3Doc.getId()));
      session.saveDocument(dialect);

      json.put("widgetList", widgetList);
    } else if (phase.equals("2")) {

      // Get widget 1 (imagine it is an FVList)
      DocumentModelList widgets =
          session.query("SELECT * FROM FVWidget WHERE dc:title LIKE 'Hello World: Widget 1'");

      ////////// test for lists
      try (Session dirSession = directoryService.open("fvLists")) {
        DocumentModelList allDocs =
            session.query("SELECT * FROM Document WHERE ecm:ancestorId "
                + "= '" + dialect.getId() + "'");

        Calendar cal = Calendar.getInstance();

        for (DocumentModel doc : allDocs) {
          // assign all docs to list
          // Imagine widget1 is actually an FVList object
          // Create entries linking list to other id (i.e. join table)
          Map<String, Object> fieldMap = new HashMap<>();
          fieldMap.put("listId", widgets.get(0).getId());
          fieldMap.put("documentId", doc.getId());
          fieldMap.put("customOrder", new Random().nextDouble());
          fieldMap.put("created", doc.getPropertyValue("dc:created"));

          dirSession.createEntry(fieldMap);
        }
      }
      ////////// end of test for lists
    } else if (phase.equals("3")) {
      try (Session dirSession = directoryService.open("fvLists")) {
        // query lists
        DocumentModelList listValues = null;

        // Get widget 1 (imagine it is an FVList)
        DocumentModelList widgets =
            session.query("SELECT * FROM FVWidget WHERE dc:title LIKE 'Hello World: Widget 1'");

        // Get entries in Widget 1 list
        Map<String, Serializable> filter = new HashMap<>();
        filter.put("listId", widgets.get(0).getId());

        // Order by
        Map<String, String> orderBy = new HashMap<>();
        orderBy.put("customOrder", "DESC");

        listValues = dirSession.query(filter, null, orderBy);

        ArrayList<HashMap<String, String>> transformedList = new ArrayList<>();

        for (DocumentModel listItem : listValues) {
          DocumentModel listItemDoc = session.getDocument(
              new IdRef(
                  String.valueOf(listItem.getPropertyValue("documentId"))));
          HashMap<String, String> vals = new HashMap<>();

          vals.put("title", String.valueOf(listItemDoc.getPropertyValue("dc:title")));

          transformedList.add(vals);
        }

        json.put("list", transformedList);
      }
    }

    return new StringBlob(json.toString(), "application/json");
  }
}
