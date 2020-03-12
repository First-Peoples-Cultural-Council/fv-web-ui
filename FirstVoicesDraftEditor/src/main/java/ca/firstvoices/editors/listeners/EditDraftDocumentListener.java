
package ca.firstvoices.editors.listeners;

        import org.apache.commons.logging.Log;
        import org.apache.commons.logging.LogFactory;
        import org.nuxeo.ecm.core.api.DocumentModel;
        import org.nuxeo.ecm.core.event.Event;
        import org.nuxeo.ecm.core.event.EventContext;
        import org.nuxeo.ecm.core.event.EventListener;
        import org.nuxeo.ecm.core.event.impl.DocumentEventContext;


public class EditDraftDocumentListener implements EventListener {

    private static final Log log = LogFactory.getLog(EditDraftDocumentListener.class);

    @Override
    public void handleEvent(Event event) {
        EventContext ctx = event.getContext();
        if (!(ctx instanceof DocumentEventContext)) {
            return;
        }

        DocumentModel doc = ((DocumentEventContext) ctx).getSourceDocument();

        if (doc == null ) {
            return;
        }

        switch( doc.getType() )
        {
            case "FVDialect":
                break;

            case "FVAlphabet":
            case "FVContributors":
            case "FVLinks":
            case "FVBooks":
            case "FVDictionary":
            case "FVLabelDictionary":
            case "FVPortal":
            case "FVResources":
            case "FVCategories":
                break;

            case "FVWord":
            case "FVLabel":
            case "FVPhrase":
            case "FVLink":
            case "FVPicture":
            case "FVVideo":
            case "FVAudio":
            case "FVCharacter":
            case "FVGallery":
                break;
        }
    }
}
