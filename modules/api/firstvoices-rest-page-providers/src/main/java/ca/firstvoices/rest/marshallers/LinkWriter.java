package ca.firstvoices.rest.marshallers;

import ca.firstvoices.rest.data.Link;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = Instantiations.SINGLETON, priority = Priorities.REFERENCE)
public class LinkWriter extends AbstractJsonWriter<Link> {


  @Override
  public void write(final Link item, final JsonGenerator generator) throws IOException {
    generator.writeObject(item);
  }
}
