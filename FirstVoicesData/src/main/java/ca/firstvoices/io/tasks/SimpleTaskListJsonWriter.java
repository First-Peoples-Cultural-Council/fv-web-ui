package ca.firstvoices.io.tasks;

import ca.firstvoices.io.tasks.models.SimpleTaskAdapter;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import java.util.List;
import org.nuxeo.ecm.automation.core.util.PaginablePageProvider;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.impl.DocumentModelImpl;
import org.nuxeo.ecm.core.io.marshallers.json.DefaultListJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

/**
 *
 */
@Setup(mode = Instantiations.SINGLETON, priority = Priorities.OVERRIDE_REFERENCE)
public class SimpleTaskListJsonWriter extends DefaultListJsonWriter<SimpleTaskAdapter> {

  public static final String ENTITY_TYPE = "simple-tasks";

  public SimpleTaskListJsonWriter() {
    super(ENTITY_TYPE, SimpleTaskAdapter.class);
  }

  @Override
  public void write(List<SimpleTaskAdapter> docs, JsonGenerator jg) throws IOException {

    // Include pagination and adapt each DocumentModel to a SimpleTask
    if (docs instanceof PaginablePageProvider) {
      for (int i = 0; i < docs.size(); i++) {
        DocumentModel doc1 = (DocumentModelImpl) docs.get(i);
        SimpleTaskAdapter task = doc1.getAdapter(SimpleTaskAdapter.class);
        docs.set(i, task);
      }
    }

    super.write(docs, jg);
  }
}
