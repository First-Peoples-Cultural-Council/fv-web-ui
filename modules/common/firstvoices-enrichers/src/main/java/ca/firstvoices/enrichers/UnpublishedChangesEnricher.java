package ca.firstvoices.enrichers;


import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_ALPHABET;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_AUDIO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_BOOK;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_BOOKS;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_BOOK_ENTRY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORIES;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CONTRIBUTOR;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CONTRIBUTORS;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_DICTIONARY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_GALLERY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_LINK;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_LINKS;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PICTURE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PORTAL;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_RESOURCES;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_VIDEO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;
import ca.firstvoices.publisher.services.UnpublishedChangesService;
import com.fasterxml.jackson.core.JsonGenerator;
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
  protected UnpublishedChangesService service =
      Framework.getService(UnpublishedChangesService.class);

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

  private ObjectNode constructUnpublishedChangesJSON(DocumentModel doc) {
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

    String[] types =
        {FV_ALPHABET, FV_AUDIO, FV_BOOK, FV_BOOK_ENTRY, FV_BOOKS, FV_CATEGORIES, FV_CATEGORY,
            FV_CHARACTER, FV_CONTRIBUTOR, FV_CONTRIBUTORS, FV_DIALECT, FV_DICTIONARY, FV_GALLERY,
            FV_LANGUAGE, FV_LANGUAGE_FAMILY, FV_LINK, FV_LINKS, FV_PHRASE, FV_PICTURE, FV_PORTAL,
            FV_RESOURCES, FV_VIDEO, FV_WORD};

    return Arrays.stream(types).parallel().anyMatch(currentType.toString()::contains);
  }

}
