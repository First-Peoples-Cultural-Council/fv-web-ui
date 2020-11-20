/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.maintenance.dialect.categories.operations;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORIES_NAME;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE_BOOKS_NAME;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;

import ca.firstvoices.core.io.utils.PropertyUtils;
import ca.firstvoices.core.io.utils.SessionUtils;
import ca.firstvoices.maintenance.common.AbstractMaintenanceOperation;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import ca.firstvoices.maintenance.dialect.categories.Constants;
import java.util.ArrayList;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;

@Operation(id = CleanReferences.ID, category = Constants.GROUP_NAME, label =
    Constants.CLEAN_CATEGORY_REFERENCES_ACTION_ID, description =
    "Operation to clean category/phrasebook references from words/phrases")
public class CleanReferences extends AbstractMaintenanceOperation {

  public static final String ID = Constants.CLEAN_CATEGORY_REFERENCES_ACTION_ID;

  @Context
  protected CoreSession session;


  @Param(name = "phase", values = {"init", "work"})
  protected String phase = "init";

  @OperationMethod
  public void run(DocumentModel dialect) throws OperationException {
    limitToSuperAdmin(session);
    limitToDialect(dialect);
    executePhases(dialect, phase);
  }

  @Override
  protected void executeInitPhase(DocumentModel dialect) {
    RequiredJobsUtils.addToRequiredJobs(dialect, Constants.CLEAN_CATEGORY_REFERENCES_JOB_ID);
  }

  @Override
  protected void executeWorkPhase(DocumentModel dialect) {
    processTrashedCategoryItems(dialect.getRef(), FV_CATEGORIES_NAME);
    processTrashedCategoryItems(dialect.getRef(), FV_PHRASE_BOOKS_NAME);

    // Remove from required jobs
    RequiredJobsUtils.removeFromRequiredJobs(dialect,
        Constants.CLEAN_CATEGORY_REFERENCES_JOB_ID, true);
  }

  private void processTrashedCategoryItems(DocumentRef dialectRef, String folderName) {
    DocumentModel folder = session.getChild(dialectRef, folderName);

    // Get all trashed categories for the folder (Categories/Phrase Books)
    String trashedItemsQuery = String
        .format("SELECT * FROM FVCategory WHERE ecm:ancestorId = '%s' AND ecm:isTrashed = 1",
            folder.getId());

    DocumentModelList trashedCategories = session.query(trashedItemsQuery);

    for (DocumentModel trashedCategory : trashedCategories) {
      processTrashedCategory(trashedCategory, folderName);
    }
  }

  private void processTrashedCategory(DocumentModel category, String folderName) {
    String typeToHandle = null;
    String fieldToUpdate = "";

    if (FV_CATEGORIES_NAME.equals(folderName)) {
      typeToHandle = FV_WORD;
      fieldToUpdate = "fv-word:categories";
    } else if (FV_PHRASE_BOOKS_NAME.equals(folderName)) {
      typeToHandle = FV_PHRASE;
      fieldToUpdate = "fv-phrase:phrase_books";
    }

    if (typeToHandle == null) {
      return;
    }

    String query = String.format(
        "SELECT * FROM %s WHERE %s IN ('%s') "
            + "AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
        typeToHandle, fieldToUpdate, category.getId());

    DocumentModelList docsToUpdate = session.query(query);

    // Update references
    for (DocumentModel doc : docsToUpdate) {

      ArrayList<String> currentValues = (ArrayList<String>) PropertyUtils
          .getValuesAsList(doc, fieldToUpdate);
      currentValues.remove(category.getId());
      doc.setPropertyValue(fieldToUpdate, currentValues);

      SessionUtils.saveDocumentWithoutEvents(session, doc, true, null);
    }
  }
}
