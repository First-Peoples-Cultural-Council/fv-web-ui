package ca.firstvoices.visibility.services;

import static ca.firstvoices.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.NEW_STATE;
import static ca.firstvoices.visibility.Constants.MEMBERS;
import static ca.firstvoices.visibility.Constants.PUBLIC;
import static ca.firstvoices.visibility.Constants.TEAM;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public class UpdateVisibilityServiceImpl implements UpdateVisibilityService {

  private FirstVoicesPublisherService publisherService;

  @Override
  public DocumentModel updateVisibility(DocumentModel doc, String visibility) {
    if (!doc.getLifeCyclePolicy().equals("fv-lifecycle")) {
      throw new NuxeoException("Document Life Cycle Policy Must Be 'fv-lifecycle'");
    }

    if (doc.isProxy() || doc.isVersion()) {
      throw new NuxeoException("Document Must not be a version or proxy'");
    }

    publisherService = Framework.getService(FirstVoicesPublisherService.class);

    String currentLifeCycleState = doc.getCurrentLifeCycleState();
    switch (visibility) {
      case MEMBERS:
        // If transitioning from NEW -> ENABLED
        if (currentLifeCycleState.equals(NEW_STATE)) {
          doc.followTransition(ENABLE_TRANSITION);
          // If transitioning to a new state:
        } else if (!currentLifeCycleState.equals(ENABLED_STATE)) {
          // If any proxies exist, we'll remove them with this call:
          publisherService.unpublish(doc);
          currentLifeCycleState = doc.getCurrentLifeCycleState();
          // If we're still not in an ENABLED_STATE after running publisherService.unpublish(doc)
          if (!currentLifeCycleState.equals(ENABLED_STATE)) {
            //  Transition the document to the ENABLED_STATE
            doc.followTransition(ENABLE_TRANSITION);
          }
        }
        break;

      case TEAM:
        // If transitioning from NEW -> DISABLED
        if (currentLifeCycleState.equals(NEW_STATE)) {
          doc.followTransition(DISABLE_TRANSITION);
          // If transitioning to a new state:
        } else if (!currentLifeCycleState.equals(DISABLED_STATE)) {
          // If any proxies exist, we'll remove them with this call. This will also put us into
          // an ENABLED_STATE if the document was published
          publisherService.unpublish(doc);
          //  Transition the document to the DISABLED_STATE
          doc.followTransition(DISABLE_TRANSITION);
        }
        break;

      case PUBLIC:
        publisherService.publish(doc);
        break;

      default:
        break;
    }

    return doc;
  }
}
