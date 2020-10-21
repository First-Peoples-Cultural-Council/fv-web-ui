/**
 *
 */

package mappers.firstvoices;

import java.util.Map;
import mappers.CsvMapper;
import mappers.propertyreaders.PropertyReader;
import mappers.propertyreaders.SimpleListPropertyReader;
import mappers.propertyreaders.TranslationReader;
import mappers.propertyreaders.TrueFalsePropertyReader;
import org.nuxeo.client.objects.Document;

/**
 @author cstuart
 Class to migrate phrases from a CSV file (or potentially an Oracle database) into the
 FirstVoices system.
 */
public class PhraseMapper extends CsvMapper {

  public static int createdPhrases = 0;
  public static int updatedPhrases = 0;
  public static int cachedPhrases = 0;
  protected static Map<String, Document> cache = null;

  public PhraseMapper() {
    super("FVPhrase", Columns.PHRASE);

    setupProperties();
  }

  private void setupProperties() {

    String[] definitionCols = {
        Columns.DOMINANT_LANGUAGE_DEFINITION,
        Columns.DOMINANT_LANGUAGE_DEFINITION + "_2",
        Columns.DOMINANT_LANGUAGE_DEFINITION + "_3",
        Columns.DOMINANT_LANGUAGE_DEFINITION + "_4",
        Columns.DOMINANT_LANGUAGE_DEFINITION + "_5"};
    String[] literalTranslationCols = {
        Columns.DOMINANT_LANGUAGE_VALUE,
        Columns.DOMINANT_LANGUAGE_VALUE + "_2",
        Columns.DOMINANT_LANGUAGE_VALUE + "_3",
        Columns.DOMINANT_LANGUAGE_VALUE + "_4",
        Columns.DOMINANT_LANGUAGE_VALUE + "_5"};
    String[] culturalNoteCols = {
        Columns.CULTURAL_NOTE,
        Columns.CULTURAL_NOTE + "_2",
        Columns.CULTURAL_NOTE + "_3",
        Columns.CULTURAL_NOTE + "_4",
        Columns.CULTURAL_NOTE + "_5"};
    String[] spellingCols = {
        Columns.ALTERNATE_SPELLING,
        Columns.ALTERNATE_SPELLING + "_2",
        Columns.ALTERNATE_SPELLING + "_3",
        Columns.ALTERNATE_SPELLING + "_4",
        Columns.ALTERNATE_SPELLING + "_5"};

    propertyReaders.add(new PropertyReader(
        Properties.TITLE, Columns.PHRASE));
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
        Properties.REFERENCE, Columns.REFERENCE));
    propertyReaders.add(new PropertyReader(
        Properties.PHRASE_ACKNOWLEDGEMENT, Columns.ACKNOWLEDGEMENT));
    propertyReaders.add(new PropertyReader(
        Properties.STATUS_ID, Columns.PHRASE_STATUS));
    propertyReaders.add(new TrueFalsePropertyReader(
        Properties.AVAILABLE_IN_CHILDRENS_ARCHIVE, Columns.AVAILABLE_IN_CHILDRENS_ARCHIVE));

    subdocuments.add(new PhraseBookMapper());
    subdocuments.add(new SourcesMapper());
    subdocuments.add(new AudioMapper());
    subdocuments.add(new AudioMapper(2));
    subdocuments.add(new AudioMapper(3));
    subdocuments.add(new PictureMapper());
    subdocuments.add(new PictureMapper(2));
    subdocuments.add(new VideoMapper());
    subdocuments.add(new VideoMapper(2));
  }
}
