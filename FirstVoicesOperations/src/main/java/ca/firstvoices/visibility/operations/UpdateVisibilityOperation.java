package ca.firstvoices.visibility.operations;

import static ca.firstvoices.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.NEW_STATE;
import static ca.firstvoices.lifecycle.Constants.NEW_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.schemas.Constants.FV_ALPHABET;
import static ca.firstvoices.schemas.Constants.FV_AUDIO;
import static ca.firstvoices.schemas.Constants.FV_BOOK;
import static ca.firstvoices.schemas.Constants.FV_BOOKS;
import static ca.firstvoices.schemas.Constants.FV_BOOK_ENTRY;
import static ca.firstvoices.schemas.Constants.FV_CATEGORIES;
import static ca.firstvoices.schemas.Constants.FV_CATEGORY;
import static ca.firstvoices.schemas.Constants.FV_CHARACTER;
import static ca.firstvoices.schemas.Constants.FV_CONTRIBUTOR;
import static ca.firstvoices.schemas.Constants.FV_CONTRIBUTORS;
import static ca.firstvoices.schemas.Constants.FV_DIALECT;
import static ca.firstvoices.schemas.Constants.FV_DICTIONARY;
import static ca.firstvoices.schemas.Constants.FV_GALLERY;
import static ca.firstvoices.schemas.Constants.FV_LANGUAGE;
import static ca.firstvoices.schemas.Constants.FV_LANGUAGE_FAMILY;
import static ca.firstvoices.schemas.Constants.FV_LINK;
import static ca.firstvoices.schemas.Constants.FV_LINKS;
import static ca.firstvoices.schemas.Constants.FV_PHRASE;
import static ca.firstvoices.schemas.Constants.FV_PICTURE;
import static ca.firstvoices.schemas.Constants.FV_PORTAL;
import static ca.firstvoices.schemas.Constants.FV_RESOURCES;
import static ca.firstvoices.schemas.Constants.FV_VIDEO;
import static ca.firstvoices.schemas.Constants.FV_WORD;
import static ca.firstvoices.visibility.operations.Constants.MEMBERS;
import static ca.firstvoices.visibility.operations.Constants.PRIVATE;
import static ca.firstvoices.visibility.operations.Constants.PUBLIC;
import static ca.firstvoices.visibility.operations.Constants.TEAM;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.util.Arrays;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
@Operation(id = UpdateVisibilityOperation.ID, category = Constants.CAT_DOCUMENT, label =
    "UpdateVisibilityOperation", description = "Toggle the visiblity of a document")
public class UpdateVisibilityOperation {

  public static final String ID = "Document.UpdateVisibilityOperation";

  //   Document is disabled and not visible to dialect members = NEW
  //   Document is enabled and visible to dialect members = ENABLED
  //   Document is only available to language administrators or recorders = DISABLED
  //   Document is public = PUBLISHED

  @Param(name = "visibility", values = {PRIVATE, TEAM, MEMBERS, PUBLIC})
  private String visibility;

  private FirstVoicesPublisherService publisherService = Framework
      .getService(FirstVoicesPublisherService.class);

  @OperationMethod
  public void run(DocumentModel doc) {

    String[] types = { FV_ALPHABET, FV_AUDIO, FV_BOOK, FV_BOOK_ENTRY, FV_BOOKS, FV_CATEGORIES,
        FV_CATEGORY, FV_CHARACTER, FV_CONTRIBUTOR, FV_CONTRIBUTORS, FV_DIALECT, FV_DICTIONARY,
        FV_GALLERY, FV_LANGUAGE, FV_LANGUAGE_FAMILY, FV_LINK, FV_LINKS, FV_PHRASE, FV_PICTURE,
        FV_PORTAL, FV_RESOURCES, FV_VIDEO, FV_WORD };

    if (Arrays.stream(types).parallel().noneMatch(doc.getDocumentType().toString()::contains)) {
      return;
    }

    switch (visibility) {
      case PRIVATE:
        if (!doc.getLifeCyclePolicy().equals(NEW_STATE)) {
          doc.followTransition(NEW_TRANSITION);
        }
        break;
      case MEMBERS:
        if (!doc.getLifeCyclePolicy().equals(ENABLED_STATE)) {
          doc.followTransition(ENABLE_TRANSITION);
        }
        break;
      case TEAM:
        if (!doc.getLifeCyclePolicy().equals(DISABLED_STATE)) {
          doc.followTransition(DISABLE_TRANSITION);
        }
        break;
      case PUBLIC:
        if (!doc.getLifeCyclePolicy().equals(PUBLISHED_STATE)) {
          publisherService.publish(doc);
        }
        break;
      default:
        break;
    }
  }

}