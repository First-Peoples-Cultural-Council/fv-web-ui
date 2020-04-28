package ca.firstvoices.testUtil;

import static org.junit.Assert.assertNotNull;

import ca.firstvoices.runner.FirstVoicesDataFeature;
import ca.firstvoices.services.AddConfusablesService;
import ca.firstvoices.services.AssignAncestorsService;
import ca.firstvoices.services.CleanupCharactersService;
import ca.firstvoices.services.SanitizeDocumentService;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesDataFeature.class})
public abstract class AbstractFirstVoicesDataTest {

  protected DocumentModel languageFamily;
  protected DocumentModel language;
  protected DocumentModel dialect;
  protected DocumentModel dictionary;
  protected DocumentModel alphabet;
  protected DocumentModel categories;
  protected DocumentModel parentCategory;
  protected DocumentModel childCategory;
  protected DocumentModel parentCategory2;

  @Inject
  protected CoreSession session;

  @Inject
  protected UserManager userManager;

  @Inject
  protected AutomationService automationService;

    @Inject
    protected AssignAncestorsService assignAncestorsService;

    @Inject
    protected SanitizeDocumentService sanitizeDocumentService;

    @Inject
    protected CleanupCharactersService cleanupCharactersService;

    @Inject
    protected AddConfusablesService addConfusablesService;

    @Before
    public void setUp() throws Exception {
        assertNotNull("Should have a valid session", session);
        createSetup(session);
    }

    public void createSetup(CoreSession session) {
        startFresh(session);

        DocumentModel domain = createDocument(session, session.createDocumentModel("/", "FV", "Domain"));

        createDialectTree(session);

        session.save();
      }

      public DocumentModel createDocument(CoreSession session, DocumentModel model)
      {
        model.setPropertyValue("dc:title", model.getName());
        DocumentModel newDoc = session.createDocument(model);
        session.save();

        return newDoc;
      }

      public void startFresh(CoreSession session) {
        DocumentRef dRef = session.getRootDocument().getRef();
        DocumentModel defaultDomain = session.getDocument(dRef);

        DocumentModelList children = session.getChildren(defaultDomain.getRef());

        for ( DocumentModel child : children ) {
          recursiveRemove(session, child);
        }
      }

      private void recursiveRemove( CoreSession session, DocumentModel parent )
      {
        DocumentModelList children =  session.getChildren(parent.getRef());

        for( DocumentModel child : children )
        {
          recursiveRemove( session, child );
        }

        session.removeDocument(parent.getRef());
        session.save();
      }

      public void createDialectTree(CoreSession session) {
        languageFamily = createDocument(session,
            session.createDocumentModel("/FV", "Family", "FVLanguageFamily"));
        assertNotNull("Should have a valid FVLanguageFamily", languageFamily);
        language = createDocument(session,
            session.createDocumentModel("/FV/Family", "Language", "FVLanguage"));
        assertNotNull("Should have a valid FVLanguage", language);
        dialect = createDocument(session,
            session.createDocumentModel("/FV/Family/Language", "Dialect", "FVDialect"));
        assertNotNull("Should have a valid FVDialect", dialect);
        dictionary = createDocument(session, session
            .createDocumentModel("/FV/Family/Language/Dialect", "Dictionary", "FVDictionary"));
        assertNotNull("Should have a valid FVDictionary", dictionary);
        alphabet = createDocument(session,
            session.createDocumentModel(dialect.getPathAsString(), "Alphabet", "FVAlphabet"));
        assertNotNull("Should have a valid FVAlphabet", alphabet);
        categories = createDocument(session,
            session.createDocumentModel("/FV/Family/Language/Dialect/", "Categories",
                "FVCategories"));
        assertNotNull("Should have a valid Categories", categories);
        parentCategory = createDocument(session, session
            .createDocumentModel("/FV/Family/Language/Dialect/Categories", "TestParentCategory1",
                "FVCategory"));
        assertNotNull("Should have a valid Parent Category", parentCategory);
        childCategory = createDocument(session, session
            .createDocumentModel("/FV/Family/Language/Dialect/Categories/TestParentCategory1",
                "Category",
                "FVCategory"));
        assertNotNull("Should have a valid category", childCategory);
        parentCategory2 = createDocument(session, session
            .createDocumentModel("/FV/Family/Language/Dialect/Categories", "TestParentCategory2",
                "FVCategory"));
        assertNotNull("Should have a valid Parent Category2", parentCategory2);
      }
    }