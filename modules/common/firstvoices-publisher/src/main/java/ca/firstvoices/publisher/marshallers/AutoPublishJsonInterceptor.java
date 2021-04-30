package ca.firstvoices.publisher.marshallers;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;

import ca.firstvoices.core.io.utils.StateUtils;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.document.DocumentModelJsonReader;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = SINGLETON, priority = Priorities.OVERRIDE_REFERENCE)
public class AutoPublishJsonInterceptor extends DocumentModelJsonReader {

  public AutoPublishJsonInterceptor() {
    super();
  }

  @Override
  protected DocumentModel readEntity(JsonNode jn) throws IOException {
    DocumentModel doc = super.readEntity(jn);

    boolean fvPublish = ctx.getBooleanParameter("fv-publish");

    // If parameter `fv-publish` provided
    // change transitions on doc so can be published async
    if (fvPublish && !doc.isProxy() && !doc.isTrashed() && !doc.isVersion()) {
      if (PUBLISHED_STATE.equals(doc.getCurrentLifeCycleState())) {
        // Republish if allowed
        StateUtils.followTransitionIfAllowed(doc, REPUBLISH_TRANSITION);
      } else {
        // Publish if allowed
        StateUtils.followTransitionIfAllowed(doc, PUBLISH_TRANSITION);
      }
    }

    // Use super read entity
    return doc;
  }
}
