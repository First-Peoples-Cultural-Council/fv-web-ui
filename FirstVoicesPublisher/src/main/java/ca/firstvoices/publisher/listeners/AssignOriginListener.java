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

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PHRASE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

/**
 * Update the references documents to proxied one on the proxy Listener assigning origin document
 * (Word/Phrase) to a media item (Photos, Videos, Audio) created within that word.
 *
 * @author dyona
 */
public class AssignOriginListener implements EventListener {

  private void saveOrigin(DocumentModel doc, String[] relatedMedia) {
    CoreSession session = doc.getCoreSession();

    if (relatedMedia == null) {
      return;
    }
    for (String relatedMediaItem : relatedMedia) {
      DocumentModel mediaDoc = session.getDocument(new IdRef(relatedMediaItem));
      String currentOrigin = (String) mediaDoc.getPropertyValue("fvm:origin");
      String currentDocDialect = (String) doc.getPropertyValue("fvancestry:dialect");
      String currentMediaDialect = (String) mediaDoc.getPropertyValue("fvancestry:dialect");

      if (currentOrigin == null && (currentMediaDialect != null && currentMediaDialect
          .equals(currentDocDialect))) {
        mediaDoc.setPropertyValue("fvm:origin", doc.getId());
        session.saveDocument(mediaDoc);
      }
    }
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

    if (doc.getType().equals(FV_WORD) || doc.getType().equals(FV_PHRASE)) {
      String[] relatedPictures = (String[]) doc.getPropertyValue("fvcore:related_pictures");
      String[] relatedAudio = (String[]) doc.getPropertyValue("fvcore:related_audio");
      String[] relatedVideos = (String[]) doc.getPropertyValue("fvcore:related_videos");

      saveOrigin(doc, relatedPictures);
      saveOrigin(doc, relatedAudio);
      saveOrigin(doc, relatedVideos);
    }
  }
}
