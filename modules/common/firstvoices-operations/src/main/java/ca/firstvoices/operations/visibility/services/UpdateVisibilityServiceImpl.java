package ca.firstvoices.operations.visibility.services;

import static ca.firstvoices.data.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.MEMBERS;
import static ca.firstvoices.data.lifecycle.Constants.NEW_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLIC;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.TEAM;
import static ca.firstvoices.data.lifecycle.Constants.UNPUBLISH_TRANSITION;

import ca.firstvoices.core.io.utils.DialectUtils;
import java.util.Objects;
import org.nuxeo.ecm.core.api.CoreSession;
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

    if (visibility == null) {
      throw new NuxeoException("You must provide a visibility value to update to.");
    }

    String currentLifeCycleState = doc.getCurrentLifeCycleState();

    switch (visibility) {
      case MEMBERS:
        // Members ===> "Enabled"
        if (currentLifeCycleState.equals(NEW_STATE) || currentLifeCycleState
            .equals(DISABLED_STATE)) {
          doc.followTransition(ENABLE_TRANSITION);
        } else if (currentLifeCycleState.equals(PUBLISHED_STATE)) {
          // Unpublish Transition will trigger the ProxyPublisherListener and move
          // document to enabled state
          doc.followTransition(UNPUBLISH_TRANSITION);
        }
        break;

      case TEAM:
        // Teams ===> "Disabled"
        if (currentLifeCycleState.equals(DISABLED_STATE)) {
          break;
        } else if (currentLifeCycleState.equals(PUBLISHED_STATE)) {
          // Unpublish Transition will trigger the ProxyPublisherListener and move
          // document to enabled state
          doc.followTransition(UNPUBLISH_TRANSITION);
        }
        doc.followTransition(DISABLE_TRANSITION);
        break;
      case PUBLIC:
        // Public ===> "Published"
        if (doc.hasSchema("fvancestry")) {
          CoreSession session = doc.getCoreSession();
          String dialectId = (String) doc.getPropertyValue("fva:dialect");

          if (dialectId == null) {
            // Try to get dialect via parent, in case fva:dialect is not present for some reason
            DocumentModel dialect = DialectUtils.getDialect(session, doc);
            if (Objects.nonNull(dialect)) {
              dialectId = dialect.getId();
            }
          }

          // If dialect still not retrieved via parent
          if (dialectId == null) {
            throw new NuxeoException("document must have a dialect");
          }

          if (!session.getDocument(new IdRef(dialectId)).getCurrentLifeCycleState()
              .equals(PUBLISHED_STATE)) {
            throw new NuxeoException("dialect must be published.");
          }
        }

        // Ensure doc is disabled to be able to transition to enabled:
        if (currentLifeCycleState.equals(DISABLED_STATE)) {
          doc.followTransition(ENABLE_TRANSITION);
        }

        if (!currentLifeCycleState.equals(PUBLISHED_STATE)) {
          // Publish Transition will trigger the ProxyPublisherListener and move documents to
          // published state
          doc.followTransition(PUBLISH_TRANSITION);
        } else {
          doc.followTransition(REPUBLISH_TRANSITION);
        }
        break;
      default:
        break;
    }

    return doc;
  }

  @Override
  public boolean isValidVisibility(String visibility) {
    return MEMBERS.equals(visibility) || PUBLIC.equals(visibility) || TEAM.equals(visibility);
  }
}
