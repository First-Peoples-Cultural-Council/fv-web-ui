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

package ca.firstvoices.nativeorder.listeners;
/**
 * Compute asset custom order when asset (Word/Phrase) modified or created.
 */

import static ca.firstvoices.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;
import java.util.Iterator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

/**
 * @author dyona
 */
public class ComputeNativeOrderListener implements EventListener {

  private static final Log log = LogFactory.getLog(ComputeNativeOrderListener.class);

  protected NativeOrderComputeService service = Framework
      .getService(NativeOrderComputeService.class);

  /**
   * Checks if title was modified, but not custom order
   *
   * @return
   */
  private Boolean titleModifiedButNotCustomOrder(DocumentModel doc) {

    int found = 0;

    Boolean titleModified = false;
    Boolean customOrderModified = false;

    DocumentPart[] docParts = doc.getParts();
    for (DocumentPart docPart : docParts) {
      Iterator<Property> dirtyChildrenIterator = docPart.getDirtyChildren();

      while (dirtyChildrenIterator.hasNext()) {
        Property property = dirtyChildrenIterator.next();
        String propertyName = property.getField().getName().toString();

        if (propertyName.equals("dc:title") && property.isDirty()) {
          titleModified = true;
          ++found;
        }

        if (propertyName.equals("fv:custom_order") && property.isDirty()) {
          customOrderModified = true;
          ++found;
        }

        // No need to keep checking
        if (found == 2) {
          break;
        }
      }
    }

    return (titleModified && !customOrderModified);
  }

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

    // Skip proxies and versions
    if (doc.isProxy() || doc.isVersion()) {
      return;
    }

    // Handle language assets (Words and Phrases)
    if ((doc.getType().equals(FV_WORD) || doc.getType().equals(FV_PHRASE))) {

      switch (event.getName()) {

        // Creation
        case DocumentEventTypes.DOCUMENT_CREATED:
          service.computeAssetNativeOrderTranslation(ctx.getCoreSession(), doc);
          break;

        // Modification
        case DocumentEventTypes.BEFORE_DOC_UPDATE:
          if (titleModifiedButNotCustomOrder(doc)) {
            service.computeAssetNativeOrderTranslation(ctx.getCoreSession(), doc);
          }
          break;
        default:
          break;
      }
    }
  }
}
