package ca.firstvoices.visibility.services;

import static ca.firstvoices.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.ENABLE_TRANSITION;
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

    switch (visibility) {
      case MEMBERS:
        if (!doc.getCurrentLifeCycleState().equals(ENABLED_STATE)) {
          unpublishAndDisable(doc);
          doc.followTransition(ENABLE_TRANSITION);
        }
        break;
      case TEAM:
        if (!doc.getCurrentLifeCycleState().equals(DISABLED_STATE)) {
          unpublishAndDisable(doc);
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

  public void unpublishAndDisable(DocumentModel doc) {
    publisherService.unpublish(doc);
    if (!doc.getCurrentLifeCycleState().equals(DISABLED_STATE)) {
      doc.followTransition(DISABLE_TRANSITION);
    }
  }
}
