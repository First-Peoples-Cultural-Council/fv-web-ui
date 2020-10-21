package task;

import common.ConsoleLogger;
import common.CsvLogWriter;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.logging.FileHandler;
import mappers.CsvMapper;
import mappers.firstvoices.BinaryMapper;
import mappers.firstvoices.portal.PortalMigratorMapper;
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

public class FVPortalMigrator extends AbstractMigrator {

  protected CsvMapper mapper = null;

  protected FVPortalMigrator(CommandLine cmd, AbstractReader reader) {
    super(reader);

    BinaryMapper.setDataPath(cmd.getOptionValue("data-path"));

    mapper = new PortalMigratorMapper();
    if (cmd.hasOption("limit")) {
      limit = Integer.valueOf(cmd.getOptionValue("limit"));
    }
    try {
      FileHandler fh = new FileHandler(
          new File(new File(cmd.getOptionValue("data-path")), "import.log").getAbsolutePath());
      log.addHandler(fh);
    } catch (SecurityException | IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    String csvFile = cmd.getOptionValue("csv-file");
    // Remove the .csv from the file to create a file_errors.csv
    csvFile = csvFile.substring(0, csvFile.length() - 4) + "_errors.csv";
    logWriter = new CsvLogWriter(csvFile);
  }

  public static void main(String[] argv) {
    AbstractReader reader = null;
    // Handle command line option

    setOptions();

    options.addOption(
        Option.builder().longOpt("data-path").required().hasArg().desc("Where to get data from")
            .build());

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
    new FVPortalMigrator(commandLine, reader)
        .process(nuxeoUrl, nuxeoUser, nuxeoPassword, "/" + domain + "/Workspaces/");
  }

  @Override
  protected void processRow(NuxeoClient client) throws IOException {
    Map<String, Document> docs = getOrCreateLanguageDocument(client, reader);
    docs.put("parent", docs.get("Dictionary"));
    String dialectTitle = reader.getString("DIALECT");
    System.out.println("Title: " + dialectTitle);
    mapper.process(docs, client, reader);
    ConsoleLogger.out("##### " + lines + " lines, " + errors + " errors, "
        + PortalMigratorMapper.createdPortals + " Portals created, "
        + PortalMigratorMapper.updatedPortals + " Portals updated, "
        + PortalMigratorMapper.createdObjects + " objects created");
  }

}
