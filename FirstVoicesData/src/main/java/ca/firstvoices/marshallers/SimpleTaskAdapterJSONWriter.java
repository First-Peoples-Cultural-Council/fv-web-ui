package ca.firstvoices.marshallers;

import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriter;

public class SimpleTaskAdapterJSONWriter extends AbstractJsonWriter<SimpleTaskAdapter> {

  @Override
  public void write(SimpleTaskAdapter entity, JsonGenerator jg) throws IOException {
    jg.writeObject(entity);
  }
}
