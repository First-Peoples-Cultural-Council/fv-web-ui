package ca.firstvoices.services;

import java.util.ArrayList;
import java.util.Arrays;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.runtime.api.Framework;

public class AddConfusablesServiceImpl implements AddConfusablesService {

  public void addConfusables(CoreSession session) {

    DirectoryService directoryService = Framework.getService(DirectoryService.class);

    try (Session directorySession = directoryService.open("confusable_characters")) {

      // Get all rows in the confusable_characters vocabulary
      DocumentModelList entries = directorySession.getEntries();

      // Iterate through each entry
      for (DocumentModel entry : entries) {
        // Get the character unicode of the entry
        String character = entry.getPropertyValue("label").toString();
        // Get the confusable unicode value(s) as an array
        String[] confusables = entry.getPropertyValue("confusable_char").toString().split(",");

        // Do a query for the alphabet characters that match the spreadsheet
        DocumentModelList charactersDocs = session.query(
            "SELECT * FROM FVCharacter WHERE dc:title='" + character
                + "' OR fvcharacter:upper_case_character='" + character + "'");

        // Iterate over each alphabet character returned by the query
        for (DocumentModel doc : charactersDocs) {
          // If a character was matched by title then update the lowercase confusable characters
          if (doc.getPropertyValue("dc:title").equals(character)) {
            String[] existing = (String[]) doc.getPropertyValue("fvcharacter:confusable_characters");
            if (existing != null) {
              ArrayList<String> newArrayList = new ArrayList<>(Arrays.asList(existing));
              doc.setPropertyValue("fvcharacter:confusable_characters", getNewConfusables(newArrayList, existing, confusables));
              System.out.println("Added " + Arrays.toString(newArrayList.toArray()) + " to " + character);
            } else {
              doc.setPropertyValue("fvcharacter:confusable_characters", confusables);
              System.out.println("Added " + Arrays.toString(confusables) + " to " + character);
            }
            // If a character was matched to an uppercase character then update the uppercase confusable characters
          } else {
            String[] existing = (String[]) doc.getPropertyValue("fvcharacter:upper_case_confusable_characters");
            if (existing != null) {
              ArrayList<String> newArrayList = new ArrayList<>(Arrays.asList(existing));
              doc.setPropertyValue("fvcharacter:upper_case_confusable_characters", getNewConfusables(newArrayList, existing, confusables));
              System.out.println("Added " + Arrays.toString(newArrayList.toArray()) + " to " + character);
            } else {
              doc.setPropertyValue("fvcharacter:upper_case_confusable_characters", confusables);
              System.out.println("Added " + Arrays.toString(confusables) + " to " + character);
            }
          }
          session.saveDocument(doc);
        }
      }
    }

  }

  // Helper method to check existing confusables and only add new ones if they don't already exist
  private ArrayList<String> getNewConfusables(ArrayList<String> newArrayList, String[] existing, String[] confusables) {
    for (String confusable : confusables) {
      boolean found = false;
      for (String item : existing) {
        if (confusable.equals(item)) {
          found = true;
        }
      }
      if (!found) {
        newArrayList.add(confusable);
      }
    }
    return newArrayList;
  }

}
