package mappers.firstvoices.book;

import java.io.IOException;
import mappers.firstvoices.AudioMapper;
import mappers.firstvoices.Columns;
import mappers.firstvoices.DictionaryCachedMapper;
import mappers.firstvoices.PictureMapper;
import mappers.firstvoices.Properties;
import mappers.firstvoices.VideoMapper;
import mappers.propertyreaders.PropertyReader;
import mappers.propertyreaders.TranslationReader;
import org.nuxeo.client.objects.Document;

public class BookEntryMigratorMapper extends DictionaryCachedMapper {

  public static int createdBookEntries = 0;
  public static int updatedBookEntries = 0;

  public BookEntryMigratorMapper() {
    super("FVBookEntry", Columns.ID);
    parentKey = "parent";
    cacheProperty = Properties.IMPORT_ID;
    propertyReaders.add(new PropertyReader(Properties.TITLE, "ABORIGINAL_LANGUAGE_TEXT"));

    propertyReaders.add(new PropertyReader(Properties.IMPORT_ID, Columns.ID));
    propertyReaders.add(new PropertyReader("fvbookentry:sort_map", "SORT_MAP"));
    propertyReaders.add(new PropertyReader(Properties.CULTURAL_NOTE, "CULTURAL_NOTE"));

    propertyReaders.add(
        new TranslationReader("fvbookentry:dominant_language_text", Columns.DOMINANT_LANGUAGE,
            "DOMINANT_LANGUAGE_TEXT"));
    propertyReaders.add(new TranslationReader("fv:literal_translation", Columns.DOMINANT_LANGUAGE,
        "DOMINANT_LANGUAGE_TRANSLATION"));

    subdocuments.add(new PictureMapper());
    subdocuments.add(new AudioMapper());
    subdocuments.add(new VideoMapper());

  }

  @Override
  protected Document createDocument(Document doc, Integer depth) throws IOException {
    Document result = getFromCache(doc);

    if (!fakeCreation && result == null) {
      result = client.operation("Document.Create").schemas("*")
          .input(documents.get(parentKey)).param("type", doc.getType()).param("name", doc.getId())
          .param("properties", doc).execute();

      tagAndUpdateCreator(result, doc);
      createdObjects++;
      createdBookEntries++;
      cacheDocument(result);
      publishDocument(result);

    }

    if (depth == 1) {
      documents.put("main", result);
    }

    return result;
  }

  @Override
  protected String getCacheQuery() {
    return "SELECT * FROM FVBookEntry WHERE ecm:ancestorId='" + documents.get("Dialect").getId()
        + "' AND ecm:isTrashed = 0";
  }

}
