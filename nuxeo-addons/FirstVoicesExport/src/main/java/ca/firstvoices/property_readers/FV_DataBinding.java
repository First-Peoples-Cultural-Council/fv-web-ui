package ca.firstvoices.property_readers;

import org.nuxeo.ecm.automation.core.util.StringList;

import java.lang.reflect.Array;
import java.util.List;

/*
    FV_DataBinding is a utility class which binds different properties/values together.
    It is used to bind property and column name in some cases and
    different data types to column name in other ones.

    In a nutshell it can be thought of as a basket carrying data around between different
    stages of creating of export file.

    Note: diagram of compound binding is included in FV_CompoundPropertyReader file

*/
public class FV_DataBinding
{
    protected Object    readPropertyValue;
    protected String    outputColumnName;
    protected Object[]  properties;          // can be created as a duplicate of readPropertyValue to allow
                                             // indexed access

    public FV_DataBinding(String ocn, Object rp )
    {
        readPropertyValue = rp;
        outputColumnName = ocn;
    }

    public Object getReadProperty() { return readPropertyValue; }
    public String getOutputColumnName() { return outputColumnName; }
    public String getKey() {  return outputColumnName; }

    // used when payload is output from compound
    public int getNumberOfCompoundColumn()
    {
        if( isMultiLine() )
        {
            return ((List) readPropertyValue).size();
        }

        return 1;
    }

    public Object getColumnObject( int index )
    {
        if( !isMultiLine() ) return null;

        if( properties == null )
        {
            properties = ((List)readPropertyValue).toArray();
        }

        if( properties.length > index )
        {
            return properties[index];
        }

        return null;
    }

    // will confirm if dealing with multi-line output from a compound property
    public Boolean isMultiLine()
    {
        return readPropertyValue instanceof List;
    }

    public int outputLinesInProperty()
    {
        if( isMultiLine() )
        {
            return ((List)readPropertyValue).size();
        }

        return 1;
    }

    public Object getListOfColumnObjects()
    {
        if( isMultiLine() )
        {
            return readPropertyValue;
        }

        return null;
    }
}
