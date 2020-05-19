package ca.firstvoices.nuxeo.enrichers;


import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import ca.firstvoices.services.UnpublishedChangesService;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.Arrays;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;
import org.nuxeo.ecm.core.schema.DocumentType;
import org.nuxeo.runtime.api.Framework;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class UnpublishedChangesEnricher extends AbstractJsonEnricher<DocumentModel> {

  public static final String NAME = "unpublished_changes";
  private static final Log log = LogFactory.getLog(UnpublishedChangesEnricher.class);
  protected UnpublishedChangesService service = Framework
      .getService(UnpublishedChangesService.class);

  public UnpublishedChangesEnricher() {
    super(NAME);
  }

  // Method that will be called when the enricher is asked for
  @Override
  public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
    // We use the Jackson library to generate Json
    ObjectNode unpublishedChangesJsonObject = constructUnpublishedChangesJSON(doc);
    jg.writeFieldName(NAME);
    jg.writeObject(unpublishedChangesJsonObject);
  }

  private ObjectNode constructUnpublishedChangesJSON(DocumentModel doc)
      throws JsonGenerationException, JsonMappingException, IOException {
    ObjectMapper mapper = new ObjectMapper();

    return CoreInstance.doPrivileged(doc.getCoreSession(), session -> {
      // JSON object to be returned
      ObjectNode jsonObj = mapper.createObjectNode();

      log.debug("Constructing unpublished changes for doc: " + doc.getId());

      // If the document is the correct type then check for unpublished changes using the service.
      if (checkType(doc)) {
        boolean unpublishedChanges = service.checkUnpublishedChanges(session, doc);

        jsonObj.put("unpublished_changes_exist", unpublishedChanges);
      }

      return jsonObj;
    });
  }

  // Helper method to check that the new document is one of the types below
  private boolean checkType(DocumentModel inputDoc) {
    DocumentType currentType = inputDoc.getDocumentType();

    String[] types = {
        "FVAlphabet",
        "FVAudio",
        "FVBook",
        "FVBookEntry",
        "FVBooks",
        "FVCategories",
        "FVCategory",
        "FVCharacter",
        "FVContributor",
        "FVContributors",
        "FVDialect",
        "FVDictionary",
        "FVGallery",
        "FVLanguage",
        "FVLanguageFamily",
        "FVLink",
        "FVLinks",
        "FVPhrase",
        "FVPicture",
        "FVPortal",
        "FVResources",
        "FVVideo",
        "FVWord",
    };
    return Arrays.stream(types).parallel().anyMatch(currentType.toString()::contains);
  }

}
