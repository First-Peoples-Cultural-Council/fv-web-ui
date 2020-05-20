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

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;

public class SynchronizerUtilities {

  private static final Log log = LogFactory.getLog(SynchronizerFactory.class);

  /**
   * @param draft
   * @param live
   * @param property
   * @param auditTrail
   */
  public static void handleListMapProperty(DocumentModel draft, DocumentModel live, String property,
      String key, String value, Map<String, String> auditTrail) {
    List<Map<String, String>> draftPropertyList = (List<Map<String, String>>) draft
        .getPropertyValue(property);
    //List<Map<String, String>> sourcePropertyList = (List<Map<String, String>>)live
    // .getPropertyValue(property);

    // TODO for now lets just copy new content from draft to a live document
    //      we can worry about more sophisticated method later
    live.setPropertyValue(property, (Serializable) draftPropertyList);
    auditTrail.put(makeAuditKey(live, property),
        "replaced with " + draftPropertyList.size() + " objects.");
  }

  /**
   * @param draft
   * @param live
   * @param property
   * @param auditTrail
   */
  public static void handleStringListProperty(DocumentModel draft, DocumentModel live,
      String property, Map<String, String> auditTrail) {
    try {
      switch (property) {
        case "fv:related_pictures":
        case "fv:related_videos":
        case "fv:related_audio":
        case "fv-word:categories":
        case "fv-word:related_phrases":
        case "fv:cultural_note":
        case "fv:custom_order":
        case "fv:source":
        case "fv_portal:related_links":
        case "fv_portal:featured_words":
        case "fvcore:source":
        case "fvbook:author":
        case "fvcore:related_audio":
        case "fvcore:related_pictures":
        case "fvcore:related_videos":
        case "fv-phrase:phrase_books":
        case "fv-portal:featured_words":
        case "fv-portal:featured_audio":
        case "fv-portal:related_links":
          String[] draftUuids = (String[]) draft.getPropertyValue(property);
          String[] liveUuids = (String[]) live.getPropertyValue(property);
          // just copy values for now
          live.setPropertyValue(property, draft.getPropertyValue(property));

          if (draftUuids.length == 0) {
            if (liveUuids.length == 0) {
              return;
            }
            auditTrail.put(makeAuditKey(live, property), "Set to empty");
          } else {
            addListValuesToAuditTrail(live, property, draftUuids, auditTrail);
          }
          break;

        default:
          auditTrail.put(makeAuditKey(live, property), "Error: Not synchronized property");
          // unhandled property
          throw new Exception("Not synchronized property " + property);
      }
    } catch (Exception e) {
      log.warn(
          "UNKNOWN property type draft uuid " + draft.getId() + " live uuid " + live.getId() + "  "
              + e);
    }
  }

  /**
   * @param liveDoc
   * @param property
   * @return
   */
  public static String makeAuditKey(DocumentModel liveDoc, String property) {
    return "uuid: " + liveDoc.getId() + " type: " + liveDoc.getType() + " : " + property;
  }

  /**
   * @param liveDoc
   * @param property
   * @param list
   * @param auditTrail
   */
  private static void addListValuesToAuditTrail(DocumentModel liveDoc, String property,
      String[] list, Map<String, String> auditTrail) {
    int i = 0;
    for (String s : list) {
      auditTrail.put(makeAuditKey(liveDoc, property + "[" + i + "]"), "Replaced with " + s);
      i++;
    }
  }
}
