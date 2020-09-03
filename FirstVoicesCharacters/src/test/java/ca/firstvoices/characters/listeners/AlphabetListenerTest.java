package ca.firstvoices.characters.listeners;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.data.utils.PropertyUtils;
import ca.firstvoices.maintenance.common.CommonConstants;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.transaction.TransactionHelper;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({
    "FirstVoicesCharacters", // Included for listeners and services listeners rely on
    "FirstVoicesMaintenance" // Included for fv-maintenance schema
})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class AlphabetListenerTest extends AbstractTestDataCreatorTest {

  DocumentModel dialect = null;
  DocumentModel alphabet = null;

  @Inject
  CoreSession session;

  @Inject
  EventService eventService;

  @Before
  public void initAlphabetTests() {
    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }

    assertNotNull("Alphabet event registered", eventService.getEventListener("alphabet_listener"));

    // Children containers will be created in FVDialectFactory
    dialect = session.getDocument(new IdRef(this.dataCreator.getReference("testDialect")));
    alphabet = session.getChild(dialect.getRef(), "Alphabet");

    // Create one character (but don't trigger listener)
    DocumentModel char1 = session.createDocumentModel(alphabet.getPathAsString(), "Char 1", DialectTypesConstants.FV_CHARACTER);
    char1.putContextData(CharacterListener.DISABLE_CHARACTER_LISTENER, true);
    session.createDocument(char1);
  }

  @Test
  public void testDisableEvent() {
    alphabet.putContextData(AlphabetListener.DISABLE_ALPHABET_LISTENER, true);

    // Edit alphabet
    alphabet.setPropertyValue(AlphabetListener.IGNORED_CHARS, new String[]{"-", "?"});
    session.saveDocument(alphabet);

    assertFalse("Custom order recompute job NOT created", PropertyUtils
        .getValuesAsList(dialect, CommonConstants.REQUIRED_JOBS_FULL_FIELD).contains(Constants.COMPUTE_ORDER_JOB_ID));
  }

  @Test
  public void testUnacceptedTypes() {
    // Create an alphabet proxy
    DocumentModel proxy = session.createProxy(alphabet.getRef(), new IdRef(this.dataCreator.getReference("sectionsSharedData")));
    session.save();

    assertFalse("Custom order recompute job NOT created", PropertyUtils
        .getValuesAsList(dialect, CommonConstants.REQUIRED_JOBS_FULL_FIELD).contains(Constants.COMPUTE_ORDER_JOB_ID));
  }

  @Test
  public void testHandleEvent() {
    // Edit alphabet
    alphabet.setPropertyValue(AlphabetListener.IGNORED_CHARS, new String[]{"-", "?", "#"});
    session.saveDocument(alphabet);

    assertTrue("Custom order recompute job created", PropertyUtils
        .getValuesAsList(dialect, CommonConstants.REQUIRED_JOBS_FULL_FIELD).contains(Constants.COMPUTE_ORDER_JOB_ID));
  }
}