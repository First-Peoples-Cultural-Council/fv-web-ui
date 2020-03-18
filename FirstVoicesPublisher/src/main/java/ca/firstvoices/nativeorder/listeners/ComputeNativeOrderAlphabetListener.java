/**
 * Compute asset custom order when asset (Word/Phrase) modified or created.
 */
package ca.firstvoices.nativeorder.listeners;

import java.util.Iterator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;
import ca.firstvoices.nativeorder.services.NativeOrderComputeService;

/**
 * @author dyona
 */
public class ComputeNativeOrderAlphabetListener implements EventListener {

    private static final Log log = LogFactory.getLog(ComputeNativeOrderAlphabetListener.class);

    protected NativeOrderComputeService service = Framework.getService(NativeOrderComputeService.class);

    @Override
    public void handleEvent(Event event) {

        if (!(event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED))
                && !(event.getName().equals(DocumentEventTypes.DOCUMENT_UPDATED))) {
            return;
        }

        if (!(event.getContext() instanceof DocumentEventContext)) {
            return;
        }
        DocumentEventContext ctx = (DocumentEventContext) event.getContext();
        DocumentModel doc = ctx.getSourceDocument();

        if (doc == null) {
            return;
        }

        // Handle language assets (Words and Phrases)
        if (doc.getType().equals("FVCharacter") && !doc.isProxy()) {

            // Will always run when creating
            CoreSession session = doc.getCoreSession();
            DocumentModel dialect = session.getDocument(new IdRef((String) doc.getPropertyValue("fvancestry:dialect")));
            service.computeDialectNativeOrderTranslation(dialect);
        }
    }
}
