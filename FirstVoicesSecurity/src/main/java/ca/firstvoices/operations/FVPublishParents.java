/*
 * (C) Copyright ${year} Nuxeo SA (http://nuxeo.com/) and contributors.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * Contributors:
 *     dyona
 */

package ca.firstvoices.operations;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;

/**
 * Operation publishes all ancestors up to a certain document type.
 */
@Operation(id = FVPublishParents.ID, category = Constants.CAT_DOCUMENT, label = "FVPublishParents", description = "")
public class FVPublishParents extends AbstractFVPublishOperation {

    private static final Log log = LogFactory.getLog(FVPublishParents.class);

    private OperationContext ctx;

    @Param(name = "stopDocumentType", required = true)
    protected String stopDocumentType;

    public static final String ID = "FVPublishParents";

    /**
     * Method recursively publishes all parents, up to a certain type. For example, it publishes all ancestor FVCategory
     * up to FVCategories.
     * 
     * @param parent
     * @return section to publish the next iteration to
     * @since TODO
     */
    protected DocumentModel publishAncestors(DocumentModel parent) {

        if (!hasPublication(parent)) {
            DocumentModel section = publishAncestors(session.getDocument(parent.getParentRef()));
            session.publishDocument(parent, section, true);
        }

        return getSectionToPublishTo(parent);
    }

    @OperationMethod(collector = DocumentModelCollector.class)
    public DocumentModel run(DocumentModel input) {

        session = input.getCoreSession();

        // Get publication tree (=Publication Target)
        tree = ps.getPublicationTree(ps.getAvailablePublicationTree().get(0), session, null);

        // Run Sub-Automation chain to discover if stopDocumentType is published
        try {
            // Run new operation (Document.GetParent to get parent type
            ctx = new OperationContext(session);
            ctx.setInput(input);
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("type", stopDocumentType);
            DocumentModel stopTypeParent = (DocumentModel) service.run(ctx, "Document.GetParent", params);

            // If the stop document type (e.g. FVCategories in FVCategory) isn't published, return input
            if (!hasPublication(stopTypeParent)) {
                return input;
            }

        } catch (OperationException e) {
            // TODO Auto-generated catch block
            log.error(e);
        } finally {
            ctx.close();
        }

        // Stop Type parent is published

        DocumentModel sourceDocument = session.getDocument(new IdRef(input.getSourceId()));
        DocumentModel parentDependencyDocModel = session.getDocument(sourceDocument.getParentRef());

        // If parent is not published, publish ancestors recursively
        if (!hasPublication(parentDependencyDocModel)) {
            publishAncestors(parentDependencyDocModel);
        }

        // In any case, publish current document
        DocumentModel section = getSectionToPublishTo(session.getDocument(input.getParentRef()));
        session.publishDocument(input, section, true);

        // Save all of the above
        session.save();

        return input;
    }

}
