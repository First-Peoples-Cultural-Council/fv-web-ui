package ca.firstvoices.services;

import ca.firstvoices.utils.FVRegistrationUtilities;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;

import static ca.firstvoices.utils.FVRegistrationConstants.APPEND;
import static ca.firstvoices.utils.FVRegistrationConstants.REMOVE;
import static ca.firstvoices.utils.FVRegistrationConstants.UPDATE;

public class FVUserGroupUpdateUtilities {

    /**
     * @param action
     * @param doc
     * @param data
     * @param schemaName
     * @param field
     */
    public static DocumentModel updateFVProperty(String action, DocumentModel doc, StringList data, String schemaName, String field )
    {
        ArrayList<String> arrayData = FVRegistrationUtilities.makeArrayFromStringList( data );

        if( !action.equals(UPDATE) )
        {
            ArrayList<String> pA =  (ArrayList<String>)doc.getProperty(schemaName, field);

            for (String g : arrayData) {
                switch (action) {
                    case APPEND:
                        pA.add(g);
                        break;
                    case REMOVE:
                        pA.remove(g);
                        break;
                }
            }

            arrayData = pA;
        }

        doc.setProperty(schemaName, field, arrayData);

        return doc;
    }
}
