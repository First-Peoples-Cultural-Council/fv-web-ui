/**
 *
 */

package mappers.firstvoices;

import java.io.IOException;
import java.util.ArrayList;
import mappers.propertyreaders.PropertyReader;
import mappers.propertyreaders.SimpleListPropertyReader;
import mappers.propertyreaders.TranslationReader;
import mappers.propertyreaders.TrueFalsePropertyReader;
import org.nuxeo.client.objects.Document;

/**
 @author loopingz
 Class to migrate RELATED_PHRASES from a CSV file into the FirstVoices system.
 */
public class RelatedPhraseMapper extends DictionaryCachedMapper {

  public RelatedPhraseMapper() {
    super("FVPhrase", Columns.PHRASE_COLUMN);
    String[] definitionCols = {
        Columns.DOMINANT_LANGUAGE_SENTENCE_DEFINITION,
        Columns.DOMINANT_LANGUAGE_SENTENCE_DEFINITION + "_2",
        Columns.DOMINANT_LANGUAGE_SENTENCE_DEFINITION + "_3",
        Columns.DOMINANT_LANGUAGE_SENTENCE_DEFINITION + "_4",
        Columns.DOMINANT_LANGUAGE_SENTENCE_DEFINITION + "_5"};
    String[] literalTranslationCols = {
        Columns.DOMINANT_LANGUAGE_SENTENCE_VALUE,
        Columns.DOMINANT_LANGUAGE_SENTENCE_VALUE + "_2",
        Columns.DOMINANT_LANGUAGE_SENTENCE_VALUE + "_3",
        Columns.DOMINANT_LANGUAGE_SENTENCE_VALUE + "_4",
        Columns.DOMINANT_LANGUAGE_SENTENCE_VALUE + "_5"};
    String[] culturalNoteCols = {
        Columns.PHRASE_CULTURAL_NOTE,
        Columns.PHRASE_CULTURAL_NOTE + "_2",
        Columns.PHRASE_CULTURAL_NOTE + "_3",
        Columns.PHRASE_CULTURAL_NOTE + "_4",
        Columns.PHRASE_CULTURAL_NOTE + "_5"};
    String[] spellingCols = {
        Columns.PHRASE_ALTERNATE_SPELLING,
        Columns.PHRASE_ALTERNATE_SPELLING + "_2",
        Columns.PHRASE_ALTERNATE_SPELLING + "_3",
        Columns.PHRASE_ALTERNATE_SPELLING + "_4",
        Columns.PHRASE_ALTERNATE_SPELLING + "_5"};

    propertyReaders.add(new PropertyReader(
        Properties.TITLE, Columns.PHRASE_COLUMN));
    propertyReaders.add(new TranslationReader(
        Properties.TRANSLATION, Columns.DOMINANT_LANGUAGE, literalTranslationCols));
    propertyReaders.add(new TranslationReader(
        Properties.DEFINITION, Columns.DOMINANT_LANGUAGE, definitionCols));
    propertyReaders.add(new SimpleListPropertyReader(
        Properties.CULTURAL_NOTE, culturalNoteCols));
    propertyReaders.add(new SimpleListPropertyReader(
        Properties.PHRASE_ALTERNATE_SPELLINGS, spellingCols));
    propertyReaders.add(new PropertyReader(
        Properties.ASSIGNED_USR_ID, Columns.ASSIGNED_USR_ID));
    propertyReaders.add(new PropertyReader(
        Properties.CHANGE_DTTM, Columns.CHANGE_DTTM));
    propertyReaders.add(new PropertyReader(
        Properties.IMPORT_ID, Columns.PHRASE_ID));
    propertyReaders.add(new PropertyReader(
        Properties.REFERENCE, Columns.PHRASE_REFERENCE));
    propertyReaders.add(new PropertyReader(
        Properties.PHRASE_ACKNOWLEDGEMENT, Columns.PHRASE_ACKNOWLEDGEMENT));
    propertyReaders.add(new PropertyReader(
        Properties.STATUS_ID, Columns.PHRASE_STATUS));
    propertyReaders.add(new TrueFalsePropertyReader(
        Properties.AVAILABLE_IN_CHILDRENS_ARCHIVE, Columns.AVAILABLE_IN_CHILDRENS_ARCHIVE));
    
    subdocuments.add(new PhraseBookMapper());
    subdocuments.add(new SourcesMapper(Columns.PHRASE_SOURCE));
    subdocuments.add(new AudioMapper(Columns.PHRASE_COLUMN));
    subdocuments.add(new AudioMapper(Columns.PHRASE_COLUMN, 2));
    subdocuments.add(new AudioMapper(Columns.PHRASE_COLUMN, 3));
    subdocuments.add(new PictureMapper(Columns.PHRASE_COLUMN));
    subdocuments.add(new PictureMapper(Columns.PHRASE_COLUMN, 2));
    subdocuments.add(new VideoMapper(Columns.PHRASE_COLUMN));
    subdocuments.add(new VideoMapper(Columns.PHRASE_COLUMN, 2));
  }

  protected RelatedPhraseMapper(String type, Object column) {
    super(type, column);
  }

  @Override
  protected String getCacheQuery() {
    return "SELECT * FROM FVPhrase WHERE ecm:parentId='" + documents.get("Dictionary").getId()
        + "' AND ecm:isTrashed = 0";
  }

  @Override
  protected Document createDocument(Document doc, Integer depth)
      throws IOException {
    Document subDocument = super.createDocument(doc, depth);
    updateMainDocumentReference(subDocument);
    return subDocument;
  }

  protected void updateMainDocumentReference(Document subDocument) {
    ArrayList<String> phrases = new ArrayList<>();
    phrases.add(subDocument.getId());
    documents.get("current").setPropertyValue(Properties.RELATED_PHRASES, phrases);
  }
}
