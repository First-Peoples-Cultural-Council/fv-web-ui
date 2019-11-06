package ca.firstvoices.operations;

import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;

/**
 *
 */
@Operation(id=InitialDatabaseSetup.ID, category=Constants.CAT_DOCUMENT, label="FVInitialDatabaseSetup", description="Describe here what your operation does.")
public class InitialDatabaseSetup {

    public static final String ID = "Document.InitialDatabaseSetup";

    @Context
    protected CoreSession session;

    @Param(name = "path", required = false)
    protected String path;

    @OperationMethod
    public DocumentModel run() {
        if (StringUtils.isBlank(path)) {
            return session.getRootDocument();
        } else {
            return session.getDocument(new PathRef(path));
        }
    }
}
