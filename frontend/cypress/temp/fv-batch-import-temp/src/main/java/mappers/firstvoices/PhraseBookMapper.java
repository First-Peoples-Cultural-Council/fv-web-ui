/**
 *
 */

package mappers.firstvoices;

import java.io.IOException;
import java.util.ArrayList;
import mappers.propertyreaders.PropertyReader;
import org.nuxeo.client.objects.Document;

/**
 * @author dyona
 *
 */
public class PhraseBookMapper extends RelatedPhraseMapper {

  public PhraseBookMapper() {
    super("FVCategory", Columns.PHRASE_BOOK);
    parentKey = "Phrase Books";
    cacheProperty = Properties.TITLE;
    propertyReaders.add(new PropertyReader(Properties.PHRASE_BOOKS, Columns.PHRASE_BOOK));
  }

  @Override
  protected String getCacheQuery() {
    // Include all categories in the Shared Data folder
    return "SELECT * FROM FVCategory WHERE ecm:parentId='" + documents.get("Phrase Books").getId()
        + "' AND ecm:isTrashed = 0";
  }

  protected void updateMainDocumentReference(ArrayList<String> docIDList) {
    documents.get("current").setPropertyValue(Properties.PHRASE_BOOKS, docIDList);
  }

  @Override
  protected Document createDocument(Document doc, Integer depth) throws IOException {

    String[] categories = doc.getPropertyValue("fv-phrase:phrase_books").toString().split(",");
    ArrayList<String> categoryIDs = new ArrayList<>();

    for (String category : categories) {

      String trimmedCategory = category.trim();

      // Nuxeo will convert / to _ - convert it back for lookup
      trimmedCategory = trimmedCategory.replace("_", "/");

      Document fakeLookupDoc = Document.createWithName(trimmedCategory, "FVCategory");
      fakeLookupDoc.setPropertyValue("dc:title", trimmedCategory);

      Document cachedDoc = getFromCache(fakeLookupDoc);

      if (cachedDoc != null) {
        categoryIDs.add(cachedDoc.getId());
      } else {
        throw new IOException("Could not find category " + trimmedCategory);
      }

    }

    updateMainDocumentReference(categoryIDs);
    return null;
  }

}
