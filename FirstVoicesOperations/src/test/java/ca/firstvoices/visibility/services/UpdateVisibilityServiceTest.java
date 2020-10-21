package ca.firstvoices.visibility.services;

import static ca.firstvoices.data.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.MEMBERS;
import static ca.firstvoices.data.lifecycle.Constants.NEW_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLIC;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_STATE;
import static ca.firstvoices.data.lifecycle.Constants.TEAM;

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
  public void testNewToPublic() {
    dialect.followTransition(PUBLISH_TRANSITION);
    Assert.assertEquals(NEW_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, PUBLIC);
    Assert.assertEquals(PUBLISHED_STATE, returnDoc.getCurrentLifeCycleState());
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
    dialect.followTransition(PUBLISH_TRANSITION);
    word.followTransition(ENABLE_TRANSITION);
    Assert.assertEquals(ENABLED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, PUBLIC);
    Assert.assertEquals(PUBLISHED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testToPublicOnUnpublishedDialect() {
    try {
      word.followTransition(ENABLE_TRANSITION);
      Assert.assertEquals(ENABLED_STATE, word.getCurrentLifeCycleState());
      updateVisibilityService.updateVisibility(word, PUBLIC);
    } catch (NuxeoException exception) {
      Assert.assertNotNull(exception);
    }
  }

  @Test
  public void testPublicToTeam() {
    dialect.followTransition(PUBLISH_TRANSITION);
    word.followTransition(PUBLISH_TRANSITION);
    Assert.assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, TEAM);
    Assert.assertEquals(DISABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testPublicToMembers() {
    dialect.followTransition(PUBLISH_TRANSITION);
    word.followTransition(PUBLISH_TRANSITION);
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
    dialect.followTransition(PUBLISH_TRANSITION);
    word.followTransition(PUBLISH_TRANSITION);
    Assert.assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());
    DocumentModel returnDoc = updateVisibilityService.updateVisibility(word, PUBLIC);
    Assert.assertEquals(REPUBLISH_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test(expected = NuxeoException.class)
  public void testNonFvLifecycleDocument() {
    updateVisibilityService.updateVisibility(domain, PUBLIC);
  }
}
