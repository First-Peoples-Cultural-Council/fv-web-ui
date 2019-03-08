package ca.firstvoices.listeners;

import org.jboss.seam.core.Events;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.publisher.api.PublicationTree;
import org.nuxeo.ecm.platform.publisher.api.PublishedDocument;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.webapp.helpers.EventNames;
import org.nuxeo.runtime.api.Framework;

/**
 * Approves or Rejects Language Administrators' publishing a dialect based on whether it is their dialect.
 */
public class RestrictFVDialectPublishing implements EventListener {

	protected static PublisherService publisherService = Framework.getService(PublisherService.class);

	/**
	 * Reject document. Borrowed mostly from PublishActionsBean.
	 * @param publishingComment
	 * @param docToReject
	 * @param session
	 */
	protected void rejectDocument(String publishingComment, DocumentModel docToReject, CoreSession session) {

        PublicationTree tree = publisherService.getPublicationTreeFor(docToReject, session);
        PublishedDocument publishedDocument = tree.wrapToPublishedDocument(docToReject);
        tree.validatorRejectPublication(publishedDocument, publishingComment);

        Events.instance().raiseEvent(EventNames.DOCUMENT_PUBLICATION_REJECTED);
	}

	@Override
	public void handleEvent(Event event) throws NuxeoException {
	       EventContext ctx = event.getContext();
	       CoreSession session = ctx.getCoreSession();
	       NuxeoPrincipal principal = (NuxeoPrincipal) ctx.getPrincipal();

	       // Skip non-document events and administrator
	       if (!(ctx instanceof DocumentEventContext) || principal.isAdministrator()) {
	           return;
	       }

	       for (Object doc : ctx.getArguments()) {
	    	   // A Language Administrator trying TO PUBLISH someone else's Dialect
	    	   if (doc instanceof DocumentModel && ((DocumentModel) doc).getType().equals("FVDialect")) {
	    		   DocumentModel currentDoc = (DocumentModel) doc;

	    		   // Check if principal has EVERYTHING permission on the source dialect, approve publishing immediately
	    		   if (session.hasPermission(principal, new IdRef(currentDoc.getSourceId()), SecurityConstants.EVERYTHING)) {
	    			   // By default, Language Administrators do not seem to need approval for this level.
	    			   return;
	    		   }
	    		   // They don't have EVERYTHING on the source dialect, reject publishing immediately
	    		   else {
	    			   rejectDocument("Can't publish someone else's Dialect.", currentDoc, session);
	    		   }
	    	   }
	       }

	}
}