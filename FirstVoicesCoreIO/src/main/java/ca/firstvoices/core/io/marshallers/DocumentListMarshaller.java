package ca.firstvoices.core.io.marshallers;

import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import java.util.List;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.document.DocumentModelListJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

/**
* This class will override the default writer for DocumentModelLists (i.e. lists of documents).
* It is currently disabled in `ca.firstvoices.io.xml` and provided as an example only
* IMPORTANT! Extending this should be handled with care since it will affect the output of
* most document types. Pay careful attention to `null` values and checking for types.
*/
@Setup(mode = Instantiations.SINGLETON, priority = Priorities.OVERRIDE_REFERENCE)
public class DocumentListMarshaller extends DocumentModelListJsonWriter {

  @Override
  public void write(List<DocumentModel> docs, JsonGenerator jg) throws IOException {
    // Output specific type of list if the list is of type: "SampleSingleType"
    if (!docs.isEmpty() && "SampleSingleType".equals(docs.get(0).getType())) {
      jg.writeEndArray();
      extend(docs, jg);
      jg.writeEndObject();
    } else {
      super.write(docs, jg);
    }
  }
}
