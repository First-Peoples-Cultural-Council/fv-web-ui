package ca.firstvoices.maintenance.operations;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.core.io.utils.PropertyUtils;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.maintenance.dialect.categories.Constants;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.api.trash.TrashService;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.transaction.TransactionHelper;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class, AutomationFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({
    "FirstVoicesMaintenance",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml"
})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class CleanCategoryReferencesTest extends AbstractTestDataCreatorTest {

  @Inject
  CoreSession session;

  @Inject
  protected AutomationService automationService;

  @Inject
  protected TrashService trashService;

  @Inject
  protected MockDialectService mockDialectService;

  private static final String FV_CATEGORIES_FIELD = "fv-word:categories";
  private static final String FV_PHRASE_BOOKS_FIELD = "fv-phrase:phrase_books";

  DocumentModel dialect = null;

  DocumentModelList words = null;

  DocumentModelList phrases = null;

  DocumentModel category = null;

  DocumentModel phraseBook2 = null;

  DocumentModel phraseBook = null;

  @Before
  public void setUp() {
    dialect = dataCreator.getReference(session, "testDialect");

    DocumentModel categoriesFolder = session.getChild(dialect.getRef(), DialectTypesConstants.FV_CATEGORIES_NAME);
    DocumentModel phraseBooksFolder = session.getChild(dialect.getRef(), DialectTypesConstants.FV_PHRASE_BOOKS_NAME);

    // Create a category & phrase book
    category = session.createDocument(
        session.createDocumentModel(categoriesFolder.getPathAsString(), "testCategory", FV_CATEGORY));

    DocumentModelList categories = new DocumentModelListImpl();
    categories.add(category);

    words = mockDialectService.generateFVWords(
        session, dialect.getPathAsString(), new String[]{"NewWord1"}, categories);

    phraseBook = session.createDocument(
        session.createDocumentModel(phraseBooksFolder.getPathAsString(), "testPhrasebook", FV_CATEGORY));

    phraseBook2 = session.createDocument(
        session.createDocumentModel(phraseBooksFolder.getPathAsString(), "testPhrasebook2", FV_CATEGORY));

    DocumentModelList phrase_books = new DocumentModelListImpl();
    phrase_books.add(phraseBook);
    phrase_books.add(phraseBook2);

    phrases = mockDialectService.generateFVPhrases(
        session, dialect.getPathAsString(), 1, new String[]{"New Phrase Book"}, phrase_books);

    // generateFVPhrases will pick a random phrase book. We want both assigned.
    DocumentModel phrase1 = phrases.get(0);
    phrase1.setPropertyValue(FV_PHRASE_BOOKS_FIELD, new String[]{phraseBook.getId(), phraseBook2.getId()});

    session.saveDocument(phrase1);

    assertEquals(2, PropertyUtils.getValuesAsList(phrase1, FV_PHRASE_BOOKS_FIELD).size());

    // Delete 1 category and 1 phrase book
    trashService.trashDocument(category);
    trashService.trashDocument(phraseBook);

    session.save();
  }

  @Test
  public void shouldCleanReferencesForTrashedCategories() throws OperationException {

    assertNotNull(words.get(0).getPropertyValue(FV_CATEGORIES_FIELD));
    assertNotNull(phrases.get(0).getPropertyValue(FV_PHRASE_BOOKS_FIELD));

    assertTrue(session.isTrashed(category.getRef()));
    assertTrue(session.isTrashed(phraseBook.getRef()));

    // Trigger work phase of operation
    OperationContext operation = new OperationContext(session);
    operation.setInput(dialect);

    Map<String, Object> params = new HashMap<>();

    params.put("phase", "work");
    params.put("batchSize", 1000);

    automationService.run(operation, Constants.CLEAN_CATEGORY_REFERENCES_JOB_ID, params);

    session.save();
    TransactionHelper.commitOrRollbackTransaction();
    TransactionHelper.startTransaction();

    // Ensure fields have been cleared
    DocumentModel word = session.getDocument(words.get(0).getRef());

    assertTrue(PropertyUtils.getValuesAsList(word,
        FV_CATEGORIES_FIELD).isEmpty());

    // Ensure phrase only has phrase book that was not trashed
    DocumentModel phrase = session.getDocument(phrases.get(0).getRef());

    assertTrue(PropertyUtils.getValuesAsList(phrase,
        FV_PHRASE_BOOKS_FIELD).contains(phraseBook2.getId()));
  }
}
