package ca.firstvoices.utils;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class UtilityTestWordGenerator
{

    static private String path = "/FV/Workspaces/Data/Test-Language-Familiy-2/Test-language-2/Test-Dialect-2/Dictionary";

    static public void createWords( CoreSession session )
    {
        // "/FV/Family/Language/Dialect/Dictionary"
        String testWord = "Test_Word_";

        for (int i = 6001; i < 7001; i++ )
        {
            String wordValue = testWord +  i ;
            DocumentModel word = session.createDocumentModel( path, wordValue, "FVWord");

            Map<String, Object> complexValue = new HashMap<String, Object>();
            complexValue.put( "language" , "english");
            complexValue.put( "translation", "translation" + wordValue );
            ArrayList<Object> definitionsList = new ArrayList<>();
            definitionsList.add( complexValue );
            word.setPropertyValue( "fvcore:definitions", definitionsList );
            word.setPropertyValue("fv:reference", wordValue );
            word.setPropertyValue("fv-word:part_of_speech", "Basic" );
            word.setPropertyValue("dc:title", wordValue+"#" );

            word = session.createDocument(word);

            if( i % 20 == 0 ) {session.save(); }
        }

        session.save();
    }

}
