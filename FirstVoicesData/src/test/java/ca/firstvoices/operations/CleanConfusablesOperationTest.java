package ca.firstvoices.operations;

import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModelList;

/**
 * @author david
 */
public class CleanConfusablesOperationTest extends AbstractFirstVoicesDataTest {

  @Test
  public void callingOperationSetsPropertyOnAlphabet() throws OperationException {
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dialect);

    String[] orderedWords = {"aada gadaalee", "adoḵs", "agwii-gin̓am", "laahitkw", "lag̱am-bax̱",
        "la'oo'a'a"};

    String[] orderedPhrases = {"A bad excuse is better than none", "A bit", "A bit " +
        "more", "A bit of a...", "A couple of sth", "Ability Something", "Able bodied",
        "Better safe than " +
            "sorry", "Curiosity killed the cat", "Do not make a mountain out of a mole " + "hill",
        "Easy come, " +
            "easy go", "Fine feathers make fine birds", "Give credit where credit is due",
        "Home is where the " +
            "heart is", "If you play with fire, you will get burned",
        "Judge not, that ye be not judged", "Kill " +
        "two birds with one stone.", "Learn a language, and you will avoid a war",
        "Memory is the treasure of" +
            " the mind", "No man is an island", "Oil and water do not mix",
        "Penny, Penny. Makes many.", "Respect" +
        " is not given, it is earned.",
        "Sticks and stones may break my bones, but words will never hurt me."
        , "There is no smoke without fire.", "Use it or lose it", "Virtue is its own reward",
        "When it rains " +
            "it pours.", "You cannot teach an old dog new tricks",
        "Zeal without knowledge is fire without light."};

    createWordsorPhrases(orderedWords, "FVWord");
    createWordsorPhrases(orderedPhrases, "FVPhrase");

    automationService.run(ctx, CleanConfusablesOperation.ID);

    String wordQuery = "SELECT * FROM FVWord WHERE ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
    String phraseQuery = "SELECT * FROM FVPhrase WHERE ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";

    DocumentModelList words = session.query(wordQuery);
    DocumentModelList phrases = session.query(phraseQuery);

    words.forEach(word -> {
      Assert.assertEquals(true, word.getPropertyValue("update_confusables_required"));
    });

    phrases.forEach(phrase -> {
      Assert.assertEquals(true, phrase.getPropertyValue("update_confusables_required"));
    });

  }

}
