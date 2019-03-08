package ca.firstvoices.nuxeo.operations;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;

import java.io.Serializable;
import java.util.Iterator;
import java.util.Map;

@Operation(id = ListDialects.ID, category = Constants.CAT_DOCUMENT, label = "List dialects in FV tree",
        description = "Returns a list of dialects based on selection criteria")
public class ListDialects
{
    public static final String ID = "Document.ListDialects";

    public static final String ALL_DIALECTS          = "*";
    public static final String DIALECTS_TO_JOIN      = "to-join";
    public static final String NEW_DIALECTS          = "new";
    public static final String ENABLED_DIALECTS      = "enabled";
    public static final String DISABLED_DIALECTS     = "disabled";
    public static final String PUBLISHED_DIALECTS    = "published";

    @Context
    protected AutomationService automationService;

    @Context
    protected CoreSession session;

    @Param(name = "dialectState", required = false, values = { DIALECTS_TO_JOIN, ALL_DIALECTS, NEW_DIALECTS, ENABLED_DIALECTS, DISABLED_DIALECTS, PUBLISHED_DIALECTS } )
    protected String dialectState = DIALECTS_TO_JOIN;

    @OperationMethod
    public Blob run() throws Exception
    {
        DocumentModelList dList = null;

        String queryFront   = "SELECT ecm:uuid, dc:title FROM FVDialect WHERE ";
        String queryVersion = "ecm:isVersion=0 ";
        String queryProxy   = "ecm:isProxy=0 AND ";
        String querySort    = "ORDER BY dc:title ASC";
        String query = queryFront + queryVersion + querySort;

        switch( dialectState.toLowerCase() )
        {
            case ALL_DIALECTS:
                query = "SELECT ecm:uuid, dc:title, ecm:currentLifeCycleState FROM FVDialect " + querySort;
                break;
            case NEW_DIALECTS:
                query = queryFront + "ecm:currentLifeCycleState = 'New' " + querySort;
                break;
            case DIALECTS_TO_JOIN:
                query = queryFront + "(ecm:currentLifeCycleState = 'Enabled' OR  (ecm:currentLifeCycleState = 'Published' AND ecm:isProxy=0)) AND " + queryVersion + querySort;
                break;
            case ENABLED_DIALECTS:
                query = queryFront + "ecm:currentLifeCycleState = 'Enabled' AND " + queryVersion + querySort;
                break;
            case DISABLED_DIALECTS:
                query = queryFront + "ecm:currentLifeCycleState = 'Disabled' AND " + queryVersion + querySort;
                break;
            case PUBLISHED_DIALECTS:
                query = queryFront + "ecm:currentLifeCycleState = 'Published' AND " + queryProxy + queryVersion + querySort;
                break;
         }


        UnrestrictedDialectQuery dialectListQueryRunner = new UnrestrictedDialectQuery(session, query);
        dialectListQueryRunner.runUnrestricted();


        return new StringBlob(dialectListQueryRunner.resultSetArray.toString(), "application/json");
    }

    protected static class UnrestrictedDialectQuery extends UnrestrictedSessionRunner {

        private String query;
        private JSONArray resultSetArray;
        private IterableQueryResult result;

        protected UnrestrictedDialectQuery(CoreSession session, String query) {
            super(session);
            this.query = query;
        }

        @Override
        public void run() {
            try {
                result = session.queryAndFetch(query, "NXQL");
                Iterator<Map<String, Serializable>> it = result.iterator();

                resultSetArray = new JSONArray();
                while (it.hasNext()) {
                    Map<String, Serializable> item = it.next();
                    JSONObject object = new JSONObject();
                    object.accumulateAll(item);
                    resultSetArray.add(object);
                }
            } finally {
                result.close();
            }

        }
    }
}