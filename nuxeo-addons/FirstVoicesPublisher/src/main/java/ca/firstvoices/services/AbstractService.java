package ca.firstvoices.services;

import java.util.ArrayList;
import java.util.Arrays;

import org.nuxeo.ecm.core.api.DocumentModel;

public abstract class AbstractService {

    protected DocumentModel getDialect(DocumentModel doc) {
        DocumentModel parent = doc;
        while (parent != null && !"FVDialect".equals(parent.getType())) {
            parent = doc.getCoreSession().getDocument(parent.getParentRef());
        }
        return parent;
    }

    protected ArrayList<String> getPropertyValueAsArray(DocumentModel input, String dependency) {

    	ArrayList<String> propertyValueArray = new ArrayList<String>();

	    try {
	    	String[] propertyValues = (String[]) input.getPropertyValue(dependency);

	    	if (propertyValues != null) {
	    		propertyValueArray = new ArrayList<String>(Arrays.asList(propertyValues));
	    	}
	    }
	    // Convert a string to a string array for simplicity
	    catch (ClassCastException e) {
	    	propertyValueArray = new ArrayList<String>();
	    	propertyValueArray.add((String) input.getPropertyValue(dependency));
	    }

	    return propertyValueArray;
    }
}
