package ca.firstvoices.editors.synchronizers;

import ca.firstvoices.editors.configuration.FVLocalConfAdaptor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;

/**
 *
 */
public class SynchronizerFactory {
    private static final Log log = LogFactory.getLog(SynchronizerFactory.class);

    /**
     * @param - src document in synchronizing session
     * @return AbstractSynchronizer - synchronizer corresponding to FV document type
     *         null - this is a type with a missing synchronizer
     */
    public static AbstractSynchronizer produceSynchronizer(DocumentModel src) {

        try {
            switch (src.getType()) {
                case "FVBook":
                    return new FVBookSynchronizer();

                case "FVCharacter":
                    return new FVCharacterSynchronizer();

                case "FVDialect":
                    return new FVDialectSynchronizer();

                case "FVGallery":
                    return new FVGallerySynchronizer();

                case "FVVideo":
                case "FVPicture":
                case "FVAudio":
                    return new FVMediaSynchronizer();

                case "FVPhrase":
                    return new FVPhraseSynchronizer();

                case "FVPortal":
                    return new FVPortalSynchronizer();

                case "FVWord":
                    return new FVWordSynchronizer();

                default:
                    throw new Exception("Unhandled FV type + " + src.getType());
            }
        } catch (Exception e ){
            log.warn("UNKNOWN: " +e);
        }

        return null;
    }
}
