package ca.firstvoices.listeners;


import com.google.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.impl.EventListenerDescriptor;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.*;

import java.util.EventListener;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class } )
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy( {

        "org.nuxeo.ecm.platform",
        "org.nuxeo.ecm.platform.commandline.executor",
        "org.nuxeo.ecm.automation.scripting",
        "org.nuxeo.ecm.platform.web.common",
        "org.nuxeo.ecm.core.event",
        "FVUserRegistration:OSGI-INF/extensions/ca.firstvoices.listeners.xml"
})
@LocalDeploy( {
//        "org.nuxeo.ecm.platform.forum.core:OSGI-INF/forum-schemas-contrib.xml",
//        "org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",
//        "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
//        "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
//        "FVUserRegistration:OSGI-INF/extensions/fake-load-actions.xml",
//        "FVUserRegistration:OSGI-INF/extensions/fake-load-es-provider.xml",
//        "FVUserRegistration:OSGI-INF/extensions/fake-directory-sql-contrib.xml"
} )


public class RegistrationListenersTests
{
    // FVRegistrationTimeOutListener
    protected final List<String> timeOutEvent = Arrays.asList(    "checkRegistrationTimeout" );
    // FVRegistrationCompletionListener
    protected final List<String> completionEvent = Arrays.asList(    "invitationValidated",  "documentRemoved" );

    @Inject
    protected EventService eS;

    @Inject
    protected CoreSession session;


    @Before
    public void setUp() throws Exception
    {
        assertNotNull("Should have a valid event service", eS );
        assertNotNull("Should have a valid session", session );

        //session.save();
    }

    @Test
    public void listenerRegistration()
    {
        // loading a list of listeners as they are registered to inspect visually what was loaded
        // it is not required for the test
        // List eL = eS.getEventListeners(); // uncomment if you want to see what listeners are installed

        EventListenerDescriptor timeoutListener = eS.getEventListener("fvregistrationtimeoutlistener");
        assertNotNull("Should have a valid FVRegistrationTimeOutListener", timeoutListener);

        EventListenerDescriptor completionListener = eS.getEventListener("fvregistrationcompletionlistener");
        assertNotNull("Should have a valid FVRegistrationTimeOutListener", completionListener);

    }

    @Test
    public void listenerMessage()
    {
        EventListenerDescriptor timeoutListener = eS.getEventListener("fvregistrationtimeoutlistener");
        assertTrue(timeOutEvent.stream().allMatch( timeoutListener::acceptEvent));

        EventListenerDescriptor completionListener = eS.getEventListener("fvregistrationcompletionlistener");
        assertTrue(completionEvent.stream().allMatch( completionListener::acceptEvent));
    }
}