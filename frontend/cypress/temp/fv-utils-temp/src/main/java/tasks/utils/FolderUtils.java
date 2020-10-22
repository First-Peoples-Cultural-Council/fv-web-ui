package tasks.utils;

import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.objects.RecordSet;

public class FolderUtils {

    /**
     * Get the size of the documents within a folder like type
     * @param client
     * @param id
     * @param where
     * @return
     */
    public static int getSize(NuxeoClient client, String id, String where) {
        System.out.println("-> Getting folder size from remote");

        if (where == null) {
            where = "";
        }

        String query = "SELECT COUNT(ecm:uuid) FROM Document WHERE ecm:parentId = '" + id + "' AND ecm:isTrashed = 0 " + where;

        RecordSet count = client.operation("Repository.ResultSetQuery")
                .param("query", query)
                .execute();

        int firstResult = Integer.parseInt(count.getUuids().get(0).get("COUNT(ecm:uuid)"));
        int secondResult = Integer.parseInt(count.getUuids().get(1).get("COUNT(ecm:uuid)"));

        return (firstResult == 0) ? secondResult : firstResult;
    }


    /**
     * Get the documents within a folder like type. This will return IDs as a record set
     * @param client
     * @param id
     * @param index
     * @param size
     * @param where
     * @return
     */
    public static RecordSet getChildren(NuxeoClient client, String id, int index, int size, String where) {
        System.out.println("-> Getting folder items from remote dialect");

        if (where == null) {
            where = "";
        }

        String query = "SELECT dc:title, ecm:uuid FROM Document WHERE ecm:parentId = '" + id + "' AND ecm:isTrashed = 0 " + where + " ORDER BY fv:custom_order";

        return client.operation("Repository.ResultSetQuery")
                .param("currentPageIndex", index)
                .param("pageSize", size)
                .param("query", query)
                .execute();
    }

    /**
     * Get the documents within a folder like type
     * @param client
     * @param id
     * @param index
     * @param size
     * @param where
     * @param cols
     * @return
     */
    public static Documents getChildren(NuxeoClient client, String id, int index, int size, String where, String cols, boolean fetchProperties, boolean useEnrichers) {
        System.out.println("-> Getting folder items from remote dialect as documents");

        if (where == null) {
            where = "";
        }

        if (cols == null) {
            cols = "*";
        }

        String query = "SELECT " + cols +" FROM Document WHERE ecm:parentId = '" + id + "' AND ecm:isTrashed = 0 AND ecm:isVersion = 0 " + where + " ORDER BY fv:custom_order, dc:title";

        if (fetchProperties) {
            client = client.fetchPropertiesForDocument("properties");
        }

        if (useEnrichers) {
            client = client.enrichersForDocument("word", "phrase");
        }

        return client
                .schemas("dublincore", "fvcore", "fv-word", "fv-phrase", "userinfo", "docinfo", "fvuserinfo", "fvproxy")
                .operation("Document.Query")
                .param("currentPageIndex", index)
                .param("pageSize", size)
                .param("query", query)
                .execute();
    }
}
