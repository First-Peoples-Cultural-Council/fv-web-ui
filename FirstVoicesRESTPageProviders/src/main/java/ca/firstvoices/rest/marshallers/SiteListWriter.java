package ca.firstvoices.rest.marshallers;

import ca.firstvoices.rest.data.Site;
import ca.firstvoices.rest.data.SiteList;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = Instantiations.SINGLETON, priority = Priorities.REFERENCE)

public class SiteListWriter extends AbstractJsonWriter<SiteList> {


  @Override
  public void write(final SiteList entity, final JsonGenerator jg) throws IOException {
    jg.writeStartArray();
    for (Site l : entity.getSites()) {
      jg.writeObject(l);
    }
    jg.writeEndArray();
  }
}
