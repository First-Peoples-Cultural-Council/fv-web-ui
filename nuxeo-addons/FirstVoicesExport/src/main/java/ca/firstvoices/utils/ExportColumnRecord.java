package ca.firstvoices.utils;

import ca.firstvoices.property_readers.FV_DataBinding;

/*
 * ExportColumnRecord class binds list of values together to provide a concise record to describe
 * output and provide a reader to generate it
 *
 * This structure is used by FV_CSVExportColumns to define bindings for properties in Phrases and Words
 */
public class ExportColumnRecord
{
    public String                           colID;          // column label as received from UI to identify property
    public String                           property;       // property string to retrieve value
    public Boolean                          useForExport;   // set to true if it is ready to be used for export
    public Integer                          numCols;        // max number of columns we want to allow in csv
    public Class                            requiredPropertyReader;
    public FV_DataBinding compound[];

    ExportColumnRecord( String cID, String prop, Boolean ufe, Integer nc, Class rpr, FV_DataBinding[] c )
    {
        colID = cID;
        property = prop;
        useForExport = ufe;
        numCols = nc;
        requiredPropertyReader = rpr;
        compound = c;
    }

}
