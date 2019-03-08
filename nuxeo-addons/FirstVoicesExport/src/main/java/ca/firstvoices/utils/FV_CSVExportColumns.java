package ca.firstvoices.utils;

import java.util.HashMap;

/*
 * Binding class for connecting instructions from UI, to column names in export output to readers to be applied
 * during export
 */
public class FV_CSVExportColumns
{
    protected HashMap<String, ExportColumnRecord > columnRecordHashMap;

    protected FV_CSVExportColumns()
    {
        columnRecordHashMap = new HashMap<>();
    }

    public ExportColumnRecord getColumnExportRecord( String columnToExport )
    {
        return  columnRecordHashMap.get( columnToExport );
    }

    public HashMap<String, ExportColumnRecord > getColumnRecordHashMap()
    {
        return columnRecordHashMap;
    }
}
