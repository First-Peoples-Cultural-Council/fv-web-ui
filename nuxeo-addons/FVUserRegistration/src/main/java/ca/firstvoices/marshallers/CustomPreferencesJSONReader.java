package ca.firstvoices.marshallers;

import ca.firstvoices.models.CustomPreferencesObject;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonReader;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

import java.io.IOException;

@Setup(mode = Instantiations.SINGLETON, priority = Priorities.REFERENCE)
public class CustomPreferencesJSONReader extends AbstractJsonReader<CustomPreferencesObject> {
    public CustomPreferencesObject read(JsonNode jn) throws IOException {
        return new ObjectMapper().readValue(jn, CustomPreferencesObject.class);
    }
}