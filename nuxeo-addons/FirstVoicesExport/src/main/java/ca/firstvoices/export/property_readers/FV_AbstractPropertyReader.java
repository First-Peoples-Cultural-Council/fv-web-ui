package ca.firstvoices.export.property_readers;

import ca.firstvoices.export.format_producers.FV_AbstractProducer;
import ca.firstvoices.export.utils.ExportColumnRecord;
import ca.firstvoices.export.workers.FVExportWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;

import java.util.ArrayList;
import java.util.List;

public abstract class FV_AbstractPropertyReader
{
    protected static final Log log = LogFactory.getLog(FVExportWorker.class);
    protected StringList columns;

    public enum ReaderType
    {
        BOOLEAN, CATEGORY, COMPOUND, ID_PROP, SPEECH_PART, SIMPLE_LIST, WORD_TRANSLATION, PROPERTY
    }

    protected ExportColumnRecord spec;

    protected String                propertyToRead;
    protected String                columnNameForOutput;
    protected Integer               maxColumns;
    protected FV_AbstractProducer specOwner;

    public CoreSession session;

    public abstract ReaderType readerType();
    public abstract List<FV_DataBinding> readPropertyFromObject(Object o);

    public FV_AbstractPropertyReader(CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner )
    {
        propertyToRead = spec.property;
        columnNameForOutput = spec.colID;
        maxColumns = spec.numCols;
        this.spec = spec;
        this.session = session;
        this.specOwner = specOwner;
    }

    public Integer expectedColumnCount()
    {
        return maxColumns;
    }

    public String getPropertyToRead() { return propertyToRead; }

    public StringList getColumnNameForOutput()
    {
        if( columns != null ) return columns;

        StringList output = new StringList();

        String modColumnName = columnNameForOutput;
        Integer counter = 1;

        for( Integer col = 0; col < maxColumns; col++ )
        {
            output.add(modColumnName);
            modColumnName = columnNameForOutput + "_" + counter.toString();
            counter++;
        }

        columns = output;
        return output;
    }

    public List<FV_DataBinding> writeEmptyRow()
    {
        List<FV_DataBinding> output = new ArrayList<>();

        for (String col : columns)
        {
            output.add(new FV_DataBinding( col, ""));
        }

        return output;
    }

    public List<FV_DataBinding> propertyDoesNotExist(String columnName )
    {
        List<FV_DataBinding> readValues = new ArrayList<>();

        readValues.add( new FV_DataBinding( columnName, "Property is not entered") );

        return readValues;
    }
}
