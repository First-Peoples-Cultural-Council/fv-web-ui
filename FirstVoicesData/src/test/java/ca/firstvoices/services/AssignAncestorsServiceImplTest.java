package ca.firstvoices.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.junit.Test;
import org.nuxeo.ecm.core.api.DocumentModel;

public class AssignAncestorsServiceImplTest extends AbstractFirstVoicesDataTest {

  @Test
  public void assignAncestors() {

    // Get the DocumentModels for each of the parent documents
    assertNotNull("Language family cannot be null", languageFamily);
    assertNotNull("Language cannot be null", language);
    assertNotNull("Dialect cannot be null", dialect);

    // Create a new child document
    DocumentModel TestWord = createDocument(session, session.createDocumentModel("/FV/Family/Language/Dialect", "TestLink", "FVLinks"));

    // Check that the child document does not have the parent document UUIDs in it's properties
    assertNull("Word should have no ID for parent family property", TestWord.getPropertyValue("fva:family"));
    assertNull("Word should have no ID for parent language property", TestWord.getPropertyValue("fva:language"));
    assertNull("Word should have no ID for parent dialect property", TestWord.getPropertyValue("fva:dialect"));

    // Run the service against the new child document
    assignAncestorsService.assignAncestors(session, TestWord);
    
    // Check that the child now has the correct UUIDs of the parent documents in it's properties
    assertEquals("Word should have ID of parent family property", languageFamily.getId(), TestWord.getPropertyValue("fva:family"));
    assertEquals("Word should have ID of parent language property", language.getId(), TestWord.getPropertyValue("fva:language"));
    assertEquals("Word should have ID of parent dialect property", dialect.getId(), TestWord.getPropertyValue("fva:dialect"));
  }
}
