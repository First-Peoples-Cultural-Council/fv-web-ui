package ca.firstvoices.marshallers;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON_TYPE;
import static org.nuxeo.ecm.automation.core.util.PaginableDocumentModelList.CODEC_PARAMETER_NAME;
import static org.nuxeo.ecm.core.io.registry.MarshallingConstants.ENTITY_FIELD_NAME;

import com.fasterxml.jackson.core.JsonGenerator;
import java.io.Closeable;
import java.io.IOException;
import java.util.List;
import org.nuxeo.ecm.automation.core.util.PaginableDocumentModelList;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.OutputStreamWithJsonWriter;
import org.nuxeo.ecm.core.io.marshallers.json.document.DocumentModelListJsonWriter;
import org.nuxeo.ecm.core.io.registry.Writer;
import org.nuxeo.ecm.core.io.registry.context.RenderingContext;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

/**
 *
 */
@Setup(mode = Instantiations.SINGLETON, priority = Priorities.OVERRIDE_REFERENCE)
public class TasksMarshaller extends DocumentModelListJsonWriter {

  @Override
  public void write(List<DocumentModel> docs, JsonGenerator jg) throws IOException {
    if (docs instanceof PaginableDocumentModelList) {
      if (docs.size() > 0 && "RoutingTask".equals(docs.get(0).getType())) {
        PaginableDocumentModelList paginable = (PaginableDocumentModelList) docs;
        String codecName = paginable.getDocumentLinkBuilder();
        try (Closeable resource = ctx.wrap().with(CODEC_PARAMETER_NAME, codecName).open()) {

          jg.writeStartObject();
          ctx.setParameterValues(RenderingContext.RESPONSE_HEADER_ENTITY_TYPE_KEY, "tasks");
          jg.writeStringField(ENTITY_FIELD_NAME, "tasks");
          //writePaginationInfos(list, jg);
          // Find a way to insert pagination date!
          Writer<SimpleTaskAdapter> documentWriter = registry
              .getWriter(ctx, SimpleTaskAdapter.class, SimpleTaskAdapter.class,
                  APPLICATION_JSON_TYPE);
          jg.writeArrayFieldStart("entries");

          for (DocumentModel doc : docs) {
            documentWriter.write(doc.getAdapter(SimpleTaskAdapter.class), SimpleTaskAdapter.class,
                SimpleTaskAdapter.class, APPLICATION_JSON_TYPE, new OutputStreamWithJsonWriter(jg));
          }

          jg.writeEndArray();
          extend(docs, jg);
          jg.writeEndObject();
        }
      } else {
        super.write(docs, jg);
      }
    } else {
      super.write(docs, jg);
    }
  }
}
