/**
 * Update the references documents to proxied one on the proxy
 */

package ca.firstvoices.publisher.listeners;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;
import static org.nuxeo.ecm.core.api.LifeCycleConstants.TRANSTION_EVENT_OPTION_TRANSITION;
import static org.nuxeo.ecm.core.api.LifeCycleConstants.TRANSTION_EVENT_OPTION_FROM;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;


/**
 * @author loopingz
 */
public class ProxyPublisherListener implements EventListener {

    private static final Log log = LogFactory.getLog(ProxyPublisherListener.class);

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
        String transition = (String) ctx.getProperties().get(TRANSTION_EVENT_OPTION_TRANSITION);
        String transitionFrom = (String) ctx.getProperties().get(TRANSTION_EVENT_OPTION_FROM);

        // Publish or unpublish depending on the transition, the service filter depending on the document
        if ("Publish".equals(transition)) {
        	if ("Republish".equals(transitionFrom)) {
        		service.republish(doc);
        	} else {
        		service.publish(doc);
        	}

        } else if ( "Unpublish".equals(transition) || "Disable".equals(transition) || (( "delete".equals(transition) || "Delete".equals(transition) ) && "Published".equals(transitionFrom))){
            service.unpublish(doc);
        }

        // If re-publishing a dialect directly (no transition)
        if ("FVDialect".equals(doc.getType()) && "Published".equals(doc.getCurrentLifeCycleState()) && doc.isProxy()) {
            service.setDialectProxies(doc);
        }
    }
}
