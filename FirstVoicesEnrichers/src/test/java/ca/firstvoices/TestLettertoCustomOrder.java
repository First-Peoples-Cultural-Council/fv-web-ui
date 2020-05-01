package ca.firstvoices;

//import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;

import ca.firstvoices.nuxeo.utils.*;
import ca.firstvoices.testUtil.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import ca.firstvoices.nativeorder.services.*;

import org.nuxeo.ecm.core.api.DocumentModelList;

import static org.junit.Assert.*;

public class TestLettertoCustomOrder extends AbstractFirstVoicesEnricherTest{

    String[] letterArray = {"a", "aa", "ae", "b", "c", "d", "e", "'"};
    int[] wordOrder = {1, 3, 5, 8, 58, 61, 1, 91};
    int customOrderBase = 34;

    NativeOrderComputeService nativeOrderComputer = new NativeOrderComputeServiceImpl();

    @Before
    public void setUpAlphabet(){
        DocumentModel languageFamily = session.getDocument(new PathRef("/FV/Family"));
        assertNotNull("Language family cannot be null", languageFamily);
        DocumentModel language = session.getDocument(new PathRef("/FV/Family/Language"));
        assertNotNull("Language cannot be null", language);
        DocumentModel dialect = getCurrentDialect();
        assertNotNull("Dialect cannot be null", dialect);
        DocumentModel alphabet = getAlphabetDoc();
        assertNotNull("Alphabet cannot be null", alphabet);
        //Figure out how to do Java Map

        for (int i = 0; i < letterArray.length; i++){

            DocumentModel letterDoc = session.createDocumentModel(dialect.getPathAsString() + "/Alphabet", letterArray[i], "FVCharacter");
            letterDoc.setPropertyValue("fvcharacter:alphabet_order", wordOrder[i]);
            letterDoc.setPropertyValue("fva:dialect", dialect.getId());
            createDocument(session, letterDoc);
            session.save();
            
        }
        
    }

    @Test
    public void testLettertoCustomOrder(){
        DocumentModel dialect = getCurrentDialect();
        updateCustomorder(dialect);
        String customOrder = "";

        for (int i = 0; i < letterArray.length; i++){
            String calculatedOrder = "";
            customOrder = EnricherUtils.convertLetterToCustomOrder(session, dialect.getId(), letterArray[i]);
            calculatedOrder = calculatedOrder + (char) (customOrderBase + wordOrder[i]);
            assertEquals(calculatedOrder, customOrder);
        }
    }

    private void updateCustomorder(DocumentModel dialect){
        nativeOrderComputer.computeDialectNativeOrderTranslation(dialect);
        session.save();

    }
}