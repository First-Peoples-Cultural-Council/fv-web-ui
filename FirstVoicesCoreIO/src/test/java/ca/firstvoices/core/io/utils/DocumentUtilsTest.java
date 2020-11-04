package ca.firstvoices.core.io.utils;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import java.util.List;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.trash.TrashService;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.CLASS)
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
public class DocumentUtilsTest extends AbstractTestDataCreatorTest {

  @Inject
  CoreSession session;

  @Inject
  TrashService trashService;

  DocumentModel dialect = null;

  @Before
  public void setUp() {
    dialect = dataCreator.getReference(session, "testArchive");
  }

  @After
  public void tearDown() {
    DocumentModelList docs = session.query("SELECT * FROM Document WHERE ecm:isProxy = 0 AND ecm:isVersion = 0");

    for (DocumentModel doc : docs) {
      if (session.exists(doc.getRef())) {
        session.removeDocument(doc.getRef());
      }
    }
  }

  @Test
  public void shouldGetParentDoc() {
    DocumentModel language = DocumentUtils.getParentDoc(session, dialect, FV_LANGUAGE);
    assertEquals(dataCreator.getReference(session, "testLanguage").getId(), language.getId());
  }

  @Test
  public void shouldBeActiveDoc() {
    // Test workspace dialect
    assertTrue(DocumentUtils.isActiveDoc(dialect));
  }

  @Test
  public void shouldNotBeActiveDoc() {
    // Test versions of dialect
    List<DocumentModel> versions = session.getVersions(dialect.getRef());
    assertFalse(DocumentUtils.isActiveDoc(versions.get(0)));

    // Test proxy
    DocumentModelList proxies = session.getProxies(dialect.getRef(), null);
    assertFalse(DocumentUtils.isActiveDoc(proxies.get(0)));

    // Test trashed workspace dialect
    trashService.trashDocument(dialect);
    assertFalse(DocumentUtils.isActiveDoc(dialect));
  }

  @Test
  public void shouldBeMutable() {
    assertTrue(DocumentUtils.isMutable(dialect));
  }

  @Test
  public void shouldNotBeMutable() {
    List<DocumentModel> versions = session.getVersions(dialect.getRef());
    assertFalse(DocumentUtils.isMutable(versions.get(0)));

    List<DocumentModel> proxies = session.getProxies(dialect.getRef(), null);
    assertFalse(DocumentUtils.isMutable(proxies.get(0)));
  }
}
