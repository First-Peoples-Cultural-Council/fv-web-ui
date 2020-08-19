package ca.firstvoices.testUtil;

import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.testUtil.helpers.TestDataYAMLBean;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.inject.Inject;
import org.junit.Before;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Deploys;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.TargetExtensions;
import org.yaml.snakeyaml.TypeDescription;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

@Deploys({
    @Deploy("FirstVoicesNuxeoPublisher"),
    @Deploy("org.nuxeo.binary.metadata"),
    @Deploy("org.nuxeo.ecm.platform.url.core"),
    @Deploy("org.nuxeo.ecm.platform.types.api"),
    @Deploy("org.nuxeo.ecm.platform.types.core"),
    @Deploy("org.nuxeo.ecm.platform.webapp.types"),
    @Deploy("org.nuxeo.ecm.platform.publisher.core"),
    @Deploy("org.nuxeo.ecm.platform.video.core"),
    @Deploy("org.nuxeo.ecm.platform.picture.core"),
    @Deploy("FirstVoicesCoreTests"),
    @Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.listeners.xml"),
    @Deploy("FirstVoicesData:OSGI-INF/ca.firstvoices.operations.xml")
})


@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public abstract class AbstractTestDataCreatorTest {

  @Inject
  protected TestDataCreator dataCreator;

  @Inject
  private CoreSession session;

  @Before
  public void initData() throws IOException {
    this.dataCreator.reset();

    Class<? extends AbstractTestDataCreatorTest> clz = this.getClass();

    if (clz.isAnnotationPresent(TestDataConfiguration.class)) {
      TestDataConfiguration config = clz.getAnnotation(TestDataConfiguration.class);

      for (int i = 0; i < config.yaml().length; i++) {
        String res = config.yaml()[i];

        Optional<URL> resource = Optional.ofNullable(
            this.getClass().getClassLoader().getResource(res)
        );

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
                dataCreator.parseYamlDirectives(this.session, toCreate);

              } catch (IOException e) {
                e.printStackTrace();
              }

            }
        );
      }

    }

  }

}
