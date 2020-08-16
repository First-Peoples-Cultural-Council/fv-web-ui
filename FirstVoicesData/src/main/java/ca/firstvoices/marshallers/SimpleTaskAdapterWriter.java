package ca.firstvoices.marshallers;

import static org.nuxeo.ecm.core.io.registry.MarshallingConstants.ENTITY_FIELD_NAME;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import java.text.SimpleDateFormat;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class SimpleTaskAdapterWriter extends AbstractJsonWriter<SimpleTaskAdapter> {

  public static final String ENTITY_TYPE = "simple-task";

  @Override
  public void write(SimpleTaskAdapter task, JsonGenerator jg) throws IOException {
    jg.writeStartObject();
    jg.writeStringField(ENTITY_FIELD_NAME, ENTITY_TYPE);
    jg.writeStringField("dc:title", task.getTitle());

    SimpleDateFormat fmt = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
    fmt.setCalendar(task.getDateCreated());

    jg.writeStringField("dc:created", fmt.format(task.getDateCreated().getTime()));
    jg.writeStringField("requestedBy", task.getRequestedBy());
    //jg.writeObjectField("properties", task);
    jg.writeEndObject();
  }
}
