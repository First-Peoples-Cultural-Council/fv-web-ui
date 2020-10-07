/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.publisher.listeners;

import static ca.firstvoices.data.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_STATE;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.UNPUBLISH_TRANSITION;
import static org.nuxeo.ecm.core.api.LifeCycleConstants.TRANSTION_EVENT_OPTION_FROM;
import static org.nuxeo.ecm.core.api.LifeCycleConstants.TRANSTION_EVENT_OPTION_TRANSITION;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;


/**
 * Listener handles publishing, un-publishing and republishing of Workspace documents
 * After a workflow transition is made, proxies will be created for Workspace
 * documents in sections, via the publisher service.
 */
public class ProxyPublisherListener implements EventListener {

  protected FirstVoicesPublisherService service = Framework
      .getService(FirstVoicesPublisherService.class);

  @Override
  public void handleEvent(Event event) {
    EventContext ctx = event.getContext();
    if (!(ctx instanceof DocumentEventContext)) {
      return;
    }
    DocumentModel doc = ((DocumentEventContext) ctx).getSourceDocument();
    if (doc == null) {
      return;
    }
    String transition = (String) ctx.getProperties().get(TRANSTION_EVENT_OPTION_TRANSITION);
    String transitionFrom = (String) ctx.getProperties().get(TRANSTION_EVENT_OPTION_FROM);

    if (isPublishing(transition, transitionFrom)) {
      service.publish(doc);
    } else if (isRepublishing(transition, transitionFrom)) {
      service.doRepublish(doc);
    } else if (isUnpublishing(transition, transitionFrom)) {
      service.unpublish(doc);
    }
  }

  /**
   * Document is moving from a state other than REPUBLISHED, to public. Proxies need to be created
   * @param transition transition event requested
   * @param transitionFrom state that the document is transitioning from (i.e. current state)
   */
  private boolean isPublishing(String transition, String transitionFrom) {
    return PUBLISH_TRANSITION.equals(transition) && !REPUBLISH_STATE.equals(transitionFrom);
  }

  /**
   * Document is already in PUBLISHED state, but needs changes to be applied to proxies
   */
  private boolean isRepublishing(String transition, String transitionFrom) {
    return REPUBLISH_TRANSITION.equals(transition) && PUBLISHED_STATE.equals(transitionFrom);
  }

  /**
   * Document is in PUBLISHED state, and need proxies to be removed
   */
  private boolean isUnpublishing(String transition, String transitionFrom) {
    return (UNPUBLISH_TRANSITION.equals(transition)
        || DISABLE_TRANSITION.equals(transition) && PUBLISHED_STATE.equals(transitionFrom));
  }
}
