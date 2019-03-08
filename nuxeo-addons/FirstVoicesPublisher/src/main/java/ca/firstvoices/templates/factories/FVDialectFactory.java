package ca.firstvoices.templates.factories;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.content.template.factories.SimpleTemplateBasedFactory;

/**
 * Script ignores creation of structured templates within sections
 * 
 * @author dyona
 */
public class FVDialectFactory extends SimpleTemplateBasedFactory {

	@Override
	public void createContentStructure(DocumentModel eventDoc) {

        // Only apply to one type
        if ("FVDialect".equals(eventDoc.getType())) {
            if (eventDoc.isProxy()) {
                return;
            }
        }

        super.createContentStructure(eventDoc);
    }

}
