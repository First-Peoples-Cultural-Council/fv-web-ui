package ca.firstvoices.format_producers;

/*
    Producer assembling output formatted as PDF.
*/

import ca.firstvoices.property_readers.FV_DataBinding;
import org.nuxeo.ecm.automation.core.util.StringList;

import java.util.List;

public class FV_PDF_Producer extends FV_AbstractProducer
{

    FV_PDF_Producer(String fileName, StringList columns  )
    {
        super( null, null );
    }

    @Override
    public void writeRowData( List<FV_DataBinding> rowData  )
    {
    }

    public void writeLine( List<String> outputLine )
    {
    }

    protected void endProduction()
    {
    }

    protected void createDefaultPropertyReaders()
    {
    }
}
