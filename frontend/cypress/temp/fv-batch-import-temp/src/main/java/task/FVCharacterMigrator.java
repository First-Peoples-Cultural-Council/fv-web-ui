package task;

import common.ConsoleLogger;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import mappers.CsvMapper;
import mappers.CsvValidator;
import mappers.firstvoices.BinaryMapper;
import mappers.firstvoices.alphabet.CharacterMigratorMapper;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.objects.Document;
import reader.AbstractReader;
import reader.CsvReader;

public class FVCharacterMigrator extends AbstractMigrator {

  protected CsvMapper mapper = null;

  protected FVCharacterMigrator(AbstractReader reader, String[] argv) {
    super(reader);

    // Build command line
    buildCommandLine("FV Batch Import - Characters", this, argv);

    // Set binary mapper data path
    BinaryMapper.setDataPath(blobDataPath);

    mapper = new CharacterMigratorMapper();
    mapper.setFakeCreation(false);

    // Setup output of errors and log to path of data/csv file
    if (csvFile != null) {
      setupErrorOutputFiles(csvFile);
    }
  }

  public static void main(String[] argv)
      throws Exception {
    AbstractReader reader = null;

    FVCharacterMigrator characterMigrator = new FVCharacterMigrator(reader, argv);

    if (csvFile != null && !csvFile.isEmpty()) {
      reader = new CsvReader(csvFile);
      characterMigrator.setReader(reader);
    }

    CsvValidator csvVal = new CsvValidator(url, username, password, csvFile, dialectID,
        languagePath);
    HashMap<String, ArrayList<String>> valid = csvVal.validate(blobDataPath, limit);

    if (valid.isEmpty()) {
      characterMigrator.process(url, username, password, "/" + domain + "/Workspaces/");
    } else {
      csvVal.printInvalidEntries();
    }

    csvVal.close();
  }

  @Override
  protected void processRow(NuxeoClient client) throws IOException {
    Map<String, Document> docs = getOrCreateLanguageDocument(client, reader);
    docs.put("parent", docs.get("Alphabet"));
    mapper.process(docs, client, reader);
    ConsoleLogger.out("##### " + lines + " lines, " + errors + " errors, "
        + CharacterMigratorMapper.createdCharacters + " Characters created, "
        + CharacterMigratorMapper.existingCharacters + " Characters skipped, "
        + CharacterMigratorMapper.createdObjects + " objects created");
  }

}
