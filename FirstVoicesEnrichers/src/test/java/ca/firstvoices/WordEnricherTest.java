package ca.firstvoices;

import org.nuxeo.ecm.core.api.CoreSession;
//import org.nuxeo.ecm.core.api.DocumentModel;
//import org.nuxeo.ecm.core.api.DocumentModelList;
import org.junit.Test;
import org.junit.Before;
import static org.junit.Assert.*;

//Other stuff needed here?

import javax.inject.Inject;
public class WordEnricherTest{

  @Inject
  protected CoreSession session;

  @Inject
  protected EnricherTestUtil testUtil;

  @Before
  public void setUpTest(){
    testUtil = new EnricherTestUtil();

    assertNotNull("Should have a valid session", session);
    assertNotNull("Should have a valid test utilities obj", testUtil);

    testUtil.createSetup(session);
  }

  @Test
  public void enricherTest() {
      
    int dummy = 1;
    assertNotNull(dummy);
  }
}