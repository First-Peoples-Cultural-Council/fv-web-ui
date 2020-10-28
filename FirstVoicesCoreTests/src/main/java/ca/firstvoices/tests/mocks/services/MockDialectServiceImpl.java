package ca.firstvoices.tests.mocks.services;

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_ALPHABET;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORIES;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CATEGORY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_CHARACTER;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_DICTIONARY;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
  private static String[] currentWords;

  private static int alphabetCount = ThreadLocalRandom.current().nextInt(0, alphabetChars.length);
  private static int multiCount = ThreadLocalRandom.current().nextInt(0, multiChars.length);
  private static int maskCount = ThreadLocalRandom.current().nextInt(0, maskChars.length);
  private static int uniCount = ThreadLocalRandom.current().nextInt(0, uniChars.length);

  private static void generateRandomAlphabet() {

    Set<String> alphabetSet = new HashSet<>();

    while (alphabetSet.size() < 10) {
      String toAdd = alphabetChars[alphabetCount];
      if (setDoesNotContain(alphabetSet, toAdd)) {
        alphabetSet.add(toAdd);
      }
      alphabetCount += 1;
      if (alphabetCount >= alphabetChars.length) {
        alphabetCount = 0;
      }
    }

    while (alphabetSet.size() < 15) {
      String toAdd = multiChars[multiCount];
      if (setDoesNotContain(alphabetSet, toAdd)) {
        alphabetSet.add(toAdd);
      }
      multiCount += 1;
      if (multiCount >= multiChars.length) {
        multiCount = 0;
      }
    }

    while (alphabetSet.size() < 20) {
      String toAdd = maskChars[maskCount];
      if (setDoesNotContain(alphabetSet, toAdd)) {
        alphabetSet.add(toAdd);
      }
      maskCount += 1;
      if (maskCount >= maskChars.length) {
        maskCount = 0;
      }
    }

    while (alphabetSet.size() < 30) {
      String toAdd = uniChars[uniCount];
      if (setDoesNotContain(alphabetSet, toAdd)) {
        alphabetSet.add(toAdd);
      }
      uniCount += 1;
      if (uniCount >= uniChars.length) {
        uniCount = 0;
      }
    }

    List<String> alphabetList = new ArrayList<>(alphabetSet);
    Collections.shuffle(alphabetList);

    currentAlphabet = alphabetList.toArray(alphabetList.toArray(new String[0]));
  }

  private static void setDemoAlphabet(String[] alphabet) {
    currentAlphabet = alphabet;
  }

  private static boolean setDoesNotContain(Set<String> set, String toAdd) {
    return !set.contains(toAdd) && !set.contains(toAdd.toUpperCase());
  }

  private static String generateRandomWord(String[] alphabet) {

    StringBuilder bld = new StringBuilder();
    for (int i = 0; i < ThreadLocalRandom.current().nextInt(1, 13); i++) {
      bld.append(alphabet[ThreadLocalRandom.current().nextInt(0, alphabet.length)]);
    }

    return bld.toString();
  }

  private static void generateWordArr(int wordEntries) {
    List<String> wordList = new ArrayList<>();

    for (int i = 0; i < wordEntries; i++) {
      wordList.add(generateRandomWord(currentAlphabet));
    }

    //have at least 1 word starting with each letter
    if (wordEntries >= currentAlphabet.length) {
      for (int i = 0; i < currentAlphabet.length; i++) {
        wordList.set(i, currentAlphabet[i] + wordList.get(i).substring(1));
      }
    }
    Collections.shuffle(wordList);

    currentWords = wordList.toArray(wordList.toArray(new String[0]));
  }

  @Override
  public DocumentModel generateMockDemoDialect(CoreSession session, int maxEntries, String name) {
    String desc = "This is a generated test dialect for demo and cypress test purposes.";
    final String[] words = {"Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf",
        "Hotel",
        "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec",
        "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-Ray", "Yankee", "Zulu"};

    DocumentModel dialect = generateEmptyDialect(session, name, desc);

    setDemoAlphabet(alphabetChars);
    generateFVCharacters(session, dialect.getPathAsString(), alphabetChars);
    DocumentModelList categories = generateFVCategories(session, dialect.getPathAsString());
    DocumentModelList phraseBooks = generateFVPhraseBooks(session, dialect.getPathAsString());
    generateFVWords(session, dialect.getPathAsString(), words, categories);
    generateFVPhrases(session, dialect.getPathAsString(), maxEntries / 2, words, phraseBooks);

    return dialect;

  }

  @Override
  public DocumentModel generateMockRandomDialect(CoreSession session, int maxEntries) {
    int wordEntries;
    int phraseEntries;
    //Split max entries 50/50 for words and phrases
    if (maxEntries % 2 == 0) {
      wordEntries = maxEntries / 2;
    } else {
      wordEntries = maxEntries / 2 + 1;
    }
    phraseEntries = maxEntries / 2;

    generateRandomAlphabet();
    generateWordArr(wordEntries);
    String name = generateRandomWord(currentAlphabet);
    String desc = generateRandomPhrase(30, currentWords);

    DocumentModel dialect = generateEmptyDialect(session, name, desc);

    generateFVCharacters(session, dialect.getPathAsString(), currentAlphabet);
    DocumentModelList categories = generateFVCategories(session, dialect.getPathAsString());
    DocumentModelList phraseBooks = generateFVPhraseBooks(session, dialect.getPathAsString());
    generateFVPhrases(session, dialect.getPathAsString(), phraseEntries, currentWords, phraseBooks);
    generateFVWords(session, dialect.getPathAsString(), currentWords, categories);

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
    createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Dictionary", FV_DICTIONARY));
    createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Categories", FV_CATEGORIES));
    createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Phrase Books", FV_CATEGORIES));

    return dialect;
  }

  private DocumentModelList generateFVCharacters(CoreSession session, String path,
      String[] alphabet) {
    DocumentModelList fvAlphabet = new DocumentModelListImpl();

    for (int i = 0; i < alphabet.length; i++) {
      DocumentModel letterDoc = session
          .createDocumentModel(path + "/Alphabet", alphabet[i], FV_CHARACTER);
      letterDoc.setPropertyValue("fvcharacter:alphabet_order", i + 1);
      letterDoc.setPropertyValue("fvcharacter:upper_case_character", alphabet[i].toUpperCase());
      createDocument(session, letterDoc);
      fvAlphabet.add(letterDoc);

    }
    return fvAlphabet;
  }

  private String generateRandomPhrase(int numberOfWords, String[] wordsToUse) {
    StringJoiner join = new StringJoiner(" ");
    for (int i = 0; i < numberOfWords; i++) {
      join.add(wordsToUse[ThreadLocalRandom.current().nextInt(0, wordsToUse.length)]);
    }
    return join.toString();
  }

  public DocumentModelList generateFVWords(CoreSession session, String path,
      String[] words, DocumentModelList categories) {
    //Generate word documents and set appropriate properties
    String[] samplePartsOfSpeech = {"noun", "pronoun", "adjective", "verb", "adverb"};
    DocumentModelList fvWords = new DocumentModelListImpl();

    for (String word : words) {
      DocumentModel wordDoc = session
          .createDocumentModel(path + "/Dictionary", word, FV_WORD);
      wordDoc.setPropertyValue("fv-word:part_of_speech",
          samplePartsOfSpeech[ThreadLocalRandom.current().nextInt(0, samplePartsOfSpeech.length)]);
      wordDoc.setPropertyValue("fv-word:pronunciation", wordDoc.getName() + " pronunciation");

      if (categories != null && !categories.isEmpty()) {
        String randomCategory = categories
            .get(ThreadLocalRandom.current().nextInt(0, categories.size())).getId();
        String[] categoryArr = {randomCategory};
        wordDoc.setPropertyValue("fv-word:categories", categoryArr);
      }
      fvWords.add(createDocument(session, wordDoc));
    }

    return fvWords;
  }

  public DocumentModelList generateFVPhrases(CoreSession session, String path, int phraseEntries,
      String[] wordsToUse, DocumentModelList phraseBooks) {
    //Generate phrase documents
    DocumentModelList fvPhrases = new DocumentModelListImpl();

    for (int i = 0; i < phraseEntries; i++) {
      String newPhrase = generateRandomPhrase(ThreadLocalRandom.current().nextInt(3, 10),
          wordsToUse);
      DocumentModel phraseDoc = session
          .createDocumentModel(path + "/Dictionary", newPhrase, FV_PHRASE);

      if (phraseBooks != null) {
        String randomPhraseBook = phraseBooks
            .get(ThreadLocalRandom.current().nextInt(0, phraseBooks.size())).getId();
        String[] phraseBookArr = {randomPhraseBook};
        phraseDoc.setPropertyValue("fv-phrase:phrase_books", phraseBookArr);
      }

      fvPhrases.add(createDocument(session, phraseDoc));
    }

    return fvPhrases;
  }

  private DocumentModelList generateFVCategories(CoreSession session, String path) {
    //Generate category document tree
    //set to 3 categories, each with 2 subcategories (Hardcoded for now)
    DocumentModelList fvCategories = new DocumentModelListImpl();

    for (int i = 0; i < 3; i++) {
      //Add parent categories
      String parentCategoryName = "Parent Category " + currentAlphabet[i].toUpperCase();
      DocumentModel categoryDoc = session
          .createDocumentModel(path + "/Categories", parentCategoryName, FV_CATEGORY);
      fvCategories.add(createDocument(session, categoryDoc));

      for (int j = 0; j < 2; j++) {
        //Add child categories
        String childCategoryName =
            "Child Category " + currentAlphabet[i].toUpperCase() + currentAlphabet[j]
                .toUpperCase();
        DocumentModel childCategoryDoc = session
            .createDocumentModel(path + "/Categories/" + parentCategoryName, childCategoryName,
                FV_CATEGORY);
        fvCategories.add(createDocument(session, childCategoryDoc));
      }
    }

    return fvCategories;
  }

  private DocumentModelList generateFVPhraseBooks(CoreSession session, String path) {
    //Generate phrase book documents
    DocumentModelList fvPhraseBooks = new DocumentModelListImpl();

    for (int i = 0; i < 3; i++) {
      String phraseBookName = "Phrase Book " + currentAlphabet[i].toUpperCase();
      DocumentModel phraseBookDoc = session
          .createDocumentModel(path + "/Phrase Books", phraseBookName, FV_CATEGORY);
      fvPhraseBooks.add(createDocument(session, phraseBookDoc));
    }

    return fvPhraseBooks;
  }

}
