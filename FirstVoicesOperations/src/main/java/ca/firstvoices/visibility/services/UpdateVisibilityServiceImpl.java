package ca.firstvoices.visibility.services;

import static ca.firstvoices.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.NEW_STATE;
import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.UNPUBLISH_TRANSITION;
import static ca.firstvoices.visibility.Constants.MEMBERS;
import static ca.firstvoices.visibility.Constants.PUBLIC;
import static ca.firstvoices.visibility.Constants.TEAM;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;

/**
 * @author david
 */
public class UpdateVisibilityServiceImpl implements UpdateVisibilityService {

  @Override
  public DocumentModel updateVisibility(DocumentModel doc, String visibility) {
    if (!doc.getLifeCyclePolicy().equals("fv-lifecycle")) {
      throw new NuxeoException("Document Life Cycle Policy Must Be 'fv-lifecycle'");
    }

    if (doc.isProxy() || doc.isVersion()) {
      throw new NuxeoException("Document Must not be a version or proxy'");
    }

    String currentLifeCycleState = doc.getCurrentLifeCycleState();

    switch (visibility) {
      case MEMBERS:
        // Members ===> "Enabled"
        if (currentLifeCycleState.equals(NEW_STATE) || currentLifeCycleState
            .equals(DISABLED_STATE)) {
          doc.followTransition(ENABLE_TRANSITION);
        } else if (currentLifeCycleState.equals(PUBLISHED_STATE)) {
          // Unpublish Transition will trigure the ProxyPublisherListener and move
          // document to enabled state
          doc.followTransition(UNPUBLISH_TRANSITION);
        }
        break;

      case TEAM:
        // Teams ===> "Disabled"
        if (currentLifeCycleState.equals(DISABLED_STATE)) {
          break;
        } else if (currentLifeCycleState.equals(PUBLISHED_STATE)) {
          // Unpublish Transition will trigure the ProxyPublisherListener and move
          // document to enabled state
          doc.followTransition(UNPUBLISH_TRANSITION);
        }
        doc.followTransition(DISABLE_TRANSITION);
        break;
      case PUBLIC:
        // Public ===> "Published"
        if (doc.hasSchema("fvancestry")) {
          String dialectId = (String) doc.getPropertyValue("fva:dialect");
          if (dialectId == null) {
            throw new NuxeoException("document must have a dialect");
          }
          if (!doc.getCoreSession().getDocument(new IdRef(dialectId)).getCurrentLifeCycleState()
              .equals(PUBLISHED_STATE)) {
            throw new NuxeoException("dialect must be published.");
          }
        }

        // Ensure doc is enabled to be able to transition from disabled:
        if (currentLifeCycleState.equals(DISABLED_STATE)) {
          doc.followTransition(ENABLE_TRANSITION);
        }

        if (!currentLifeCycleState.equals(PUBLISHED_STATE)) {
          // Publish Transition will trigure the ProxyPublisherListener and move documents to
          // published state
          doc.followTransition(PUBLISH_TRANSITION);
        }
        break;
      default:
        break;
    }

    return doc;
  }
}
