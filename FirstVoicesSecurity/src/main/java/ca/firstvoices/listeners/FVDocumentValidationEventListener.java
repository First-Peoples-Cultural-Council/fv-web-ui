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

/**
 *
 */

package ca.firstvoices.listeners;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;

import java.util.List;
import java.util.Map;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.RecoverableClientException;
import org.nuxeo.ecm.core.api.event.CoreEventConstants;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.event.DeletedDocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.platform.web.common.exceptionhandling.ExceptionHelper;

/**
 * @author cstuart
 */
public class FVDocumentValidationEventListener implements EventListener {

  public void handleEvent(Event event) throws NuxeoException {

    // aboutToCreate and beforeDocumentModification events
    if (!DocumentEventTypes.ABOUT_TO_CREATE.equals(event.getName())
        && !DocumentEventTypes.BEFORE_DOC_UPDATE.equals(event.getName())) {
      return;
    }
    if (!(event.getContext() instanceof DocumentEventContext)) {
      return;
    }
    DocumentEventContext ctx = (DocumentEventContext) event.getContext();
    DocumentModel doc = ctx.getSourceDocument();
    // Skip shallow document
    if (doc instanceof DeletedDocumentModel) {
      return;
    }
    if (doc.isProxy() || doc.isVersion()) {
      return;
    }

    // Word and Phrase validation rules
    if (doc.getType().matches("FVWord|FVPhrase")) {

      // Word and Phrase
      String title = (String) doc.getPropertyValue("dc:title");
      if (title == null || title.isEmpty()) {
        generateValidationError(event, "Title cannot be empty.");
      }

      List<Map<String, String>> literalTranslations = (List<Map<String, String>>) doc
          .getPropertyValue("fv:literal_translation");
      List<Map<String, String>> definitions = (List<Map<String, String>>) doc
          .getPropertyValue("fv:definitions");

      // Return an error if definitions is empty
      if (definitions == null || definitions.isEmpty()) {
        generateValidationError(event, "At least one definition is required.");
      }

      // Check for values that are duplicated between the Literal Translation and Definition
      // fields.
      for (Map<String, String> literalTranslation : literalTranslations) {
        String literalTranslationLanguage = literalTranslation.get("language");
        String literalTranslationValue = literalTranslation.get("translation");

        for (Map<String, String> definition : definitions) {
          String definitionLanguage = definition.get("language");
          String definitionValue = definition.get("translation");
          // If duplicate is detected, throw error
          if (literalTranslationLanguage.equalsIgnoreCase(definitionLanguage)
              && literalTranslationValue.equalsIgnoreCase(definitionValue)) {
            generateValidationError(event,
                "Literal translation values cannot be the same as definition values.");
          }
        }
      }

      // Word-specific
      if (doc.getType().equals(FV_WORD)) {
        // Return an error if part of speech is empty
        String partOfSpeech = (String) doc.getPropertyValue("fv-word:part_of_speech");
        if (partOfSpeech == null || partOfSpeech.isEmpty()) {
          generateValidationError(event, "Part of speech cannot be empty.");
        }

        // Check title and part of speech combination
        if (!wordTitleValidates(ctx, title)) {
          generateValidationError(event,
              "A word with the same title/part of speech already exists in this dictionary.");
        }
      }

      // Phrase-specific
      if (doc.getType().equals(FV_PHRASE)) {
        if (!documentTitleValidates(ctx, title)) {
          generateValidationError(event,
              "A phrase with the same title already exists in this dictionary.");
        }
      }
    } else if (doc.getType().matches("FVCategory|FVContributor|FVPhraseBook|FVBook|FVGallery")) {
      // Validation for other specified document types

      // Return an error if dc:title is empty
      String title = (String) doc.getPropertyValue("dc:title");
      if (title == null || title.isEmpty()) {
        generateValidationError(event, "Title cannot be empty.");
      }
      if (!documentTitleValidates(ctx, title)) {
        generateValidationError(event,
            "A document with the same title already exists under the current parent.");
      }
    }
  }

  // Validate the title of a non-word document. A document title must be unique under the same
  // parent
  protected boolean documentTitleValidates(DocumentEventContext ctx, String title) {

    DocumentModel doc = ctx.getSourceDocument();
    String docType = doc.getDocumentType().getName();

    // retrieving parent folderish document
    DocumentRef parentRef = (DocumentRef) ctx.getProperty(CoreEventConstants.DESTINATION_REF);
    // Retrieve parent doc reference if an existing doc is being modified
    if (parentRef == null) {
      parentRef = doc.getParentRef();
    }

    DocumentModel parentDoc = ctx.getCoreSession().getDocument(parentRef);
    // searching for documents with same title in the parent folderish document Exclude the
    // current document from the results
    StringBuilder sb = new StringBuilder(
        "SELECT " + NXQL.ECM_UUID + " FROM " + docType + " WHERE ");
    sb.append("dc:title").append("=").append(NXQL.escapeString(title)).append(" AND ")
        .append(NXQL.ECM_PARENTID).append("=").append(NXQL.escapeString(parentDoc.getId()));

    // If an existing document is being modified, exclude it from the results of the query
    if (doc.getId() != null) {
      sb.append(" AND ").append(NXQL.ECM_UUID).append("!=").append(NXQL.escapeString(doc.getId()));
    }

    IterableQueryResult result = ctx.getCoreSession().queryAndFetch(sb.toString(), NXQL.NXQL);
    long resultsCount = result.size();
    result.close();
    return (resultsCount == 0);
  }

  // Validate the title of a word. A word must have a unique combination of title/part of speech
  // under the same parent
  protected boolean wordTitleValidates(DocumentEventContext ctx, String title) {

    DocumentModel doc = ctx.getSourceDocument();
    String partOfSpeech = (String) doc.getPropertyValue("fv-word:part_of_speech");

    // Retrieving parent folderish document during document creation
    DocumentRef parentRef = (DocumentRef) ctx.getProperty(CoreEventConstants.DESTINATION_REF);
    // Retrieve parent doc reference if an existing doc is being modified
    if (parentRef == null) {
      parentRef = doc.getParentRef();
    }

    DocumentModel parentDoc = ctx.getCoreSession().getDocument(parentRef);
    // searching for documents with same title in the parent folderish document
    StringBuilder sb = new StringBuilder("SELECT " + NXQL.ECM_UUID + " FROM FVWord WHERE ");
    sb.append("dc:title").append("=").append(NXQL.escapeString(title)).append(" AND ")
        .append(NXQL.ECM_PARENTID).append("=").append(NXQL.escapeString(parentDoc.getId()))
        .append(" AND ").append("fv-word:part_of_speech='" + partOfSpeech + "'");

    // If an existing word is being modified, exclude it from the results of the query
    if (doc.getId() != null) {
      sb.append(" AND ").append(NXQL.ECM_UUID).append("!=").append(NXQL.escapeString(doc.getId()));
    }

    IterableQueryResult result = ctx.getCoreSession().queryAndFetch(sb.toString(), NXQL.NXQL);
    long resultsCount = result.size();
    result.close();
    return (resultsCount == 0);
  }

  // Roll back the event and throw an exception containing a description of the validation error
  protected void generateValidationError(Event event, String message) {
    event.markBubbleException();
    event.markRollBack();
    throw new NuxeoException(ExceptionHelper.unwrapException(new RecoverableClientException(
        "Bubbling exception by " + FVDocumentValidationEventListener.class.getName(), message,
        null)));
  }

}
