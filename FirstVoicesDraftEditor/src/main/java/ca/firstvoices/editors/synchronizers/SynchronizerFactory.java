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

package ca.firstvoices.editors.synchronizers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;

/**
 *
 */
public class SynchronizerFactory {

  private static final Log log = LogFactory.getLog(SynchronizerFactory.class);

  /**
   * @param - src document in synchronizing session
   * @return AbstractSynchronizer - synchronizer corresponding to FV document type null - this is a
   * type with a missing synchronizer
   */
  public static AbstractSynchronizer produceSynchronizer(DocumentModel src) {

    try {
      switch (src.getType()) {
        case "FVBook":
          return new FVBookSynchronizer();

        case "FVCharacter":
          return new FVCharacterSynchronizer();

        case "FVDialect":
          return new FVDialectSynchronizer();

        case "FVGallery":
          return new FVGallerySynchronizer();

        case "FVVideo":
        case "FVPicture":
        case "FVAudio":
          return new FVMediaSynchronizer();

        case "FVPhrase":
          return new FVPhraseSynchronizer();

        case "FVPortal":
          return new FVPortalSynchronizer();

        case "FVWord":
          return new FVWordSynchronizer();

        default:
          throw new Exception("Unhandled FV type + " + src.getType());
      }
    } catch (Exception e) {
      log.warn("UNKNOWN: " + e);
    }

    return null;
  }
}
