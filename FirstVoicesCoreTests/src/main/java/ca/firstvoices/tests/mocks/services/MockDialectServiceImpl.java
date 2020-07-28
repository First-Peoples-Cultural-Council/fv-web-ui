package ca.firstvoices.tests.mocks.services;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_ALPHABET;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;

import java.util.StringJoiner;
import java.util.concurrent.ThreadLocalRandom;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;

public class MockDialectServiceImpl implements MockDialectService {


  private static final String[] alphabetChars = new String[]{
      //Regular alphabet
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
      "t", "u", "v", "w", "x", "y", "z"};
  private static final String[] multiChars = new String[]{
      //Double and triple characters (Nisga'a)
      "aa", "ee", "ii", "oo", "uu", "yy", "gw", "hl", "k'", "ḵ'", "kw", "kw'", "p'", "t'", "tl'",
      "ts'", "xw"};
  private static final String[] maskChars = new String[]{
      //Maskwacis Cree alphabet
      "ᐊ", "ᐁ", "ᐃ", "ᐅ", "ᐧ", "ᐤ", "ᐸ", "ᐯ", "ᐱ", "ᐳ",
      "ᑊ", "ᐦ", "ᑕ", "ᑌ", "ᑎ", "ᑐ", "ᐟ", "ᑲ", "ᑫ", "ᑭ", "ᑯ", "ᐠ", "ᒐ", "ᒉ", "ᒋ", "ᒍ", "ᐨ", "ᒪ", "ᒣ",
      "ᒥ", "ᒧ", "ᒼ", "ᓇ", "ᓀ", "ᓂ", "ᓄ", "ᐣ", "ᓴ", "ᓭ", "ᓯ", "ᓱ", "ᐢ", "ᔭ", "ᔦ", "ᔨ", "ᔪ", "ᐩ",};
  private static final String[] uniChars = new String[]{
      //Common Unicode characters from confusable_characters.csv
      "ƛ", "¢", "À", "Á", "È", "É", "Ì", "Í", "Î", "Ï", "Ñ", "Ò", "Ó",
      "Ô", "Ö", "Ù", "Ú", "Û", "Ü", "à", "á", "â", "ä", "æ", "è", "é", "ê", "ë", "ì", "í", "î",
      "ï", "ñ", "ò", "ó", "ô", "ö", "ù", "ú", "û", "ü", "ÿ", "Ā", "ā", "Ą", "ą", "Ć", "ĉ", "Č",
      "č", "ē", "Ę", "ę", "ě", "ĝ", "ĥ", "Ĩ", "ĩ", "ī", "Į", "į", "Ĵ", "ĵ", "ĺ", "ľ", "Ł", "ł",
      "ŋ", "Ō", "ō", "œ", "Ś", "ś", "Ŝ", "ŝ", "Š", "š", "Ū", "ū", "Ų", "ų", "Ŵ", "ŵ", "Ÿ", "Ɣ",
      "ƛ", "Ɵ", "ǂ", "ǎ", "Ǐ", "ǐ", "Ǒ", "ǒ", "Ǔ", "ǔ", "ǧ", "ǫ", "Ǭ", "ǭ", "ǰ", "ǳ", "Ⱥ", "Ȼ",
      "ɔ", "ə", "ɬ", "ʔ", "ʦ", "θ", "λ", "ᒼ", "ᕀ", "Ḏ", "ḏ", "ḕ", "ḗ", "ḡ", "ḥ", "Ḵ", "ḵ", "ḷ",
      "Ṉ", "ṉ", "Ṑ", "ṑ", "Ṓ", "ṓ", "Ṣ", "ṣ", "Ṯ", "ṯ", "Ẅ", "ẅ", "Ẑ", "ẑ", "Ẕ", "ẕ", "ị",};

  private static String[] currentAlphabet;

  private static int alphabetCount = ThreadLocalRandom.current().nextInt(0, alphabetChars.length);
  private static int multiCount = ThreadLocalRandom.current().nextInt(0, multiChars.length);
  private static int maskCount = ThreadLocalRandom.current().nextInt(0, maskChars.length);
  private static int uniCount = ThreadLocalRandom.current().nextInt(0, uniChars.length);


  private static void generateRandomAlphabet() {

    String[] alphabetArr = new String[30];
    for (int i = 0; i < 10; i++) {
      //Counter variables are a quick fix for alphabets containing two of the same character
      alphabetArr[i] = alphabetChars[alphabetCount];
      alphabetCount += 1;
      if (alphabetCount >= alphabetChars.length) {
        alphabetCount = 0;
      }
    }

    for (int i = 10; i < 20; i++) {
      alphabetArr[i] = multiChars[multiCount];
      multiCount += 1;
      if (multiCount >= multiChars.length) {
        multiCount = 0;
      }
    }

    for (int i = 20; i < 25; i++) {
      alphabetArr[i] = maskChars[maskCount];
      maskCount += 1;
      if (maskCount >= maskChars.length) {
        maskCount = 0;
      }
    }

    for (int i = 25; i < alphabetArr.length; i++) {
      alphabetArr[i] = uniChars[uniCount];
      uniCount += 1;
      if (uniCount >= uniChars.length) {
        uniCount = 0;
      }
    }

    currentAlphabet = alphabetArr;
  }

  private DocumentModelList generateFVCharacters(CoreSession session, String path,
      String[] alphabet) {
    DocumentModelList fvAlphabet = new DocumentModelListImpl();

    for (int i = 0; i < alphabet.length; i++) {
      DocumentModel letterDoc = session
          .createDocumentModel(path + "/Alphabet", alphabet[i], FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
      letterDoc.setPropertyValue("fvcharacter:upper_case_character", alphabet[i].toUpperCase());
      createDocument(session, letterDoc);
      fvAlphabet.add(letterDoc);

    }
    return fvAlphabet;
  }

  @Override
  public DocumentModel generateMockRandomDialect(CoreSession session, int maxEntries) {
    generateRandomAlphabet();
    String name = generateRandomWord(currentAlphabet);
    StringJoiner join = new StringJoiner(" ");
    for (int i = 0; i < 30; i++) {
      join.add(generateRandomWord(currentAlphabet) + " ");
    }
    String desc = join.toString();

    DocumentModel dialect = generateEmptyDialect(session, name, desc);

    generateFVCharacters(session, dialect.getPathAsString(), currentAlphabet);
    return dialect;

  }

  @Override
  public DocumentModel generateMockDemoDialect(CoreSession session, int maxEntries, String name) {
    String desc = "This is a generated test dialect for demo and cypress test purposes.";
    DocumentModel dialect = generateEmptyDialect(session, name, desc);

    generateFVCharacters(session, dialect.getPathAsString(), alphabetChars);

    return dialect;

  }

  @Override
  public void removeMockDialect(CoreSession session, PathRef path) {
    session.removeDocument(path);

  }

  @Override
  public void removeMockDialects(CoreSession session) {
    PathRef a = new PathRef("/FV/Workspaces/Data/Test/Test");
    PathRef b = new PathRef("/FV/Workspaces/Data/Test");
    session.removeDocument(a);
    session.removeDocument(b);
  }


  private DocumentModel createDocument(CoreSession session, DocumentModel model) {
    model.setPropertyValue("dc:title", model.getName());
    DocumentModel newDoc = session.createDocument(model);
    session.save();

    return newDoc;
  }

  private DocumentModel createDocument(CoreSession session, DocumentModel model, String desc) {
    model.setPropertyValue("dc:title", model.getName());
    model.setPropertyValue("dc:description", desc);
    DocumentModel newDoc = session.createDocument(model);
    session.save();

    return newDoc;
  }


  private void generateDomainTree(CoreSession session) {

    String testPath = "/FV/Workspaces/Data/Test/Test/";
    //if path exists, do nothing
    if (!session.exists(new PathRef(testPath))) {

      if (session.exists(new PathRef("FV/Workspaces/Data/"))) {
        createDocument(session,
            session
                .createDocumentModel("/FV/Workspaces/Data", "Test", FV_LANGUAGE_FAMILY));
        createDocument(session,
            session.createDocumentModel("/FV/Workspaces/Data/Test", "Test",
                FV_LANGUAGE));
      } else {
        throw new NuxeoException("Document tree FV/Workspaces/Data/ must exist");
      }

    }

  }

  private DocumentModel generateEmptyDialect(CoreSession session, String name, String desc) {
    //In the current session, in the /FV/Workspaces/Data/Test/Test/ directory
    //create an empty dialect with all necessary generated children

    generateDomainTree(session);

    DocumentModel dialect = createDocument(session,
        session
            .createDocumentModel("/FV/Workspaces/Data/Test/Test/", name, FV_DIALECT), desc);

    createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Alphabet", FV_ALPHABET));

    return dialect;

  }

  private String generateRandomWord(String[] alphabet) {

    StringBuilder bld = new StringBuilder();
    for (int i = 0; i < ThreadLocalRandom.current().nextInt(1, 13); i++) {
      bld.append(alphabet[ThreadLocalRandom.current().nextInt(0, alphabet.length)]);
    }

    return bld.toString();
  }

}
