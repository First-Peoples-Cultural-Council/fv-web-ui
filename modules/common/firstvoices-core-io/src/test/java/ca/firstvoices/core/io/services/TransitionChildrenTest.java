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

package ca.firstvoices.core.io.services;

import static ca.firstvoices.data.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REVERT_TO_NEW;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_DICTIONARY_NAME;
import static org.junit.Assert.assertEquals;

import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import ca.firstvoices.tests.mocks.services.MockDialectService;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.CLASS)
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-workspace.yaml"})
@Deploy({"FirstVoicesCoreIO:OSGI-INF/services/transitionChildrenState-contrib.xml"})
public class TransitionChildrenTest extends AbstractTestDataCreatorTest {

  @Inject
  CoreSession session;

  @Inject
  MockDialectService mockDialectService;

  DocumentModel dialect = null;

  DocumentModel dictionary = null;

  DocumentModelList words = null;

  @Before
  public void initTest() {
    session.save();

    dialect = dataCreator.getReference(session, "testDialect");
    dictionary = session.getChild(dialect.getRef(), FV_DICTIONARY_NAME);

    words = mockDialectService.generateFVWords(
        session, dialect.getPathAsString(), new String[]{"NewWord1", "NewWord2", "NewWord3"}, null);
  }

  @Test
  public void transitionChildren() {
    TransitionChildrenStateService transitionChildrenService = Framework
        .getService(TransitionChildrenStateService.class);

    // Transition all children of dictionary to ENABLED state
    transitionChildrenService.transitionChildren(ENABLE_TRANSITION, null, dictionary);

    DocumentModelList docs = session.query(
        String.format(
            "SELECT * FROM Document WHERE ecm:ancestorId = '%s' "
                + "AND ecm:isVersion = 0 AND ecm:isProxy = 0 "
                + "AND ecm:currentLifeCycleState LIKE '%s'", dialect.getId(), ENABLED_STATE));

    // All words should be in the Enabled state
    assertEquals(3, docs.totalSize());

    // Revert one word to New, and Disable one word
    words.get(0).followTransition(DISABLE_TRANSITION);
    words.get(1).followTransition(REVERT_TO_NEW);

    session.save();

    // Transition only Enabled children of dictionary to PUBLISHED state
    transitionChildrenService.transitionChildren(PUBLISH_TRANSITION, ENABLED_STATE, dictionary);

    docs = session.query(
        String.format(
            "SELECT * FROM Document WHERE ecm:ancestorId = '%s' "
                + "AND ecm:isVersion = 0 AND ecm:isProxy = 0 "
                + "AND ecm:currentLifeCycleState LIKE '%s'", dialect.getId(), PUBLISHED_STATE));

    // ONLY 1 word should be in the PUBLISHED state
    assertEquals(1, docs.totalSize());
  }
}
