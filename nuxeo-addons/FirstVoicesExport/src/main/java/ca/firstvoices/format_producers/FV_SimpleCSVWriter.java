package ca.firstvoices.format_producers;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.StringJoiner;


/*
    Helper class to write CSV data to a file
 */

public class FV_SimpleCSVWriter
{
    protected FileWriter fileHandle;

    FV_SimpleCSVWriter(FileWriter writer)
    {
        fileHandle = writer;
    }

    public void writeNext( List<String> row ) throws IOException
    {
        StringJoiner joiner = new StringJoiner(",");

        for( String s : row )
        {
            joiner.add(s);
        }

        String output = joiner.toString() + "\n";
        fileHandle.write( output );
    }

    public void flush() throws IOException
    {
        fileHandle.flush();
    }

    public void close() throws IOException
    {
        fileHandle.close();
    }
}
