/**
 *
 */

package task;

import common.CsvLogWriter;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;
import mappers.CsvMapper;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.ParseException;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.objects.Document;
import reader.AbstractReader;
import reader.CsvReader;

/**
 * @author loopingz
 *
 */
public class InuktitutMigrator extends AbstractMigrator {

  protected CsvMapper mapper = null;
  protected String languageFamily = "";
  protected String language = "";
  protected String dialect = "";
  protected String wordType = "";

  public InuktitutMigrator(CommandLine cmd, AbstractReader reader) {
    super(reader);
    if (cmd.hasOption("limit")) {
      limit = Integer.valueOf(cmd.getOptionValue("limit"));
    }
    dialectDocumentType = "INDialect";
    wordType = cmd.getOptionValue("inuktitut-type", "VerbEnding");
    languageFamily = cmd.getOptionValue("family", "Inuktitut");
    language = cmd.getOptionValue("language", "Inuktitut");
    dialect = cmd.getOptionValue("dialect", "Inuktitut");
    String mapperType = "mappers.inuktitut." + wordType + "Mapper";
    try {
      mapper = (CsvMapper) Class.forName(mapperType).newInstance();
      //mapper.setFakeCreation(true);
    } catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
      e.printStackTrace();
      System.out.println("Inuktitut type of word are VerbEnding");
    }
    String csvFile = cmd.getOptionValue("csv-file");
    // Remove the .csv from the file to create a file_errors.csv
    csvFile = csvFile.substring(0, csvFile.length() - 4) + "_errors.csv";
    logWriter = new CsvLogWriter(csvFile);
  }

  /**
   * Specify username and password in argument list
   *
   * @param argv
   * @throws SQLException
   * @throws ClassNotFoundException
   * @throws ParseException
   */
  public static void main(String[] argv)
      throws SQLException, ClassNotFoundException, ParseException {

    AbstractReader reader = null;

    // Handle command line option
    setOptions();

    options.addOption(Option.builder().longOpt("family").hasArg()
        .desc("Language Family").build());
    options.addOption(Option.builder().longOpt("language").hasArg()
        .desc("Language").build());
    options.addOption(Option.builder().longOpt("dialect").hasArg()
        .desc("Dialect").build());
    options.addOption(Option.builder().longOpt("inuktitut-type").hasArg()
        .desc("Inuktitut type of word ( VerbEnding, ... )").build());
    CommandLineParser parser = new DefaultParser();
    CommandLine commandLine = null;
    try {
      commandLine = parser.parse(options, argv);
    } catch (ParseException e) {
      e.printStackTrace();
      HelpFormatter formatter = new HelpFormatter();
      formatter.printHelp("Migrator", options);
      return;
    }
    if (CsvReader.enabledOptions(commandLine)) {
      reader = new CsvReader(commandLine);
    }
    // Connect to Nuxeo server
    String nuxeoPassword = commandLine.getOptionValue("nuxeo-password", "Administrator");
    String nuxeoUser = commandLine.getOptionValue("nuxeo-user", "Administrator");
    String nuxeoUrl = commandLine.getOptionValue("nuxeo-url");
    String domain = commandLine.getOptionValue("domain");
    new InuktitutMigrator(commandLine, reader)
        .process(nuxeoUrl, nuxeoUser, nuxeoPassword, "/" + domain + "/Workspaces/");
  }

  /* (non-Javadoc)
   * @see task.AbstractMigrator#processRow(org.nuxeo.ecm.automation.client.Session)
   */
  @Override
  protected void processRow(NuxeoClient client) throws IOException {
    Map<String, Document> docs = getOrCreateLanguageDocument(client, languageFamily, language,
        dialect);
    docs.put("parent", docs.get("Dictionary"));
    mapper.process(docs, client, reader);
  }
}
