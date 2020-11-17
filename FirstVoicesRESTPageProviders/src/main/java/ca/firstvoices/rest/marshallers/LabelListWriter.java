package ca.firstvoices.rest.marshallers;

import ca.firstvoices.rest.data.Label;
import ca.firstvoices.rest.data.LabelList;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = Instantiations.SINGLETON, priority = Priorities.REFERENCE)

public class LabelListWriter extends AbstractJsonWriter<LabelList> {


  @Override
  public void write(final LabelList entity, final JsonGenerator jg) throws IOException {
    jg.writeStartArray();
    for (Label l : entity.getLabels()) {
      jg.writeObject(l);
    }
    jg.writeEndArray();
  }
}
