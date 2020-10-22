package task;

import common.ConsoleLogger;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import mappers.CsvMapper;
import mappers.CsvValidator;
import mappers.firstvoices.BinaryMapper;
import mappers.firstvoices.PhraseMapper;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.objects.Document;
import reader.AbstractReader;
import reader.CsvReader;

/*
 @author cstuart dyona
 Class to migrate phrases from a CSV file (or potentially an Oracle database) into the
 FirstVoices system.
*/

public class FVPhraseMigrator extends AbstractMigrator {

  protected CsvMapper mapper = null;

  public FVPhraseMigrator(AbstractReader reader, String[] argv) {
    super(reader);

    // Build command line
    buildCommandLine("FV Batch Import - Phrases", this, argv);

    // Set binary mapper data path
    BinaryMapper.setDataPath(blobDataPath);

    mapper = new PhraseMapper();
    mapper.setFakeCreation(false);
    mapper.setDialectID(dialectID);

    // Setup output of errors and log to path of data/csv file
    if (csvFile != null) {
      setupErrorOutputFiles(csvFile);
    }
  }

  public static void main(String[] argv)
      throws Exception {
    AbstractReader reader = null;

    FVPhraseMigrator phraseMigrator = new FVPhraseMigrator(reader, argv);

    if (csvFile != null && !csvFile.isEmpty()) {
      reader = new CsvReader(csvFile);
      phraseMigrator.setReader(reader);
    }

    CsvValidator csvVal = new CsvValidator(url, username, password, csvFile, dialectID,
        languagePath);
    HashMap<String, ArrayList<String>> valid = csvVal.validate(blobDataPath, limit);

    if (valid.isEmpty() || skipValidation) {
      phraseMigrator.process(url, username, password, "/" + domain + "/Workspaces/");
    } else {
      csvVal.printInvalidEntries();
    }

    csvVal.close();
  }

  @Override
  protected void processRow(NuxeoClient client) throws IOException {
    Map<String, Document> docs = getOrCreateLanguageDocument(client, reader);
    docs.put("parent", docs.get("Dictionary"));

    try {
      Document phraseDoc = mapper.process(docs, client, reader);
    } catch (IOException e) {
      // File not found
      logWriter.writeLine(reader.getRow(), e.getMessage());
    }

    if (lines % 1000 == 0) {
      ConsoleLogger.out("##### " + lines + " lines, " + errors + " errors, "
          + PhraseMapper.createdPhrases + " phrases created, "
          + PhraseMapper.updatedPhrases + " null import_id phrases updated, "
          + PhraseMapper.cachedPhrases + " phrases in cache and skipped, "
          + CsvMapper.createdObjects + " objects created");
    }
  }

}
