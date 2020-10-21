package mappers.firstvoices.alphabet;

import java.io.IOException;
import mappers.firstvoices.AudioMapper;
import mappers.firstvoices.DictionaryCachedMapper;
import mappers.firstvoices.Properties;
import mappers.propertyreaders.PropertyReader;
import org.nuxeo.client.objects.Document;


public class CharacterMigratorMapper extends DictionaryCachedMapper {

  public static int createdCharacters = 0;
  public static int existingCharacters = 0;

  public CharacterMigratorMapper() {
    super("FVCharacter", "CHAR");
    parentKey = "Alphabet";
    cacheProperty = "dc:title";

    propertyReaders.add(new PropertyReader(Properties.TITLE, "CHAR"));
    propertyReaders.add(new PropertyReader("fvcharacter:upper_case_character", "CHAR_UPPER_CASE"));
    propertyReaders.add(new PropertyReader("fvcharacter:alphabet_order", "ORDER"));
    propertyReaders.add(new PropertyReader("fvcharacter:fuzzy_latin_match", "LATIN"));

    subdocuments.add(new AudioMapper());

  }

  @Override
  protected Document createDocument(Document doc, Integer depth) throws IOException {
    Document result = getFromCache(doc);
    // Create new FVCharacter document
    if (!fakeCreation && result == null) {

      result = Document.createWithName(doc.getName(), doc.getType());
      result.setProperties(doc.getProperties());
      result = client.repository().createDocumentById(documents.get(parentKey).getId(), result);

      tagAndUpdateCreator(result, doc);

      createdObjects++;
      createdCharacters++;
      cacheDocument(result);

      // Characters should be enabled, at the very least
      client.operation("Document.FollowLifecycleTransition")
          .param("value", "Enable").input(result).execute();
    } else {
      // If the character document already exists, skip it
      existingCharacters++;
    }

    if (depth == 1) {
      documents.put("main", result);
    }
    return result;
  }

  @Override
  protected String getCacheQuery() {
    return "SELECT * FROM FVCharacter WHERE ecm:parentId='" + documents.get(parentKey).getId()
        + "' AND ecm:isTrashed = 0";
  }
}
