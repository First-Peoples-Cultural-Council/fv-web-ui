package ca.firstvoices.operations;

import java.util.*;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.AutomationService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.query.sql.NXQL;

//Check category
@Operation(id=FVGetQueryResultsCount.ID, category= Constants.CAT_DOCUMENT, label="FVGetQueryResultsCount",
        description="This operation is used to get the results count of a query.  " +
                "This is so that the number of results can be when the query is fully run.")
public class FVGetQueryResultsCount{
    public static final String ID = "Document.FVGetQueryResultsCount";

    private static final Log log = LogFactory.getLog(FVGetQueryResultsCount.class);

    @Context
    protected CoreSession session;

    @Context
    protected AutomationService automationService;

    @Param(name = "dialectID")
    protected String dialectID;

    @Param(name = "query", required = true, description = "The query to " + "perform.")
    protected String query;

    // @Param(name = "language", required = false, description = "The query language.", widget = Constants.W_OPTION, values = {
    //         NXQL.NXQL })
    // protected String lang = NXQL.NXQL;

    @OperationMethod
    public int getCount() {
        int resultsCount = 0;
        try {
            resultsCount = (int) session.query(query).totalSize();
        } catch (Exception e) {
            log.warn(e);
        }
        
        // try {
        //     //String query = "Select * from Document where ecm:mixinType = 'UserRegistration'";

        //     // If dialect id provided, filter based on dialect id
        //     if (!(dialectID.toLowerCase().equals("all") || dialectID.toLowerCase().equals("*"))) {
        //         query = String.format("Select * from Document where ecm:mixinType = 'UserRegistration' and %s = '%s'",
        //                 "docinfo:documentId", dialectID);
        //     }

        //     // If "approved" or "accepted" specified, filter based on state
        //     if (pruneAction.equals(APPROVED) || pruneAction.equals(ACCEPTED)) {
        //         query = String.format(query + "AND ecm:currentLifeCycleState = '%s' ORDER BY dc:created DESC", pruneAction);
        //     }

        //     registrations = session.query(query);
        // } catch (Exception e) {
        //     log.warn(e);
        // }

        return resultsCount;
    }
}