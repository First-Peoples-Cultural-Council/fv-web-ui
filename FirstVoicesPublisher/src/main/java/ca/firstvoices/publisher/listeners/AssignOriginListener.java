/**
 * Update the references documents to proxied one on the proxy
 */

package ca.firstvoices.publisher.listeners;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

/**
 * Listener assigning origin document (Word/Phrase) to a media item (Photos, Videos, Audio) created within that word.
 *
 * @author dyona
 */
public class AssignOriginListener implements EventListener {

    private static final Log log = LogFactory.getLog(AssignOriginListener.class);

    private void saveOrigin(DocumentModel doc, String[] relatedMedia) {
        CoreSession session = doc.getCoreSession();

        if (relatedMedia == null) {
            return;
        }
        for (String relatedMediaItem : relatedMedia) {
            DocumentModel mediaDoc = session.getDocument(new IdRef(relatedMediaItem));
            String currentOrigin = (String) mediaDoc.getPropertyValue("fvm:origin");
            String currentDocDialect = (String) doc.getPropertyValue("fvancestry:dialect");
            String currentMediaDialect = (String) mediaDoc.getPropertyValue("fvancestry:dialect");

            if (currentOrigin == null && (currentMediaDialect != null && currentMediaDialect.equals(currentDocDialect))) {
                mediaDoc.setPropertyValue("fvm:origin", doc.getId());
                session.saveDocument(mediaDoc);
            }
        }
    }

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

        if (doc.getType().equals("FVWord") || doc.getType().equals("FVPhrase")) {
            String[] relatedPictures = (String[]) doc.getPropertyValue("fvcore:related_pictures");
            String[] relatedAudio = (String[]) doc.getPropertyValue("fvcore:related_audio");
            String[] relatedVideos = (String[]) doc.getPropertyValue("fvcore:related_videos");

            saveOrigin(doc, relatedPictures);
            saveOrigin(doc, relatedAudio);
            saveOrigin(doc, relatedVideos);
        }
    }
}
