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

package ca.firstvoices.publisher.services;


import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_ALPHABET;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_AUDIO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_BOOK;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_BOOKS;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_BOOK_ENTRY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORIES;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CONTRIBUTOR;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CONTRIBUTORS;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_DICTIONARY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_GALLERY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_LINK;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_LINKS;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PICTURE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PORTAL;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_RESOURCES;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_VIDEO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;

import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.javers.core.Javers;
import org.javers.core.JaversBuilder;
import org.javers.core.diff.Diff;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.schema.DocumentType;
import org.nuxeo.runtime.api.Framework;

public class UnpublishedChangesServiceImpl implements UnpublishedChangesService {

  public boolean checkUnpublishedChanges(CoreSession session, DocumentModel document) {
    Diff diff = getUnpublishedChanges(session, document);

    if (diff == null) {
      return false;
    }

    return diff.hasChanges();
  }

  public Diff getUnpublishedChanges(CoreSession session, DocumentModel document) {
    FirstVoicesPublisherService service = Framework.getService(FirstVoicesPublisherService.class);

    // Check that the document is a specific type using the helper method
    if (!(checkType(document))) {
      return null;
    }

    // Check that the document and the document's dialect are currently published
    if (!StateUtils.isPublished(document) || !StateUtils
        .isPublished(DialectUtils.getDialect(document))) {
      return null;
    }

    /*
         A privileged session is used to get the workspaces doc
         ref and versions in case the
         service is being called from a place that does not have
         access to the workspaces document.
    */
    @SuppressWarnings("java:S1602")
    DocumentModel workspacesDoc = CoreInstance.doPrivileged(session, s -> {
      return s.getSourceDocument(document.getRef());
    });

    // Get the sections document and versions
    DocumentModel sectionsDoc = service.getPublication(session, workspacesDoc.getRef());

    // If the sections doc does not exist, return null
    // This may be in case the sections Doc is pending publication
    if (sectionsDoc == null) {
      return null;
    }

    return compareDocs(sectionsDoc, workspacesDoc);
  }

  // Note: This is unrelated to publisher - will diff any two objects.
  // Could potentially move to another package.
  public Diff getChanges(DocumentModel leftDocument,
      DocumentModel rightDocument) {
    // Check that the document is a specific type using the helper method
    if (!(checkType(leftDocument)) || !(checkType(rightDocument))) {
      return null;
    }

    return compareDocs(leftDocument, rightDocument);
  }

  private Diff compareDocs(DocumentModel leftDoc, DocumentModel rightDoc) {

    // Get all properties for all schemas (left doc)
    Map<String, Object> leftDocAllProps = getDiffProperties(leftDoc);

    // Get all relevant properties (right doc)
    Map<String, Object> rightDocAllProps = getDiffProperties(rightDoc);

    // Setup javers for diff
    Javers javers = JaversBuilder.javers().build();

    // Compare left doc and right doc
    return javers.compare(leftDocAllProps, rightDocAllProps);
  }

  // Helper method to get all relevant properties for the diff
  private HashMap<String, Object> getDiffProperties(DocumentModel doc) {

    // The following schemas shouldn't be considered in a diff (they are not user-controlled)
    String[] excludedSchemas = {"uid", "collectionMember", "common", "fvancestry", "fvproxy",
        "fvlegacy", "relatedtext", "facetedTag", "notification"};
    List<String> excludedSchemasList = Arrays.asList(excludedSchemas);

    // The follow properties shouldn't be considered in a diff (they are not user-controlled)
    String[] excludedProperties = {"dc:modified", "dc:created", "dc:contributors",
        "dc:lastContributor", "fv-alphabet:update_confusables_required",
        "fv:update_confusables_required", "fv-alphabet:custom_order_recompute_required",
        "fvcharacter:alphabet_order", "fv:custom_order"};
    List<String> excludedPropertiesList = Arrays.asList(excludedProperties);

    Map<String, Object> relevantProperties = new HashMap<>();

    for (String schema : doc.getSchemas()) {
      if (excludedSchemasList.contains(schema)) {
        continue;
      }

      relevantProperties.putAll(doc.getProperties(schema));
    }

    // Filter out excluded properties and process conversions
    return (HashMap<String, Object>) relevantProperties.entrySet().stream()
        .filter(e -> !excludedPropertiesList.contains(e.getKey())) // Filter out excluded properties
        .collect(Collectors.toMap(Entry::getKey, t -> convertDiffFields(t.getValue())));
  }

  // Helper method to convert certain types that are hard to compare
  // (e.g. String list) to comparable types
  private Object convertDiffFields(Object field) {
    if (field == null) {
      return "";
    }

    if (field instanceof String[]) {
      return Arrays.toString((String[]) field);
    }

    return field;
  }

  // Helper method to check that the new document is one of the types below
  private boolean checkType(DocumentModel inputDoc) {
    DocumentType currentType = inputDoc.getDocumentType();

    String[] types = {FV_ALPHABET, FV_AUDIO, FV_BOOK, FV_BOOK_ENTRY, FV_BOOKS, FV_CATEGORIES,
        FV_CATEGORY, FV_CHARACTER, FV_CONTRIBUTOR, FV_CONTRIBUTORS, FV_DIALECT, FV_DICTIONARY,
        FV_GALLERY, FV_LANGUAGE, FV_LANGUAGE_FAMILY, FV_LINK, FV_LINKS, FV_PHRASE, FV_PICTURE,
        FV_PORTAL, FV_RESOURCES, FV_VIDEO, FV_WORD};

    return Arrays.stream(types).parallel().anyMatch(currentType.toString()::contains);
  }

}
