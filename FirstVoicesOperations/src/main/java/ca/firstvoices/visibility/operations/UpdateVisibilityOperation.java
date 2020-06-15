package ca.firstvoices.visibility.operations;

import static ca.firstvoices.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.NEW_STATE;
import static ca.firstvoices.lifecycle.Constants.NEW_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
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

     String[] types = {"FVAlphabet", "FVAudio", "FVBook", "FVBookEntry", "FVBooks", "FVCategories",
         "FVCategory", "FVCharacter", "FVContributor", "FVContributors", "FVDialect", "FVDictionary",
         "FVGallery", "FVLanguage", "FVLanguageFamily", "FVLink", "FVLinks", "FVPhrase", "FVPicture",
         "FVPortal", "FVResources", "FVVideo", "FVWord",};

     if (Arrays.stream(types).parallel()
         .noneMatch(doc.getDocumentType().toString()::contains)) {
       return;
     }

    switch (visibility) {
      case PRIVATE:
        if (!doc.getLifeCyclePolicy().equals(NEW_STATE)){
          doc.followTransition(NEW_TRANSITION);
        }
        break;
      case MEMBERS:
        if (!doc.getLifeCyclePolicy().equals(ENABLED_STATE)) {
          doc.followTransition(ENABLE_TRANSITION);
        }
      case TEAM:
        if (!doc.getLifeCyclePolicy().equals(DISABLED_STATE)) {
          doc.followTransition(DISABLE_TRANSITION);
        }
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