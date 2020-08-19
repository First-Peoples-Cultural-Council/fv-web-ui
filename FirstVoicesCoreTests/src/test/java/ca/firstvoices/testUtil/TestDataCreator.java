package ca.firstvoices.testUtil;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.testUtil.helpers.TestDataYAMLBean;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.inject.Inject;
import javax.inject.Singleton;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.PropertyException;
import org.nuxeo.runtime.transaction.TransactionHelper;

@Singleton
public class TestDataCreator {

  @Inject
  FirstVoicesPublisherService publisherService;

  Map<String, String> savedReferences = new HashMap<>();

  public void reset() {
    savedReferences.clear();
  }

  public String getReference(String key) {
    return savedReferences.get(key);
  }

  public void parseYamlDirectives(CoreSession session, List<TestDataYAMLBean> inputs) {
    if (TransactionHelper.isNoTransaction()) {
      TransactionHelper.startTransaction();
    }

    List<TestDataYAMLBean> mapped = inputs.stream().flatMap(TestDataYAMLBean::flatten)
        .collect(Collectors.toList());

    mapped.stream().forEach(input -> {
      DocumentModel document = session.createDocument(
          session.createDocumentModel(input.getPath(), input.getName(), input.getType())
      );


      try {
        document.setPropertyValue("dc:created", new Date());
        document.setPropertyValue("dc:modified", new Date());
      } catch (PropertyException e) {
        System.err.println("schema " + document.getType() + " does not have dublincore properties");
      }

      input.getProperties().forEach(document::setPropertyValue);

      session.saveDocument(document);

      String savedID = document.getId();
      if (input.isPublish()) {
        DocumentModel section = session.getDocument(new PathRef(input.getPublishPath()));
        DocumentModel published = publisherService.publishDocument(session, document, section);
        savedID = published.getId();
      }
      session.save();
      if (input.getKey() != null) {
        savedReferences.put(input.getKey(), savedID);
      }
    });
    TransactionHelper.commitOrRollbackTransaction();
  }

}


