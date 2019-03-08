package ca.firstvoices.operations;

import ca.firstvoices.utils.ExportColumnRecord;
import ca.firstvoices.utils.FV_PhraseExportCSVColumns;
import ca.firstvoices.utils.FV_WordExportCSVColumns;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.HashMap;

import static ca.firstvoices.utils.FVExportConstants.*;

@Operation(id= FVSupportedExportColumns.ID, category= Constants.CAT_DOCUMENT, label="Get list of supported export columns.", description="Returns supported column labels in export to CSV or PDF. ")
public class FVSupportedExportColumns
{

    public static final String ID = "Document.FVSupportedExportColumns";

    @Param( name = "format", values = {CSV_FORMAT, PDF_FORMAT} )
    protected String format = CSV_FORMAT;

    @Param( name = "exportElement", values = { FVWORD, FVPHRASE} )
    protected String exportElement = FVPHRASE;


    /**
     * @return - list of strings with names of columns which can be used to specify columns for export
     */
    @OperationMethod
    public StringList run()
    {
        if( format.equals("PDF")) return null;

        StringList returnList;

        if( exportElement.equals(FVWORD) )
        {
            returnList = supportedWordQueries_CSV();
        }
        else
        {
            returnList = supprtedPhraseQueries_CSV();
        }

        return returnList;
    }

    private StringList supportedWordQueries_CSV()
    {
        FV_WordExportCSVColumns wc = new FV_WordExportCSVColumns();

        return getValidExportColumns(  wc.getColumnRecordHashMap() );
    }

    private StringList supprtedPhraseQueries_CSV()
    {
        FV_PhraseExportCSVColumns pc = new FV_PhraseExportCSVColumns();

        return getValidExportColumns(  pc.getColumnRecordHashMap() );
    }

    private StringList getValidExportColumns(  HashMap<String, ExportColumnRecord> map )
    {
        StringList list = new StringList();

        for ( String k : map.keySet() )
        {
            if( map.get( k ).useForExport )
            {
                list.add( k );
            }
        }

        return list;
    }

}
