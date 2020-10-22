package tasks.utils;

import com.opencsv.CSVWriter;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

public class CsvUtils {

    private CSVWriter csvWriter;
	private FileOutputStream fileStream;

    public CsvUtils(String file) {
        try {
        	fileStream = new FileOutputStream(file);
            csvWriter = new CSVWriter(new OutputStreamWriter(fileStream, "UTF-8"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void writeLine(String[] rows) {
        csvWriter.writeNext(rows);
        try {
            csvWriter.flush();
        } catch (IOException e) {
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
