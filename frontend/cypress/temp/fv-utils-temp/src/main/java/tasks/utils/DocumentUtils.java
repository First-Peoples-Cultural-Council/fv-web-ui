package tasks.utils;

import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.objects.Document;

public class DocumentUtils {

    /**
     * Get a document using the doc id
     * @param client
     * @param id
     * @return
     */
    public static Document getDocument(NuxeoClient client, String id) {
        Document doc = client.repository().fetchDocumentById(id);
        //System.out.println("-> Document is " + doc.getPath());
        return doc;
    }

    /**
     * Delete a document via the trash services so that a copy is retained
     * @param client
     * @param id
     */
    public static void softDeleteDocument(NuxeoClient client, String id) {
        client
            .operation("Document.Trash")
            .input(id)
            .execute();

    }
}
