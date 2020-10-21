package common;

import com.opencsv.CSVWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import org.apache.commons.lang3.ArrayUtils;

public class CsvLogWriter {

  private CSVWriter csvWriter;
  private FileOutputStream fileStream;

  public CsvLogWriter(String file) {
    // Will be closed at the end of the software by GC
    try {
      fileStream = new FileOutputStream(file);
      csvWriter = new CSVWriter(new OutputStreamWriter(fileStream, StandardCharsets.UTF_8));
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }

  public void writeLine(String[] message, String exception) {
    csvWriter.writeNext(ArrayUtils.addAll(message, exception));
    try {
      csvWriter.flush();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }

  public void close() {
    try {
      csvWriter.close();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }
}
