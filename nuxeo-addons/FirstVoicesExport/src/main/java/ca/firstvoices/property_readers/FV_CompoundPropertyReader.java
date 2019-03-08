package ca.firstvoices.property_readers;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.*;

import java.util.ArrayList;
import java.util.List;

import static ca.firstvoices.utils.FVExportUtils.makePropertyReader;

/*
 * FV_CompoundPropertyReader reads properties which are String[] and have to be de-referenced
 * to read their values. For now FV_CompoundPropertyReader handles Media type properties (Image, Audio, Video).
 */

public class FV_CompoundPropertyReader extends FV_AbstractPropertyReader
{
    private FV_DataBinding[]    compound;
    private List<FV_AbstractPropertyReader>     compoundReaders;

    public ReaderType readerType()
    {
        return ReaderType.COMPOUND;
    }

    public FV_CompoundPropertyReader( CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner )
    {
        super( session, spec, specOwner );
        compound = spec.compound;
        maxColumns = compound.length;

        // storage for compoundReaders needs to be initialized before making readers
        compoundReaders = new ArrayList<>();
        makeReaders();
    }

    /*
     * Format of the returned compound value from FV_CompoundPropertyReader
     * List of
     * FV_DataBinding
     *    - outputColumnName = <Compound reader column descriptor ex. IMAGE>
     *    - readPropertyValue -> List of        (each generated row )
     *                           FV_DataBinding - Row 0
     *                              - outputColumnName = <Compound reader column descriptor ex. IMAGE>
     *                              - readPropertyValue ->  List of
     *                                                      FV_DataBinding - Column-0
     *                                                         - outputColumnName = <Actual column 0 name>
     *                                                         - readPropertyValue = <column value>
     *                                                      .
     *                                                      .
     *                                                      .
     *                                                      FV_DataBinding - Column-N
     *                                                         - outputColumnName = <Actual column N name>
     *                                                         - readPropertyValue = <column value>
     *                           .
     *                           .
     *                           .
     *                           FV_DataBinding - Row M
     *                              - outputColumnName = <Compound reader column descriptor ex. IMAGE>
     *                              - readPropertyValue ->  List of
     *                                                      FV_DataBinding - Column-0
     *                                                        - outputColumnName = <Actual column 0 name>
     *                                                        - readPropertyValue = <column value>
     *
     *                                                      .
     *                                                      .
     *                                                      .
     *                                                      FV_DataBinding - Column-N
     *                                                         - outputColumnName = <Actual column N name>
     *                                                         - readPropertyValue = <column value>
     *
     *
     *
     *  Note: Because not all properties will produce values for a column in multiple rows
     *        where there is no value a blank representative is inserted for missing property value.
     *        Reminder of formatting will be concluded in FV_AbstractProducer where blank representatives
     *        will be inserted to match the longest column in the compound read data.
     *
    */


    /**
     * @param o - input object
     * @return list of read values
     */
    public List<FV_DataBinding> readPropertyFromObject(Object o)
    {
        DocumentModel doc = (DocumentModel) o;

        List<FV_DataBinding> compoundOutput = new ArrayList<>();

        try
        {
            Object obj = doc.getPropertyValue( propertyToRead );

            if( obj instanceof String[] )
            {
                String[] list = (String[]) obj; // list of object to be de-referenced

                if( list.length != 0) // checking if there are any present
                {
                     for( String guid : list )
                    {
                        DocumentModel refDoc = session.getDocument( new IdRef(guid) );

                        List<FV_DataBinding> output = new ArrayList<>();

                        if (refDoc == null) throw new Exception("FV_CompoundPropertyReader: Invalid document");

                        for (FV_AbstractPropertyReader prop : compoundReaders)
                        {
                            List<FV_DataBinding> listToAdd;

                            try
                            {
                                listToAdd = prop.readPropertyFromObject(refDoc);
                            }
                            catch (Exception e)
                            {
                                listToAdd = propertyDoesNotExist(prop.columnNameForOutput);
                            }

                            output.addAll(listToAdd);
                        }

                        compoundOutput.add( createCompoundProperty( columnNameForOutput, output ) );
                    }
                }
            }
        }
        catch( Exception e)
        {
            log.warn( e );
        }

        if( compoundOutput.size() == 0 )
        {
            compoundOutput.add( createCompoundProperty( columnNameForOutput, writeEmptyRow() ));
        }

        return createCompoundListOutput( columnNameForOutput, compoundOutput );
    }

    /**
     * @return string list of all (actual) column names for properties which are a part of compound
     */
    @Override
    public StringList getColumnNameForOutput()
    {
        if( columns != null ) return columns;

        columns = new StringList();

        for( FV_DataBinding p : compound )
        {
            columns.add( p.outputColumnName );
        }

        return columns;
    }

    /**
     * FV_CompoundPropertyReader has to generate its own list of readers
     */
    private void makeReaders()
    {
        if( compoundReaders.size() > 0 ) return;

        for ( FV_DataBinding pvc : compound )
        {
            try
            {
                ExportColumnRecord spec = specOwner.getSpec().getColumnExportRecord( pvc.getKey() );
                FV_AbstractPropertyReader instance = makePropertyReader(session, spec, specOwner );
                compoundReaders.add(instance);
            }
            catch ( Exception e )
            {
                e.printStackTrace();
            }
        }
    }

    // below are wrappers to prepare read property values for returning to producer
    private FV_DataBinding createCompoundProperty(String colName, List<FV_DataBinding> list )
    {
        return new FV_DataBinding( colName,list);
    }

    private List<FV_DataBinding> createCompoundListOutput(String colName, List<FV_DataBinding> list )
    {
        List<FV_DataBinding> compoundReturnOutput = new ArrayList<>();
        compoundReturnOutput.add( new FV_DataBinding( colName,list) );
        return compoundReturnOutput;
    }

}
