/**
 * Update the references documents to proxied one on the proxy
 */

package ca.firstvoices.publisher.listeners;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;

/**
 * Listener to unpublish documents that have been deleted.
 * @author dyona
 *
 */
public class DocumentDeletedUnpublishListener implements EventListener {

    private static final Log log = LogFactory.getLog(DocumentDeletedUnpublishListener.class);

    protected FirstVoicesPublisherService service = Framework.getService(FirstVoicesPublisherService.class);

    @Override
	public void handleEvent(Event event) {
        EventContext ctx = event.getContext();
        if (!(ctx instanceof DocumentEventContext)) {
            return;
        }
        DocumentModel doc = ((DocumentEventContext) ctx).getSourceDocument();
        if (doc == null) {
            return;
        }

        // Only required if document is not proxy
        if (!doc.isProxy()) {
            CoreSession session = doc.getCoreSession();

            DocumentModelList proxies = session.getProxies(doc.getRef(), null);

            for (DocumentModel proxy : proxies) {
                if ("Published".equals(proxy.getCurrentLifeCycleState())) {
                    service.unpublish(proxy);
                }
            }
        }
    }
}
