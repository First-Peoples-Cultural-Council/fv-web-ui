package ca.firstvoices.rest.marshallers;

import ca.firstvoices.rest.data.SiteMembershipUpdateRequest;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonReader;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = Instantiations.SINGLETON, priority = Priorities.REFERENCE)
public class SiteMembershipUpdateRequestReader
    extends AbstractJsonReader<SiteMembershipUpdateRequest> {

  @Override
  public SiteMembershipUpdateRequest read(final JsonNode jn) throws IOException {

    return new SiteMembershipUpdateRequest(jn.get("newStatus").asText(),
        jn.get("messageToUser").asText(), jn.get("group").asText());
  }

}
