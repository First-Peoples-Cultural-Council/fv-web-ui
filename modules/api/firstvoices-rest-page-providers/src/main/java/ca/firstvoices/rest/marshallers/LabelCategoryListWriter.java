package ca.firstvoices.rest.marshallers;

import ca.firstvoices.rest.data.LabelCategory;
import ca.firstvoices.rest.data.LabelCategoryList;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = Instantiations.SINGLETON, priority = Priorities.REFERENCE)

public class LabelCategoryListWriter extends AbstractJsonWriter<LabelCategoryList> {

  @Override
  public void write(final LabelCategoryList entity, final JsonGenerator jg) throws IOException {
    jg.writeStartArray();
    for (LabelCategory c : entity.getCategories()) {
      jg.writeObject(c);
    }
    jg.writeEndArray();
  }
}
