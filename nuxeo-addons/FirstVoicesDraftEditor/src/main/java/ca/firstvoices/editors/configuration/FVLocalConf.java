package ca.firstvoices.editors.configuration;

import org.nuxeo.ecm.core.api.localconfiguration.LocalConfiguration;

public interface FVLocalConf extends LocalConfiguration <FVLocalConf>{

    // NOTE: we are using some of the constants in FVDocumentValidationEventListener
    // if you change facet, property or original_uuid or draft_uuid .. they have to be modified there

    // TODO perhaps configuration should become its own modul so it can used anywhere?

    public static final String FV_CONFIGURATION_FACET = "FVLocalConf"; // inter-file dependent
    public static final String FV_CONFIGURATION_SCHEMA = "fvlocalconf";
    public static final String FV_CONFIGURATION_PARAMETERS_PROPERTY = "fvconf:fvconfparameters"; // inter-file dependent
    public static final String FV_CONFIGURATION_PARAMETER_KEY = "key";
    public static final String FV_CONFIGURATION_PARAMETER_VALUE = "value";
    public static final String LIVE_UUID_REF = "live-ref"; // inter-file dependent
    public static final String DRAFT_UUID_REF = "draft-ref"; // inter-file dependent

    String get(String var1);

    String get(String var1, String var2);

    String put(String var1, String var2);

    void remove( String var1 );

}
