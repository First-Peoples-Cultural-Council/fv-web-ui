package ca.firstvoices.visibility.operations;


import static ca.firstvoices.lifecycle.Constants.DISABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.ENABLED_STATE;
import static ca.firstvoices.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.NEW_STATE;
import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.visibility.Constants.MEMBERS;
import static ca.firstvoices.visibility.Constants.PUBLIC;
import static ca.firstvoices.visibility.Constants.TEAM;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Assert;
import org.junit.Test;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import testUtil.AbstractFirstVoicesOperationsTest;

/**
 * @author david
 */
public class UpdateVisibilityOperationTest extends AbstractFirstVoicesOperationsTest {

  private final String VISIBILITY = "visibility";

  @Inject
  AutomationService service;

  @Inject
  FirstVoicesPublisherService firstVoicesPublisherService;

  private OperationContext ctx;


  @Test
  public void testNewToTeam() throws OperationException {
    Assert.assertEquals(NEW_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, TEAM);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(DISABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testNewToMembers() throws OperationException {
    Assert.assertEquals(NEW_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, MEMBERS);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(ENABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testTeamToMembers() throws OperationException {
    word.followTransition(DISABLE_TRANSITION);
    Assert.assertEquals(DISABLED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, MEMBERS);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(ENABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  public void testTeamToPublic() throws OperationException {
    word.followTransition(DISABLE_TRANSITION);
    Assert.assertEquals(DISABLED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, PUBLIC);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(PUBLISHED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testMembersToTeam() throws OperationException {
    word.followTransition(ENABLE_TRANSITION);
    Assert.assertEquals(ENABLED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, TEAM);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(DISABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testMembersToPublic() throws OperationException {
    dialect.followTransition(PUBLISH_TRANSITION);
    word.followTransition(ENABLE_TRANSITION);
    Assert.assertEquals(ENABLED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, PUBLIC);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(PUBLISHED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test(expected = NuxeoException.class)
  public void testToPublicOnUnpublishedDialect() throws OperationException {
    word.followTransition(ENABLE_TRANSITION);
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, PUBLIC);
    service.run(ctx, UpdateVisibilityOperation.ID, params);
  }

  @Test
  public void testPublicToTeam() throws OperationException {
    firstVoicesPublisherService.publishDialect(dialect);
    firstVoicesPublisherService.publish(word);
    Assert.assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, TEAM);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(DISABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testPublicToMembers() throws OperationException {
    firstVoicesPublisherService.publishDialect(dialect);
    firstVoicesPublisherService.publish(word);
    Assert.assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, MEMBERS);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(ENABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  public void testTeamToTeam() throws OperationException {
    word.followTransition(DISABLE_TRANSITION);
    Assert.assertEquals(DISABLED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, TEAM);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(DISABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testMembersToMembers() throws OperationException {
    word.followTransition(ENABLE_TRANSITION);
    Assert.assertEquals(ENABLED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, MEMBERS);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(ENABLED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testPublicToPublic() throws OperationException {
    dialect.followTransition(PUBLISH_TRANSITION);
    firstVoicesPublisherService.publish(word);
    Assert.assertEquals(PUBLISHED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, PUBLIC);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(PUBLISHED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test
  public void testPrivateToPublic() throws OperationException {
    word.followTransition(DISABLE_TRANSITION);
    dialect.followTransition(PUBLISH_TRANSITION);
    session.saveDocument(word);
    Assert.assertEquals(DISABLED_STATE, word.getCurrentLifeCycleState());
    ctx = new OperationContext(session);
    ctx.setInput(word);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, PUBLIC);
    DocumentModel returnDoc = (DocumentModel) service
        .run(ctx, UpdateVisibilityOperation.ID, params);

    Assert.assertEquals(PUBLISHED_STATE, returnDoc.getCurrentLifeCycleState());
  }

  @Test(expected = NuxeoException.class)
  public void testNonFvLifecycleDocument() throws OperationException {
    ctx = new OperationContext(session);
    ctx.setInput(domain);
    Map<String, String> params = new HashMap<>();
    params.put(VISIBILITY, PUBLIC);
    service.run(ctx, UpdateVisibilityOperation.ID, params);
  }
}
