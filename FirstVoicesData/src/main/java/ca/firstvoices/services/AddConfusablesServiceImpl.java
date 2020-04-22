package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.runtime.api.Framework;

public class AddConfusablesServiceImpl implements AddConfusablesService {

  public void addConfusables() {

    DirectoryService directoryService = Framework.getService(DirectoryService.class);

    try (Session directorySession = directoryService.open("confusable_characters")) {

      // Get all rows in the confusable_characters vocabulary
      DocumentModelList entries = directorySession.getEntries();

      // Iterate through each entry
      for (int i=0; i<=entries.size(); i++) {
        DocumentModel entry = entries.get(i);

        // Get the character unicode of the entry
        String character_unicode = entry.getPropertyValue("id").toString();
        // Get the confusable unicode value(s) as an array
        String[] confusable_unicode = entry.getPropertyValue("confusable_unicode").toString().split(",");

        /*
          todo: query for character_unicode and add each index in confusable_unicode to the uppercase or lowercase confusables
          todo: depending on if the query returned is a title or upper case character
         */
      }
    }

  }

}
