package ca.firstvoices.format_producers;

import ca.firstvoices.property_readers.FV_AbstractPropertyReader;
import ca.firstvoices.property_readers.FV_DataBinding;
import ca.firstvoices.utils.ExportColumnRecord;
import ca.firstvoices.utils.FVExportWorkInfo;
import ca.firstvoices.utils.FV_CSVExportColumns;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static ca.firstvoices.utils.FVExportConstants.*;
import static ca.firstvoices.utils.FVExportUtils.getTEMPBlobDirectoryPath;
import static ca.firstvoices.utils.FVExportUtils.makePropertyReader;

/*
 * FV_AbstractProducer is a driver of any export process related to producing a list of words and their
 * associated properties. FV_AbstractProducer does not know or care about the format of the export.
 * It knows how to assemble a list of readers, create a temporary file for output.
 * Given an object from a worker which runs the process of of export, it knows to generate a raw line of data
 * to be processed by subclass specifically design to handle particular data type and format.
 * FV_AbstractProducer is also able to distinguish between a single out raw data line or multi-line output and act accordingly
 * to feed it to a subclass.
 * FV_AbstractProducer is also able to collect all the column names for all properties to be included in the export file.
 *
 * It is responsibility of the subclass to create a file writer and perform writes.
 *
 */
abstract public class FV_AbstractProducer
{
    protected static final Log log = LogFactory.getLog(FV_AbstractProducer.class);

    protected List<FV_AbstractPropertyReader>   propertyReaders;    // list of readers associated with producer
    protected File                              outputFile;         // temporary file for export
    protected String                            originalFileName;   // original file name as it was created
    protected FV_CSVExportColumns               spec;               // binding between columns, properties and readers
    protected CoreSession                       session;            // producer session

    protected Boolean hasCompoundReaders = false;

    FV_AbstractProducer( CoreSession session, FV_CSVExportColumns spec )
    {
        this.propertyReaders = new ArrayList<>();
        this.session = session;
        this.spec = spec;
    }

    /**
     * @param outputLine - data to be provided to format/data specific subclass
     */
    abstract void writeLine( List<String> outputLine );

    /**
     * Each subclass has to provide a default set of readers which are used in case user does not provide
     * a set of columns defining export.
     */
    abstract void createDefaultPropertyReaders();

    /**
     * Each subclass may define any processing just before temporary file will be closed.
     */
    abstract void endProduction();

    public FV_CSVExportColumns getSpec() { return spec; }


    /**
     * Gathers column names from all the known readers and lets subclass write/use it to output
     * to temporary file.
     */
    public void writeColumnNames()
    {
        List<String> outputLine = getColumnNames();

        writeLine( outputLine );
    }

    /**
     * @param rowData - data set produced by all the readers.
     *                  It always represents a row of data from db query and is always associated with the main
     *                  object (word or phrase).
     */
    public void writeRowData( List<FV_DataBinding> rowData  )
    {
        List<String> outputLine;

        if( hasCompoundReaders )
        {
            List< List<FV_DataBinding> > multiLines = createOutputFromCompound( rowData );

            for( List<FV_DataBinding> line : multiLines )
            {
                outputLine = createLineFromData( line );
                writeLine(outputLine);
            }
        }
        else
        {
            outputLine = createLineFromData( rowData );
            writeLine(outputLine);
        }
    }

    /**
     *
     * @param dialect - associated with the produced export
     * @param workInfo - complete work information as provided by an export worker
     */
    // this close has to be called after subclass completes its own close
    public void close( DocumentModel dialect, FVExportWorkInfo workInfo )
    {
        endProduction(); // subclass can do last moment processing or information write

        EventProducer eventProducer = Framework.getService( EventProducer.class );

        // finish by generating event for the  export listener to move created temp file to a blob within Nuxeo data space
        DocumentEventContext blob_worker_ctx =  new DocumentEventContext( session, session.getPrincipal(), dialect );

        workInfo.fileNameAsSaved  = outputFile.getName();
        workInfo.fileName = originalFileName;
        workInfo.filePath = outputFile.getPath();
        workInfo.fileLength = outputFile.length();

        // generate new request event to move temporary file to its final location
        // and attach it to a wrapper which will represent it to users
        blob_worker_ctx.setProperty( EXPORT_WORK_INFO, workInfo );

        Event event = blob_worker_ctx.newEvent( FINISH_EXPORT_BY_WRAPPING_BLOB ); // notify about export completion
        eventProducer.fireEvent(event);
    }

    /**
     * @param columns - list of columns requested for export
     */
    public void addReaders( StringList columns )
    {
        // '*' means ALL properties should be exported
        if (columns.contains("*"))
        {
            // To be provided by a subclass
            // Ideally it should include ALL properties to be ready
            createDefaultPropertyReaders();
        }
        else
        {
            for(String  col : columns )
            {
                ExportColumnRecord colR = spec.getColumnExportRecord( col );

                if (colR != null && colR.useForExport)
                {
                    try
                    {
                        FV_AbstractPropertyReader instance = makePropertyReader( session, colR, this );

                        // check if compound readers are present as it will change assemply of the raw data
                        if( instance.readerType() == FV_AbstractPropertyReader.ReaderType.COMPOUND ) hasCompoundReaders = true;

                        propertyReaders.add(instance);
                    }
                    catch (Exception e)
                    {
                        e.printStackTrace();
                    }
                }
                else
                {
                   // log.warn
                }
            }
        }
    }

    /**
     * @param fileName - name to be used for the temporary file
     *                   fileName will be used to name the wrapper holding finished exported document
     * @param suffix - this is format type CSV or PDF
     *
     * @return - true if temporary file was successfully created
     */
    public Boolean createTemporaryOutputFile( String fileName, String suffix )
    {
        try
        {
            String nuxeo_temp_path = getTEMPBlobDirectoryPath();
            File path = new File( nuxeo_temp_path );
            originalFileName = fileName;
            outputFile = File.createTempFile(fileName, "." + suffix.toLowerCase(), path );

            return true;
        }
        catch( IOException e )
        {
            e.printStackTrace();
        }

        return false;
    }

    /**
     * @param o - object from which gathered readers will collect property values
     *
     * @return - list of assembled data for processing which follows
     */
    public List<FV_DataBinding> readPropertiesWithReadersFrom( Object o )
    {
        List<FV_DataBinding> listToReturn = new ArrayList<>();

        for( FV_AbstractPropertyReader pr : propertyReaders )
        {
            List<FV_DataBinding> listToAdd = pr.readPropertyFromObject( o );

            listToReturn.addAll( listToAdd );
        }

        return listToReturn;
    }

    /**
     * @param data - row data produced by readPropertiesWithReadersFrom
     *
     * @return list of values to be used for output
     */
    private List<String> createLineFromData( List<FV_DataBinding> data )
    {
        List<String> output = new ArrayList<>();

        for( FV_DataBinding column : data )
        {
            output.add( (String)column.getReadProperty() );
        }

        return output;
    }

    /**
     * @return list of column names to be written out
     */
    private List<String> getColumnNames()
    {
        List<String> output = new ArrayList<>();

        for( FV_AbstractPropertyReader reader : propertyReaders )
        {
            StringList columnNames = reader.getColumnNameForOutput();

            output.addAll(columnNames);
         }

        return  output;
    }

    /**
     * @param rowData - row data in a compound form
     * @return list of row data correctly formed for a compound object
     *
     */
    private List<List<FV_DataBinding>> createOutputFromCompound( List<FV_DataBinding> rowData )
    {
        List< List<FV_DataBinding> > listToReturn = new ArrayList<>();
        int numOutputLines = 1;     // maximum number of output lines to be generated
        int scan = 1;               // since some columns may have more than 1 row we will need to rescan
                                    // provided data multiple times
        do
        {
            List<FV_DataBinding> singleLine = new ArrayList<>();

            for (FV_DataBinding o : rowData)
            {
                int ol = o.outputLinesInProperty();  // number of lines in 'o'
                if( ol >= scan )
                {
                    if( ol > numOutputLines ) numOutputLines = ol; // update maximum number of lines needed

                    if( o.isMultiLine() )
                    {
                        FV_DataBinding lineObject = (FV_DataBinding)o.getColumnObject(scan-1);
                        List<FV_DataBinding> compoundColumnObjects = (List<FV_DataBinding>)lineObject.getListOfColumnObjects();

                        for( FV_DataBinding colObj : compoundColumnObjects )
                        {
                            singleLine.add( colObj );
                        }
                    }
                    else
                    {
                        singleLine.add( o );
                    }
                }
                else // create empty fillers for lines where there is no data
                {
                    if( o.isMultiLine() )
                    {
                        singleLine.addAll( writeBlankRowData( o.getNumberOfCompoundColumn()) );
                    }
                    else
                    {
                        singleLine.add( new FV_DataBinding( o.getOutputColumnName(), "") );
                    }
                }
            }

            scan++; // scan again until we extracted all compund values

            listToReturn.add(singleLine);


        } while ( scan  <= numOutputLines );

        return listToReturn;
    }

    /**
     * @param columns - number of empty column object to generate to represent no data
     *
     * @return - list with empty column values to pad properties in a compound object
     */
    private List<FV_DataBinding> writeBlankRowData(int columns )
    {
        List<FV_DataBinding> output = new ArrayList<>();

        for (int i = 0; i < columns; i++ )
        {
            output.add(new FV_DataBinding( "", "") );
        }

        return output;

    }

}
