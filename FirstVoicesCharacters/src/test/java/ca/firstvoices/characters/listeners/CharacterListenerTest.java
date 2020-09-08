package ca.firstvoices.characters.listeners;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.characters.CharactersTestUtils;
import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.services.CleanupCharactersServiceImpl;
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
import org.nuxeo.ecm.core.api.trash.TrashService;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.test.CapturingEventListener;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({CoreFeature.class})
@RepositoryConfig(cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesCharacters"})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
public class CharacterListenerTest extends AbstractTestDataCreatorTest {

  DocumentModel dialect = null;
  DocumentModel alphabet = null;
  DocumentModel char1 = null;

  @Inject
  CoreSession session;

  @Inject
  EventService eventService;

  private static CapturingEventListener capturingEvents;

  @BeforeClass
  public static void setupCapturingListener() {
    // Setup capturing listener for subsequent add to required jobs events
    capturingEvents = new CapturingEventListener(
        CommonConstants.ADD_TO_REQUIRED_JOBS_EVENT_ID);
  }

  @Before
  public void initCharacterTests() {
    assertNotNull("Character listener registered", eventService.getEventListener("character_listener"));

    // Children containers will be created in FVDialectFactory
    dialect = session.getDocument(new IdRef(this.dataCreator.getReference("testDialect")));
    alphabet = session.getChild(dialect.getRef(), "Alphabet");

    // Create one character (but don't trigger listener)
    char1 = createCharacterModel("char1");
    char1.putContextData(CharacterListener.DISABLE_CHARACTER_LISTENER, true);
    session.createDocument(char1);

    assertFalse("Should not have compute order job",
        CharactersTestUtils.requiredJobFired(capturingEvents, Constants.COMPUTE_ORDER_JOB_ID));
  }

  @After
  public void tearDown() {
    // Clear captured events before every test
    capturingEvents.clear();
  }

  @Test
  public void shouldIgnoreEventOfUnacceptedTypes() {
    // Create a character proxy
    DocumentModel proxy = session.createProxy(char1.getRef(),
        new IdRef(this.dataCreator.getReference("sectionsSharedData")));
    session.save();

    assertFalse("Should not have compute order job",
        CharactersTestUtils.requiredJobFired(capturingEvents, Constants.COMPUTE_ORDER_JOB_ID));
  }

  @Test
  public void shouldHandleCreateEvent() {

    // Create a character with confusables
    DocumentModel char2 = createCharacterModel("char2");
    char2.setPropertyValue(CleanupCharactersServiceImpl.LC_CONFUSABLES, new String[]{"%"});
    session.createDocument(char2);
    session.save();

    assertTrue("Should have compute order job",
        CharactersTestUtils.requiredJobFired(capturingEvents, Constants.COMPUTE_ORDER_JOB_ID));

    assertTrue("Should have clean confusables job",
        CharactersTestUtils.requiredJobFired(capturingEvents, Constants.CLEAN_CONFUSABLES_JOB_ID));
  }

  @Test
  public void shouldHandleTrashedEvent() {

    // Create a character with confusables
    DocumentModel char2 = createCharacterModel("char2");
    char2.setPropertyValue(CleanupCharactersServiceImpl.LC_CONFUSABLES, new String[]{"%"});
    char2.putContextData(CharacterListener.DISABLE_CHARACTER_LISTENER, true);
    char2 = session.createDocument(char2);
    session.save();

    assertFalse("Should not have compute order job",
        CharactersTestUtils.requiredJobFired(capturingEvents, Constants.COMPUTE_ORDER_JOB_ID));

    TrashService trashService = Framework.getService(TrashService.class);
    trashService.trashDocument(session.getDocument(char2.getRef()));

    assertTrue("Should have compute order job",
        CharactersTestUtils.requiredJobFired(capturingEvents, Constants.COMPUTE_ORDER_JOB_ID));
  }

  private DocumentModel createCharacterModel(String name) {
    // Create one character (but don't trigger listener)
    return session
        .createDocumentModel(alphabet.getPathAsString(), name, DialectTypesConstants.FV_CHARACTER);
  }
}