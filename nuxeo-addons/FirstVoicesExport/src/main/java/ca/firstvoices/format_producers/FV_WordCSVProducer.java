package ca.firstvoices.format_producers;

/*
    Producer assembling output formatted as CSV.
*/

import ca.firstvoices.property_readers.*;
import ca.firstvoices.utils.*;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;

import java.io.FileWriter;
import java.io.IOException;

import java.util.List;

import static ca.firstvoices.utils.FVExportConstants.CSV_FORMAT;

public class FV_WordCSVProducer extends FV_AbstractProducer
{
    private FV_SimpleCSVWriter csvWriter;

    public FV_WordCSVProducer(CoreSession session, String fileName, StringList columns )
    {
        super( session, new FV_WordExportCSVColumns() );

        try
        {
            addReaders( columns );

            if( createTemporaryOutputFile( fileName, CSV_FORMAT ) )
            {
                csvWriter = new FV_SimpleCSVWriter(new FileWriter(outputFile));
            }
            else
            {
                throw new IOException( "FV_WordCSVProducer: error creating temporary file for export of " + fileName );
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    protected void writeLine( List<String> outputLine )
    {
        try
        {
            csvWriter.writeNext(outputLine );

            csvWriter.flush();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    protected void endProduction()
    {
        try
        {
            csvWriter.close();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    protected void createDefaultPropertyReaders()
    {
        //                                                               Binding spec for this producer                                Key to reader binding                   binding spec owner
        propertyReaders.add( new FV_PropertyReader( session,             spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.TITLE),                      this ) );
        propertyReaders.add( new FV_PartOfSpeechPropertyReader( session, spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.PART_OF_SPEECH_ID ),         this));
        propertyReaders.add( new FV_PropertyReader( session,             spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.PHONETIC_INFO ),             this));
        propertyReaders.add( new FV_WordTranslationReader( session,      spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION ), this));
        propertyReaders.add( new FV_WordTranslationReader( session,      spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.LITERAL_TRANSLATION ),       this));
        propertyReaders.add( new FV_CategoryPropertyReader( session,     spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.REALTED_PHRASE ),            this));
        propertyReaders.add( new FV_SimpleListPropertyReader( session,   spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.CULTURAL_NOTE ),             this));
        propertyReaders.add( new FV_CategoryPropertyReader( session,     spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.CATEGORIES ),                this));
        propertyReaders.add( new FV_PropertyReader( session,             spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.REFERENCE ),                 this));
        propertyReaders.add( new FV_BooleanPropertyReader( session,      spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.AVAILABLE_IN_CHILDRENS_ARCHIVE ), this));
        propertyReaders.add( new FV_BooleanPropertyReader( session,      spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.AVAILABLE_IN_GAMES ),        this));
        propertyReaders.add( new FV_PropertyReader( session,             spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.ASSIGNED_USR_ID ),           this));
        propertyReaders.add( new FV_PropertyReader( session,             spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.WORD_STATUS ),               this));
        propertyReaders.add( new FV_SimpleListPropertyReader( session,   spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.CONTRIBUTOR ),               this));
        propertyReaders.add( new FV_PropertyReader( session,             spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.CHANGE_DTTM ),               this));

        hasCompoundReaders = true; // have to set this flag manually as property readers are created manually
        propertyReaders.add( new FV_CompoundPropertyReader( session,     spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.IMAGE ),                     this ) );
        propertyReaders.add( new FV_CompoundPropertyReader( session,     spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.AUDIO ),                     this ) );
        propertyReaders.add( new FV_CompoundPropertyReader( session,     spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.VIDEO ),                     this ) );
    }
}
