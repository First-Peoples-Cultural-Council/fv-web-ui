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

/**
 * Update the references documents to proxied one on the proxy
 */

package ca.firstvoices.publisher.listeners;

import static ca.firstvoices.lifecycle.Constants.DISABLE_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.REPUBLISH_TRANSITION;
import static ca.firstvoices.lifecycle.Constants.UNPUBLISH_TRANSITION;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;
import static org.nuxeo.ecm.core.api.LifeCycleConstants.TRANSTION_EVENT_OPTION_FROM;
import static org.nuxeo.ecm.core.api.LifeCycleConstants.TRANSTION_EVENT_OPTION_TRANSITION;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

/**
 * @author loopingz
 */
public class ProxyPublisherListener implements EventListener {

  private static final Log log = LogFactory.getLog(ProxyPublisherListener.class);

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

    // Publish or unpublish depending on the transition,
    // the service filter depending on the document
    if (PUBLISH_TRANSITION.equals(transition)) {
      if (REPUBLISH_TRANSITION.equals(transitionFrom)) {
        service.republish(doc);
      } else {
        service.publish(doc);
      }

    } else if (UNPUBLISH_TRANSITION.equals(transition)
        || DISABLE_TRANSITION.equals(transition) && PUBLISHED_STATE.equals(transitionFrom)) {
      service.unpublish(doc);
    }

    // If re-publishing a dialect directly (no transition)
    if (FV_DIALECT.equals(doc.getType()) && PUBLISHED_STATE.equals(doc.getCurrentLifeCycleState())
        && doc.isProxy()) {
      service.setDialectProxies(doc);
    }
  }
}
