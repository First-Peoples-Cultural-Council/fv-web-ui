package ca.firstvoices.testUtil;

import static ca.firstvoices.tests.mocks.Constants.FV_LANGUAGE;
import static ca.firstvoices.tests.mocks.Constants.FV_LANGUAGE_FAMILY;

import ca.firstvoices.runner.FirstVoicesCoreTestsFeature;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesCoreTestsFeature.class})
public abstract class AbstractFirstVoicesCoreTestsTest {

  protected DocumentModel domain;
  protected DocumentModel workspaceRoot;
  protected DocumentModel workspace;
  protected DocumentModel languageFamily;
  protected DocumentModel language;
  protected Map<String, String> params;

  @Inject
  protected NuxeoPrincipal administrator;
  protected NuxeoPrincipal recorder;
  protected NuxeoPrincipal recorderWithApproval;
  protected NuxeoPrincipal languageAdmin;

  @Inject
  protected CoreSession session;

  @Inject
  protected AutomationService automationService;

  @Before
  public void createDomain() {
    startFresh(session);

    domain = createDocument(session,
        session.createDocumentModel("/", "FV", "Domain"));
    workspaceRoot = createDocument(session,
        session.createDocumentModel("/FV", "Workspaces", "WorkspaceRoot"));
    workspace = createDocument(session,
        session.createDocumentModel("/FV/Workspaces", "Data", "Workspace"));
    languageFamily = createDocument(session,
        session
            .createDocumentModel("/FV/Workspaces/Data", "Test", FV_LANGUAGE_FAMILY));
    language = createDocument(session,
        session.createDocumentModel("/FV/Workspaces/Data/Test", "Test",
            FV_LANGUAGE));
  }

  public void startFresh(CoreSession session) {
    DocumentRef dRef = session.getRootDocument().getRef();
    DocumentModel defaultDomain = session.getDocument(dRef);

    DocumentModelList children = session.getChildren(defaultDomain.getRef());

    for (DocumentModel child : children) {
      recursiveRemove(session, child);
    }
  }

  private void recursiveRemove(CoreSession session, DocumentModel parent) {
    DocumentModelList children = session.getChildren(parent.getRef());

    for (DocumentModel child : children) {
      recursiveRemove(session, child);
    }

    session.removeDocument(parent.getRef());
    session.save();
  }

  public DocumentModel createDocument(CoreSession session, DocumentModel model) {
    model.setPropertyValue("dc:title", model.getName());
    DocumentModel newDoc = session.createDocument(model);
    session.save();

    return newDoc;
  }

}
