package ca.firstvoices.listeners;

import ca.firstvoices.services.AssignAncestorsService;
import com.ibm.icu.lang.UCharacter;
import com.ibm.icu.lang.UCharacterCategory;
import com.ibm.icu.text.UnicodeSet;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.schema.DocumentType;
import org.nuxeo.runtime.api.Framework;

import java.util.Arrays;

public class FVDocumentListener implements EventListener {
  
  @Context
  protected CoreSession session;
  
  protected AssignAncestorsService service = Framework.getService(AssignAncestorsService.class);
  
  @Override
  public void handleEvent(Event event) {
    
    // Get event context and return if not DocumentEventContext
    EventContext ctx;
    ctx = event.getContext();
    if (!(ctx instanceof DocumentEventContext))
      return;
    
    // Get document from context and return if it is not mutable
    DocumentModel document = ((DocumentEventContext) ctx).getSourceDocument();
    if (document == null || document.isImmutable()) {
      return;
    }
    
    // Check that the document is a specific type using the helper method
    if (!(checkType(document)))
      return;
    
    CoreSession session = ctx.getCoreSession();

    String docTitle = document.getProperty("dc:title").toString();
    // Check that the document title doesn't have confusing unicode
    if (getNumberRepresentatives(docTitle)) {
      System.out.println("here!");
    } else {
      System.out.println("here!");
    }

    // If the document is mutable and is the proper type then assign its ancestors.
    service.assignAncestors(session, document);
    
  }
  
  // Helper method to check that the new document is one of the types below
  private boolean checkType(DocumentModel inputDoc) {
    DocumentType currentType = inputDoc.getDocumentType();
    
    String[] types = {
        "FVAlphabet",
        "FVAudio",
        "FVBook",
        "FVBookEntry",
        "FVBooks",
        "FVCategories",
        "FVCategory",
        "FVCharacter",
        "FVContributor",
        "FVContributors",
        "FVDialect",
        "FVDictionary",
        "FVGallery",
        "FVLanguage",
        "FVLanguageFamily",
        "FVLink",
        "FVLinks",
        "FVPhrase",
        "FVPicture",
        "FVPortal",
        "FVResources",
        "FVVideo",
        "FVWord",
    };
  
    return Arrays.stream(types).parallel().anyMatch(currentType.toString()::contains);
  }

  private boolean getNumberRepresentatives(String identifier) {
    int cp;
    UnicodeSet numerics = new UnicodeSet();
    for (int i = 0; i < identifier.length(); i += Character.charCount(i)) {
      cp = Character.codePointAt(identifier, i);
      // Store a representative character for each kind of decimal digit
      switch (UCharacter.getType(cp)) {
        case UCharacterCategory.DECIMAL_DIGIT_NUMBER:
          // Just store the zero character as a representative for comparison.
          // Unicode guarantees it is cp - value.
          numerics.add(cp - UCharacter.getNumericValue(cp));
          break;
        case UCharacterCategory.OTHER_NUMBER:
        case UCharacterCategory.LETTER_NUMBER:
          throw new IllegalArgumentException("Should not be in identifiers.");
      }
    }
    return (numerics.size() == 1);
  }

}