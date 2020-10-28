package ca.firstvoices.testUtil;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import ca.firstvoices.testUtil.helpers.TestDataYAMLBean;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.inject.Singleton;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.PropertyException;
import org.nuxeo.runtime.transaction.TransactionHelper;
import org.yaml.snakeyaml.TypeDescription;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

@Singleton
public class TestDataCreator {

  Map<String, String> savedReferences = new HashMap<>();

  public void reset() {
    savedReferences.clear();
  }

  public String getReference(String key) {
    return savedReferences.get(key);
  }

  public DocumentModel getReference(CoreSession session, String key) {
    return session.getDocument(new IdRef(savedReferences.get(key)));
  }

  public void addYaml(CoreSession session, String res) {

    Optional<URL> resource = Optional.ofNullable(this.getClass().getClassLoader().getResource(res));

    resource.ifPresent(r -> {
      try {
        InputStream is = r.openStream();
        Constructor cons = new Constructor(TestDataYAMLBean.class);
        TypeDescription td = new TypeDescription(TestDataYAMLBean.class);
        td.putMapPropertyType("properties", String.class, String.class);
        cons.addTypeDescription(td);
        Yaml yaml = new Yaml(cons);

        Iterable<Object> all = yaml.loadAll(is);
        List<TestDataYAMLBean> toCreate = new ArrayList<>();
        all.forEach(o -> {
          toCreate.add((TestDataYAMLBean) o);
        });
        parseYamlDirectives(session, toCreate);

      } catch (IOException e) {
        e.printStackTrace();
      }

    });
  }

  public void parseYamlDirectives(CoreSession session, List<TestDataYAMLBean> inputs) {
    if (TransactionHelper.isNoTransaction()) {
      TransactionHelper.startTransaction();
    }

    List<TestDataYAMLBean> mapped =
        inputs.stream().flatMap(TestDataYAMLBean::flatten).collect(Collectors.toList());

    mapped.stream().forEach(input -> {
      DocumentModel document = session.createDocument(session.createDocumentModel(input.getPath(),
          input.getName(),
          input.getType()));


      try {
        document.setPropertyValue("dc:title", input.getName());
        document.setPropertyValue("dc:created", new Date());
        document.setPropertyValue("dc:modified", new Date());
      } catch (PropertyException e) {
        System.err.println("schema " + document.getType() + " does not have dublincore properties");
      }

      input.getProperties().forEach(document::setPropertyValue);

      session.saveDocument(document);

      String savedID = document.getId();
      if (input.isPublish()) {
        document.followTransition(PUBLISH_TRANSITION);
        try {
          DocumentModel section = session.getDocument(new PathRef(input.getPublishPath()));
          DocumentModel proxy = session.publishDocument(document, section, true);
          savedReferences.put(input.getKey() + "_proxy", proxy.getId());
        } catch (Exception e) {
          //some document types are not recursively published (eg. FVDictionary)
        }
      }
      session.save();
      if (input.getKey() != null) {
        savedReferences.put(input.getKey(), savedID);
      }
    });
    TransactionHelper.commitOrRollbackTransaction();
  }

}


