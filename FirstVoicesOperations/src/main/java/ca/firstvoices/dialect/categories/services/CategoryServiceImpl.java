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

  @Override
  public DocumentModel updateCategory(DocumentModel doc, Map<String, String> properties) {
    CoreSession session = doc.getCoreSession();

    if (!doc.getType().equals("FVCategory")) {
      throw new InvalidCategoryException("Document type must be FVCategory.");
    }

    if (properties.size() > 0) {
      for (Map.Entry<String, String> entry : properties.entrySet()) {
        String key = entry.getKey();
        String value = entry.getValue();

        // Key passed in from Frontend to move category to a new parent (ecm:parentRef)
        // Typically an id of a category
        if (key.equals("ecm:parentRef")) {
          // If the vlaue of parentRef key is "/Categories" that means it does not have a parent
          // category. This is to handle the case that an id is not passed in from FE, but
          // instead is passed in as "/Categories"
          if (value.contains("/Categories")) {
            value = session.getDocument(new PathRef(value)).getId();
          }

          DocumentModel parent = session.getDocument(doc.getParentRef());

          if (!value.equals(parent.getId())) {
            // Throw error if the doc being moved is a parent doc
            Boolean hasChildren = session.getChildren(doc.getRef()).stream()
                .anyMatch(child -> !child.isTrashed());

            if (hasChildren) {
              throw new InvalidCategoryException(
                  "A parent category cannot be a child of another parent category.");
            }

            doc = session
                .move(doc.getRef(), new IdRef(value), doc.getPropertyValue("dc:title").toString());
          }

        } else {
          doc.setPropertyValue(key, value);
        }
      }
    }
    session.saveDocument(doc);

    FirstVoicesPublisherService publisherService = Framework
        .getService(FirstVoicesPublisherService.class);

    return publisherService.publishDocumentIfDialectPublished(session, doc);
  }

}
