package ca.firstvoices.rest.marshallers;

import ca.firstvoices.rest.data.SiteMembershipRequest;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonReader;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = Instantiations.SINGLETON, priority = Priorities.REFERENCE)
public class SiteMembershipRequestReader extends AbstractJsonReader<SiteMembershipRequest> {

  @Override
  public SiteMembershipRequest read(final JsonNode jn) throws IOException {

    return new SiteMembershipRequest(
        jn.get("communityMember").asBoolean(false),
        jn.get("languageTeam").asBoolean(false),
        jn.get("interestReason").asText(),
        jn.get("comment").asText());
  }

}
