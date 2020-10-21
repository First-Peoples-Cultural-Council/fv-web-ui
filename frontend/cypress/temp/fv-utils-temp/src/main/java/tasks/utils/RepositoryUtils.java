package tasks.utils;

import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.objects.Documents;

public class RepositoryUtils {

    /**
     * Disable dublin core listener so that lastContrbiutor and dc:modified are not impacted
     * Ensure this is run at night or during a maintenance window to avoid adverse effects.
     * @param client
     */
    public static void disableDCListener(NuxeoClient client) {
        client.operation("FVSetListenerFlag")
                .param("listenerName", "dclistener")
                .param("state", "disabled").execute();
    }

    /**
     * Re-enable dublin core listener
     * @param client
     */
    public static void enableDCListener(NuxeoClient client) {
        client.operation("FVSetListenerFlag")
                .param("listenerName", "dclistener")
                .param("state", "Enabled").execute();;
    }

    /**
     * Get documents from query
     * @param client
     * @param index
     * @param size
     * @param query
     * @param cols
     * @return
     */
    public static Documents getDocumentsFromQuery(NuxeoClient client, int index, int size, String query, String cols) {
//        System.out.println("-> Getting documents from query");

        return client
                .schemas("dublincore", "fvcore", "fvmedia", "userinfo", "docinfo", "fvuserinfo", "fvproxy", "fv-word")
                .operation("Document.Query")
                .param("currentPageIndex", index)
                .param("pageSize", size)
                .param("query", query)
                .execute();
    }

    /**
     * Get documents from query (only enrichers)
     * @param client
     * @param index
     * @param size
     * @param query
     * @param cols
     * @return
     */
    public static Documents getDocumentsFromQuery(NuxeoClient client, int index, int size, String query, String cols, String enricher) {
//        System.out.println("-> Getting documents from query (only enricher props)");

        return client
                .enrichersForDocument(enricher)
                .operation("Document.Query")
                .param("currentPageIndex", index)
                .param("pageSize", size)
                .param("query", query)
                .execute();
    }
}
