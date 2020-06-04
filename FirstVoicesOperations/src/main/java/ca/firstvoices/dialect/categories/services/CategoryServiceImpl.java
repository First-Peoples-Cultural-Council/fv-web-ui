package ca.firstvoices.dialect.categories.services;

import ca.firstvoices.dialect.categories.exceptions.InvalidCategoryException;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.util.Map;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.runtime.api.Framework;
import services.AbstractFirstVoicesOperationsService;

/**
 * @author david
 */
public class CategoryServiceImpl extends AbstractFirstVoicesOperationsService implements
    CategoryService {

  private FirstVoicesPublisherService publisherService;

  @Override
  public DocumentModel updateCategory(DocumentModel doc, Map<String, String> properties) {
    publisherService = Framework.getService(FirstVoicesPublisherService.class);

    CoreSession session = doc.getCoreSession();

    if (!doc.getType().equals("FVCategory")) {
      throw new InvalidCategoryException("Document type must be FVCategory.");
    }

    if (properties.size() == 0) {
      return doc;
    }

    for (Map.Entry<String, String> entry : properties.entrySet()) {
      String key = entry.getKey();
      String value = entry.getValue();

      if (key.equals("ecm:parentRef")) {
        doc = updateParent(doc, session, value);
      } else {
        doc.setPropertyValue(key, value);
      }
    }

    session.saveDocument(doc);

    return publisherService.publishDocumentIfDialectPublished(session, doc);
  }

  private DocumentModel updateParent(DocumentModel categoryDoc, CoreSession session,
      String newParentId) {

    // If the value of parentRef key is "/Categories" that means it does not have a parent
    // category. This is to handle the case that an id is not passed in from FE, but
    // instead is passed in as "/Categories"
    if (newParentId.contains("/Categories")) {
      newParentId = session.getDocument(new PathRef(newParentId)).getId();
    }

    DocumentModel originalParent = session.getDocument(categoryDoc.getParentRef());

    if (newParentId.equals(originalParent.getId())) {
      return categoryDoc;
    }

    // we edited the document and we need to save changes before moving it
    if (categoryDoc.isDirty()) {
      session.saveDocument(categoryDoc);
    }

    DocumentModel newParentDoc = session.getDocument(new IdRef(newParentId));

    if (newParentDoc == null) {
      throw new InvalidCategoryException("Parent category with ref " + newParentId + " not found");
    }

    // Throw error if the doc being moved is a parent doc
    boolean hasChildren = session.getChildren(categoryDoc.getRef()).stream()
        .anyMatch(child -> !child.isTrashed());

    if (hasChildren) {
      throw new InvalidCategoryException(
          "A parent category cannot be a child of another parent category.");
    }

    // If the document is published, move the sections doc
    if (isPublished(categoryDoc)) {
      DocumentModel categorySectionDoc = publisherService
          .getPublication(session, categoryDoc.getRef());

      if (!isPublished(newParentDoc)) {
        publisherService.publishDocumentIfDialectPublished(session, newParentDoc);
      }

      DocumentModel newParentSectionDoc = publisherService
          .getPublication(session, newParentDoc.getRef());

      session.move(categorySectionDoc.getRef(), newParentSectionDoc.getRef(),
          categorySectionDoc.getPropertyValue("dc:title").toString());

    }

    // Move workspace doc
    return session.move(categoryDoc.getRef(), newParentDoc.getRef(),
        categoryDoc.getPropertyValue("dc:title").toString());
  }
}
