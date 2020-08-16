package ca.firstvoices.marshallers;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonReader;

public class SimpleTaskAdapterJSONReader extends AbstractJsonReader<SimpleTaskAdapter> {

  @Override
  public SimpleTaskAdapter read(JsonNode jn) throws IOException {
    SimpleTaskAdapter test = new SimpleTaskAdapterImpl(null);
    test.setTitle(getStringField(jn, "title"));
    return test;
  }
}
