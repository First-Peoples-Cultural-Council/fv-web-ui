package ca.firstvoices.characters.listeners;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.characters.CharactersTestUtils;
import ca.firstvoices.characters.Constants;
import ca.firstvoices.data.schemas.DialectTypesConstants;
import ca.firstvoices.maintenance.common.CommonConstants;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.test.CapturingEventListener;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesCharacters"})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class AlphabetListenerTest extends AbstractTestDataCreatorTest {

  private static CapturingEventListener capturingEvents;

  DocumentModel dialect = null;

  DocumentModel alphabet = null;

  @Inject
  CoreSession session;

  @Inject
  EventService eventService;

  @BeforeClass
  public static void setupCapturingListener() {
    // Setup capturing listener for subsequent add to required jobs events
    capturingEvents = new CapturingEventListener(
        CommonConstants.ADD_TO_REQUIRED_JOBS_EVENT_ID);
  }

  @Before
  public void initAlphabetTests() {
    assertNotNull("Alphabet listener registered", eventService.getEventListener("alphabet_listener"));

    // Children containers will be created in FVDialectFactory
    dialect = session.getDocument(new IdRef(this.dataCreator.getReference("testDialect")));
    alphabet = session.getChild(dialect.getRef(), "Alphabet");

    // Create one character (but don't trigger listener)
    DocumentModel char1 = session.createDocumentModel(alphabet.getPathAsString(), "Char 1",
        DialectTypesConstants.FV_CHARACTER);
    char1.putContextData(CharacterListener.DISABLE_CHARACTER_LISTENER, true);
    session.createDocument(char1);
  }

  @After
  public void tearDown() {
    // Clear captured events before every test
    capturingEvents.clear();
  }

  @Test
  public void shouldIgnoreDisableEvent() {
    alphabet.putContextData(AlphabetListener.DISABLE_ALPHABET_LISTENER, true);

    // Edit alphabet
    alphabet.setPropertyValue(AlphabetListener.IGNORED_CHARS, new String[]{"-", "?"});
    session.saveDocument(alphabet);

    assertFalse("Should not have compute order job",
        CharactersTestUtils.requiredJobFired(capturingEvents, Constants.COMPUTE_ORDER_JOB_ID));
  }

  @Test
  public void shouldIgnoreUnacceptedTypes() {
    // Create an alphabet proxy
    DocumentModel proxy = session.createProxy(alphabet.getRef(),
        new IdRef(this.dataCreator.getReference("sectionsSharedData")));
    session.save();

    assertFalse("Should not have compute order job",
        CharactersTestUtils.requiredJobFired(capturingEvents, Constants.COMPUTE_ORDER_JOB_ID));
  }

  @Test
  public void shouldHandleEditEvent() {
    // Edit alphabet
    alphabet.setPropertyValue(AlphabetListener.IGNORED_CHARS, new String[]{"-", "?", "#"});
    session.saveDocument(alphabet);

    assertTrue("Should have compute order job",
        CharactersTestUtils.requiredJobFired(capturingEvents, Constants.COMPUTE_ORDER_JOB_ID));
  }
}