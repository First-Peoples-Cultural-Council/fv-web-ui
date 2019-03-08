package ca.firstvoices.operations;

import java.util.List;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentLocationImpl;
import org.nuxeo.ecm.platform.publisher.api.PublicationTree;
import org.nuxeo.ecm.platform.publisher.api.PublishedDocument;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;

public abstract class AbstractFVPublishOperation {

    protected PublicationTree tree;

    protected CoreSession session;

    protected PublisherService ps = Framework.getService(PublisherService.class);

    protected AutomationService service = Framework.getService(AutomationService.class);

	/**
	 * @param doc document to check published versions for.
	 * @return {@code true} if document has ANY published version; {@code false} otherwise
	 */
	protected Boolean hasPublication(DocumentModel doc) {

		List<PublishedDocument> publishedDocuments = tree.getExistingPublishedDocument(new DocumentLocationImpl(doc));

		if (!publishedDocuments.isEmpty()) {
			return true;
		}

		return false;
	}

	/**
	 * Method finds a section to publish to based on the document
	 * TODO: Ensure this is a little more intelligent than selecting the first section found.
	 * @param doc
	 * @return section to publish to or {@code null}
	 */
    protected DocumentModel getSectionToPublishTo(DocumentModel doc) {

		DocumentModelList sections = session.getProxies(doc.getRef(), null);

		for (DocumentModel section : sections) {
			// Ensure section is within the publication target
			if (section.getPath().toString().indexOf(tree.getPath()) == 0) {
				return section;
			}
		}

    	return null;
    }

}
