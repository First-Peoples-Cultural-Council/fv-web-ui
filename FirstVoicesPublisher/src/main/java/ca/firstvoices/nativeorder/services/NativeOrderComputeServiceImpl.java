/**
 *
 */
package ca.firstvoices.nativeorder.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

import ca.firstvoices.services.AbstractService;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author loopingz
 *
 */
public class NativeOrderComputeServiceImpl extends AbstractService implements NativeOrderComputeService {

    private DocumentModel[] loadAlphabet(CoreSession session, DocumentModel dialect) {
        DocumentModelList chars = session.query("SELECT * FROM FVCharacter WHERE ecm:ancestorId='"+dialect.getId()+ "' AND ecm:currentLifeCycleState <> 'deleted' ORDER BY fvcharacter:alphabet_order");
        DocumentModel[] models = new DocumentModel[chars.size()];

        models = chars.toArray(models);

        DocumentModel[] sortedModels = new DocumentModel[chars.size()];
        int i, j;
        for( i = 0; i < models.length; i++ ) {
        	DocumentModel item = models[ i ];
        	DocumentModel toAdd = item;
        	String title = (String) item.getPropertyValue( "dc:title" );
        	Long order = (Long)item.getPropertyValue( "fvcharacter:alphabet_order" );
        	for( j = i + 1; j < models.length; j++ ) {
        		DocumentModel item2 = models[ j ];
        		String title2 = (String) item2.getPropertyValue( "dc:title" );
        		Long order2 = (Long) item2.getPropertyValue( "fvcharacter:alphabet_order" );

        		if( order != null || order2 != null ) {
        			// use the orders to sort by
        			if( order == null ) {
        				// use item2
        				toAdd = item2;
        			} else if( order != null && order2 != null ) {
        				if( order2 < order ) {
        					// use item2
        					toAdd = item2;
        				}
        			}
        		} else if( title == null || ( title.length() < title2.length() ) ) {
        			toAdd = item2;
        		}

        		title = (String) toAdd.getPropertyValue( "dc:title" );
        		order = (Long) toAdd.getPropertyValue( "fvcharacter:alphabet_order" );
        	}

        	sortedModels[ i ] = toAdd;
        }

        return sortedModels;
    }

    /* (non-Javadoc)
     * @see ca.firstvoices.publisher.services.NativeOrderComputeService#computeAssetNativeOrderTranslation(org.nuxeo.ecm.core.api.DocumentModel)
     */
    @Override
    public void computeAssetNativeOrderTranslation(DocumentModel asset) {
    	// appears that there's a lot of processing going on within the following methods
    	// last of which, computeNativeOrderTranslation will just return if the asset is immutable
    	// so, instead of processing all the dialect data, and the alphabet only to do nothing,
    	// lets check that here
    	if( !asset.isImmutable() ) {
    		DocumentModel dialect = getDialect(asset);
    		CoreSession session = asset.getCoreSession();
    		// First get the native alphabet
    		DocumentModel[] chars = loadAlphabet(session, dialect);
    		computeNativeOrderTranslation(chars, asset);
    	}
    }

    /* (non-Javadoc)
     * @see ca.firstvoices.publisher.services.NativeOrderComputeService#computeDialectNativeOrderTranslation(org.nuxeo.ecm.core.api.DocumentModel)
     */
    @Override
    public void computeDialectNativeOrderTranslation(DocumentModel dialect) {
        CoreSession session = dialect.getCoreSession();
        // First get the native alphabet
        DocumentModel[] chars = loadAlphabet(session, dialect);
        computeNativeOrderTranslation(chars, session.query("SELECT * FROM FVWord WHERE ecm:ancestorId='"+dialect.getId()+"'"));
        computeNativeOrderTranslation(chars, session.query("SELECT * FROM FVPhrase WHERE ecm:ancestorId='"+dialect.getId()+"'"));
        session.save();
    }

    protected void computeNativeOrderTranslation(DocumentModel[] chars, DocumentModel element) {
    	if( element.isImmutable() ) {
    		// We cannot update this element, no point in going any further
    		return;
    	}
        String title = (String) element.getPropertyValue("dc:title");
        String nativeTitle = "";
        while (title.length() > 0) {
            boolean found = false;

            // Evaluate characters in reverse to find 'double' chars (e.g. 'aa' vs. 'a') before single ones
            int i;

            List<String> fvChars = Arrays.stream(chars).map(character -> (String) character.getPropertyValue("dc:title")).collect(Collectors.toList());
            List<String> upperChars = Arrays.stream(chars).map(character -> (String) character.getPropertyValue("fvcharacter:upper_case_character")).collect(Collectors.toList());

            for (i = chars.length - 1; i >= 0; --i) {
                DocumentModel charDoc = chars[i];
                String charValue = (String) charDoc.getPropertyValue("dc:title");
                String ucCharValue = (String) charDoc.getPropertyValue("fvcharacter:upper_case_character");

                if (isCorrectCharacter(title, fvChars, upperChars, charValue, ucCharValue)) {
                    if ((charValue != null && title.startsWith(charValue)) || (ucCharValue != null && title.startsWith(ucCharValue))) {
                        nativeTitle += new Character((char) (33 + (Long) charDoc.getPropertyValue("fvcharacter:alphabet_order"))).toString();
                        title = title.substring(charValue.length());
                        found = true;
                        break;
                    }
                };
            }
            if (!found) {
                if (" ".equals(title.substring(0, 1))) {
                    nativeTitle += new Character((char) (33 + chars.length + 1)).toString();
                } else {
                    nativeTitle += title.substring(0,1);
                }
                title = title.substring(1);
            }
        }

        if( !element.isImmutable() ) {
        	element.setPropertyValue("fv:custom_order", nativeTitle);
        }
        element.getCoreSession().saveDocument(element);
    }

    protected void computeNativeOrderTranslation(DocumentModel[] chars, DocumentModelList elements) {
        for (DocumentModel doc : elements) {
            computeNativeOrderTranslation(chars, doc);
        }
    }

    private boolean isCorrectCharacter(String title, List<String> fvChars, List<String> upperChars, String charValue, String ucCharValue) {
        boolean isIncorrect;
        List<String> charsStartingWithCurrentCharLower = fvChars.stream().filter(character -> character.startsWith(charValue)).collect(Collectors.toList());
        isIncorrect = charsStartingWithCurrentCharLower.stream().anyMatch(character -> character != charValue && title.startsWith(character));

        if (ucCharValue != null && !isIncorrect) {
            List<String> charsStartingWithCurrentCharUpper = upperChars.stream().filter(character -> character.startsWith(ucCharValue)).collect(Collectors.toList());
            isIncorrect = charsStartingWithCurrentCharUpper.stream().anyMatch(uCharacter -> uCharacter != ucCharValue && title.startsWith(uCharacter));
        }

        return !isIncorrect;
    }
}
