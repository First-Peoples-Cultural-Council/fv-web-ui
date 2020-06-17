package ca.firstvoices.visibility.services;

import static ca.firstvoices.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.NEW_STATE;
import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.visibility.Constants.MEMBERS;
import static ca.firstvoices.visibility.Constants.PUBLIC;
import static ca.firstvoices.visibility.Constants.TEAM;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.security.InvalidParameterException;
import javax.inject.Inject;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import testUtil.AbstractFirstVoicesOperationsTest;

/**
 * @author david
 */
public class UpdateVisibilityServiceTest extends AbstractFirstVoicesOperationsTest {

  @Inject
  FirstVoicesPublisherService firstVoicesPublisherService;

  @Inject
  UpdateVisibilityService updateVisibilityService;

  @Test
  public void testNewToTeam() {
    Assert.assertEquals(NEW_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, TEAM);
    Assert.assertEquals(DISABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testNewToMembers() {
    Assert.assertEquals(NEW_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, MEMBERS);
    Assert.assertEquals(ENABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testTeamToMembers() {
    word.followTransition(DISABLE_TRANSITION);
    Assert.assertEquals(DISABLED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, MEMBERS);
    Assert.assertEquals(ENABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  public void testTeamToPublic() {
    word.followTransition(DISABLE_TRANSITION);
    Assert.assertEquals(DISABLED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, PUBLIC);
    Assert.assertEquals(PUBLISHED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testMembersToTeam() {
    word.followTransition(ENABLE_TRANSITION);
    Assert.assertEquals(ENABLED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, TEAM);
    Assert.assertEquals(DISABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testMembersToPublic() {
    firstVoicesPublisherService.publishDialect(dialect);
    word.followTransition(ENABLE_TRANSITION);
    Assert.assertEquals(ENABLED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, PUBLIC);
    Assert.assertEquals(PUBLISHED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test(expected = InvalidParameterException.class)
  public void testToPublicOnUnpublishedDialect() {
    word.followTransition(ENABLE_TRANSITION);
    updateVisibilityService.updateVisibility(word, PUBLIC);
  }

  @Test
  public void testPublicToTeam() {
    firstVoicesPublisherService.publishDialect(dialect);
    firstVoicesPublisherService.publish(word);
    Assert.assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, TEAM);
    Assert.assertEquals(DISABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testPublicToMembers() {
    firstVoicesPublisherService.publishDialect(dialect);
    firstVoicesPublisherService.publish(word);
    Assert.assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, MEMBERS);
    Assert.assertEquals(ENABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  public void testTeamToTeam() {
    word.followTransition(DISABLE_TRANSITION);
    Assert.assertEquals(DISABLED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, TEAM);
    Assert.assertEquals(DISABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testMembersToMembers() {
    word.followTransition(ENABLE_TRANSITION);
    Assert.assertEquals(ENABLED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, MEMBERS);
    Assert.assertEquals(ENABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testPublicToPublic() {
    firstVoicesPublisherService.publishDialect(dialect);
    firstVoicesPublisherService.publish(word);
    Assert.assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, PUBLIC);
    Assert.assertEquals(PUBLISHED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test(expected = NuxeoException.class)
  public void testNonFvLifecycleDocument() {
    updateVisibilityService.updateVisibility(domain, PUBLIC);
  }
}
