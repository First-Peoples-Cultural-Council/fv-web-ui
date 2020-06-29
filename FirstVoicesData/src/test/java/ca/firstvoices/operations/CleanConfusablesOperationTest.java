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

package ca.firstvoices.operations;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import java.time.Duration;
import java.util.List;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.blob.JSONBlob;
import org.nuxeo.ecm.core.bulk.BulkService;
import org.nuxeo.ecm.core.bulk.message.BulkStatus;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.TransactionalFeature;

/**
 * @author david
 */
public class CleanConfusablesOperationTest extends AbstractFirstVoicesDataTest {

  @Test
  public void callingOperationSetsPropertyOnAlphabet()
      throws OperationException, InterruptedException {
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dialect);

    String[] orderedWords = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a"};

    String[] orderedPhrases = {"A bad excuse is better than none", "A bit", "A bit " + "more",
        "A bit of a...", "A couple of sth", "Ability Something", "Able bodied",
        "Better safe than " + "sorry", "Curiosity killed the cat",
        "Do not make a mountain out of a mole " + "hill", "Easy come, " + "easy go",
        "Fine feathers make fine birds", "Give credit where credit is due",
        "Home is where the " + "heart is", "If you play with fire, you will get burned",
        "Judge not, that ye be not judged", "Kill " + "two birds with one stone.",
        "Learn a language, and you will avoid a war", "Memory is the treasure of" + " the mind",
        "No man is an island", "Oil and water do not mix", "Penny, Penny. Makes many.",
        "Respect" + " is not given, it is earned.",
        "Sticks and stones may break my bones, but wordsAndPhrases will never hurt me.",
        "There is no smoke without fire.", "Use it or lose it", "Virtue is its own reward",
        "When it rains " + "it pours.", "You cannot teach an old dog new tricks",
        "Zeal without knowledge is fire without light."};

    createWordsorPhrases(orderedWords, FV_WORD);
    createWordsorPhrases(orderedPhrases, FV_PHRASE);

    JSONBlob blob = (JSONBlob) automationService.run(ctx, CleanConfusablesOperation.ID);

    Assert.assertNotNull(blob);
    String id = blob.getString();

    BulkService bulkService = Framework.getService(BulkService.class);
    bulkService.await(id, Duration.ofMinutes(1));
    String status = bulkService.getStatus(id).getState().toString();

    Assert.assertEquals("COMPLETED", status);
    assertTrue((bulkService.getStatus(id).getErrorCount() == 0));

  }

  @Test
  public void cleanConfusablesChangesValues() throws OperationException, InterruptedException {
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dialect);
    TransactionalFeature txFeature = new TransactionalFeature();
    String username = session.getPrincipal().getName();

    String[] orderedWords = {"Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"};
    String[] orderedPhrases = {"A way out", "Brandishing a weapon", "Come on lets go",
        "The quick brown fox jumps over the lazy dog"};

    createWordsorPhrases(orderedWords, FV_WORD);
    createWordsorPhrases(orderedPhrases, FV_PHRASE);
    txFeature.nextTransaction();

    BulkService bulkService = Framework.getService(BulkService.class);
    int oldSize = bulkService.getStatuses(username).size();

    JSONBlob blob = (JSONBlob) automationService.run(ctx, CleanConfusablesOperation.ID);
    Assert.assertNotNull(blob);
    String id = blob.getString();

    bulkService.await(id, Duration.ofMinutes(1));
    String status = bulkService.getStatus(id).getState().toString();
    Assert.assertEquals("COMPLETED", status);

    List<BulkStatus> statuses = bulkService.getStatuses(username);
    int newSize = statuses.size();
    assertEquals(1, (newSize - oldSize));
    assertEquals(id, statuses.get(newSize - 1).getId());

    DocumentModelList wordsAndPhrases = session.query(bulkService.getCommand(id).getQuery());

    for (DocumentModel x : wordsAndPhrases) {
      assertEquals(true, x.getPropertyValue("update_confusables_required"));
    }

  }

}
