/**
 *
 */

package reader;

import com.opencsv.CSVReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;


/**
 * @author loopingz
 *
 */
public class CsvReader extends AbstractReader {

  protected InputStreamReader fileReader = null;
  protected CSVReader csvReader = null;
  protected List<String> headers = null;
  protected String[] current = null;
  private String csvFile = null;

  public CsvReader(String cmdCsvFile) {
    csvFile = cmdCsvFile;
  }

  public CsvReader(CommandLine cmd) {
    csvFile = cmd.getOptionValue("csv-file");
  }

  public static boolean enabledOptions(CommandLine cmd) {
    return cmd.hasOption("csv-file");
  }

  public static void addOptions(Options options) {
    options
        .addOption(Option.builder().longOpt("csv-file").hasArg().desc("CSV File to use").build());
  }

  /* (non-Javadoc)
   * @see reader.IReader#open(java.lang.String[])
   */
  @Override
  public void open() {
    try {
      fileReader = new InputStreamReader(new FileInputStream(csvFile), StandardCharsets.UTF_8);

      // Read lines that have \" in them
      csvReader = new CSVReader(fileReader, ',', '"', '\0');

      // Get headers
      String[] headersLine = csvReader.readNext();
      if (headersLine.length == 1) {
        // Seems that the CSV is not using , try ;
        // Excel lies about saving with comma separated
        fileReader = new InputStreamReader(new FileInputStream(csvFile), StandardCharsets.UTF_8);
        csvReader = new CSVReader(fileReader, ';', '"', '\0');
        headersLine = csvReader.readNext();
      }
      if (headersLine == null || headersLine.length < 2) {
        throw new RuntimeException("CSV is empty");
      }
      headers = Arrays.asList(headersLine);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public String getString(Integer col) {
    if (col >= current.length || col < 0) {
      throw new RuntimeException("Index out of bound: " + col);
    }
    return cleanString(current[col]);
  }

  @Override
  public String getString(String id) {
    // Escaping "
    try {
      return cleanString(current[getIndex(id)]);
    } catch (RuntimeException e) {
      return "";
    }
  }

  protected Integer getIndex(String id) {
    int index = headers.indexOf(id);
    if (index >= current.length || index < 0) {
      throw new RuntimeException("Index out of bound: " + id);
    }
    return index;
  }



  @Override
  public Integer getInt(String id) {
    try {
      return Integer.valueOf(current[getIndex(id)]);
    } catch (NumberFormatException e) {
      // TODO Should raise a SkipRow ?
      return 0;
    }
  }

  /* (non-Javadoc)
   * @see reader.IReader#next()
   */
  @Override
  public boolean next() {
    try {
      current = csvReader.readNext();
    } catch (IOException e) {
      e.printStackTrace();
      return false;
    }
    return current != null;
  }

  @Override
  public void close() {
    try {
      csvReader.close();
      fileReader.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @Override
  public String[] getRow() {
    return current;
  }

  @Override
  public String printRow() {
    return String.join(",", getRow());
  }
}
