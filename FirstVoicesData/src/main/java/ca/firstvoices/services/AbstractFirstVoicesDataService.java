package ca.firstvoices.services;

import java.util.ArrayList;
import java.util.Arrays;
import org.nuxeo.ecm.core.api.DocumentModel;

public abstract class AbstractFirstVoicesDataService {

    protected DocumentModel getDialect(DocumentModel doc) {
        if ("FVDialect".equals(doc.getType())) {
            return doc; // doc is dialect
        }
        DocumentModel parent = doc.getCoreSession().getParentDocument(doc.getRef());
        while (parent != null && !"FVDialect".equals(parent.getType())) {
            parent = doc.getCoreSession().getParentDocument(parent.getRef());
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
