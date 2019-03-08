/**
 *
 */
package ca.firstvoices.publisher.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;

/**
 * @author loopingz
 *
 */
public interface FirstVoicesPublisherService {
    /**
     * Publish a dialect, publishing its parents if needed and its direct publishable children
     * @param dialect
     */
    public DocumentModel publishDialect(DocumentModel dialect);

    /**
     * Publish or republish a portal's assets (arrays or strings)
     * @param dialect
     */
    public DocumentModel publishPortalAssets(DocumentModel portal);

    /**
     * Unpublish a dialect, cleaning its parent if they have no more child
     * @param dialect
     */
    public void unpublishDialect(DocumentModel dialect);

    /**
     * Publish an asset, publishing its related assets and adding proxies information
     * @param asset
     */
    public DocumentModel publishAsset(DocumentModel asset);

    /**
     * Unpublish an asset, it wont clean the related assets
     * @param asset
     */
    public void unpublishAsset(DocumentModel asset);

    /**
     * Will split depending on the document between unpublishAsset and unpublishDialect
     * @param doc to unpublish
     */
    public void unpublish(DocumentModel doc);

    /**
     * Will split depending on the document between publishAsset and publishDialect
     * @param doc to publish
     */
    public DocumentModel publish(DocumentModel doc);

	public DocumentModel republish(DocumentModel doc);

	public DocumentModel getPublication(CoreSession session, DocumentRef docRef);

    public DocumentModel publishDocument(CoreSession session, DocumentModel doc, DocumentModel section);

    DocumentModel setDialectProxies(DocumentModel dialectProxy);
}
