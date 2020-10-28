package ca.firstvoices.characters.operations;/*
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

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyInt;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.services.CleanupCharactersService;
import ca.firstvoices.core.io.utils.PropertyUtils;
import ca.firstvoices.maintenance.common.CommonConstants;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import ca.firstvoices.testUtil.FirstVoicesDataFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.mockito.MockitoFeature;
import org.nuxeo.runtime.mockito.RuntimeService;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class, AutomationFeature.class, FirstVoicesDataFeature.class,
    MockitoFeature.class})
@Deploy({"org.nuxeo.ecm.platform.types.core",
    "FirstVoicesCharacters:OSGI-INF/ca.firstvoices.operations.xml",
    "org.nuxeo.ecm.platform.publisher.core", "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting", "FirstVoicesData",
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml", "FirstVoicesMaintenance",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml"})
@RepositoryConfig(cleanup = Granularity.METHOD, init = DefaultRepositoryInit.class)
public class OperationsTests extends AbstractFirstVoicesDataTest {

  @Mock @RuntimeService CleanupCharactersService cleanupCharactersService;

  Map<String, Object> defaultInitParams = new HashMap<>();
  LinkedHashMap<String, String> operations = new LinkedHashMap<>();

  public OperationsTests() {
    defaultInitParams.put("phase", "init");
    defaultInitParams.put("batchSize", 2);

    operations.put(Constants.CLEAN_CONFUSABLES_ACTION_ID, Constants.CLEAN_CONFUSABLES_JOB_ID);
    operations.put(Constants.COMPUTE_ORDER_ACTION_ID, Constants.COMPUTE_ORDER_JOB_ID);
    operations.put(Constants.ADD_CONFUSABLES_ACTION_ID, Constants.ADD_CONFUSABLES_JOB_ID);
  }

  @Test
  public void testOperationsInitPhase() throws RuntimeException {
    operations.forEach((k, v) -> {
      try {
        // Call operation
        OperationContext ctx = new OperationContext(session);
        ctx.putChainParameters(defaultInitParams);
        ctx.setInput(dialect);
        automationService.run(ctx, k);

        // Get confirmation operation was successful
        DocumentModel newDoc = session.getDocument(dialect.getRef());

        List<String> requiredJobs =
            PropertyUtils.getValuesAsList(newDoc, CommonConstants.REQUIRED_JOBS_FULL_FIELD);

        assertTrue("Required jobs contains " + v, requiredJobs.contains(v));
      } catch (OperationException e) {
        throw new RuntimeException(e);
      }
    });
  }

  @Test
  public void testCleanConfusablesIgnoredIfAddConfusablesPresent() throws OperationException {

    // Set AddConfusable operation to job
    dialect.setPropertyValue(CommonConstants.REQUIRED_JOBS_FULL_FIELD,
        new String[]{Constants.ADD_CONFUSABLES_JOB_ID});

    // Call Alphabet.CleanConfusables operation
    OperationContext ctx = new OperationContext(session);
    ctx.putChainParameters(defaultInitParams);
    ctx.setInput(dialect);
    automationService.run(ctx, Constants.CLEAN_CONFUSABLES_ACTION_ID);

    // Get confirmation clean confusables WAS NOT added
    DocumentModel newDoc = session.getDocument(dialect.getRef());

    List<String> requiredJobs =
        PropertyUtils.getValuesAsList(newDoc, CommonConstants.REQUIRED_JOBS_FULL_FIELD);

    assertFalse("Required jobs does not contain " + Constants.CLEAN_CONFUSABLES_JOB_ID,
        requiredJobs.contains(Constants.CLEAN_CONFUSABLES_JOB_ID));


  }

  @Test
  public void testConfusableStatus() throws OperationException, IOException {
    List<String> chars = Arrays.asList("&", "^");

    // Mock data to return two confusables
    Mockito.when(cleanupCharactersService.getAllConfusables(dialect)).thenReturn(chars);

    // Mock data to return 1 words that has "&"
    Mockito
        .when(cleanupCharactersService.getAllWordsPhrasesForConfusable(any(),
            anyString(),
            eq(chars.get(0)),
            anyInt()))
        .thenAnswer(method -> {
          DocumentModelList docs = new DocumentModelListImpl();
          docs.add(session.createDocumentModel("/", "doc_with_&_in_name", FV_WORD));
          return docs;
        });

    // Mock data to return 0 words that have "^"
    Mockito
        .when(cleanupCharactersService.getAllWordsPhrasesForConfusable(any(),
            anyString(),
            eq(chars.get(1)),
            anyInt()))
        .thenAnswer(method -> new DocumentModelListImpl());

    // Call operation and get response
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dialect);

    StringBlob response =
        (StringBlob) automationService.run(ctx, Constants.CONFUSABLES_STATUS_ACTION_ID);

    ObjectMapper mapper = new ObjectMapper();
    @SuppressWarnings("unchecked") Map<String, Object> jsonMap =
        mapper.readValue(response.getStream(), Map.class);

    assertEquals(1, ((LinkedHashMap<?, ?>) jsonMap.get(chars.get(0))).get("Words/Phrases"));
    assertEquals(0, ((LinkedHashMap<?, ?>) jsonMap.get(chars.get(1))).get("Words/Phrases"));
  }
}
