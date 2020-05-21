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

import static ca.firstvoices.editors.synchronizers.SynchronizerUtilities.handleStringListProperty;
import static ca.firstvoices.editors.synchronizers.SynchronizerUtilities.makeAuditKey;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.schema.types.Type;

public abstract class AbstractSynchronizer {

  private static final Log log = LogFactory.getLog(AbstractSynchronizer.class);
  protected Map<String, String> auditTrail = null;
  protected DocumentModel draft = null;
  protected DocumentModel live = null;

  /**
   * Initializer for synchronization process (can synchronize either draft into live or live into
   * draft if needed) (but most common use will be synchronization of draft into live document)
   *
   * @param srcDoc  - draft document
   * @param destDoc - live document
   * @return true - if synchronization is initialized correctly
   */
  public boolean initialize(DocumentModel srcDoc, DocumentModel destDoc) {
    auditTrail = new HashMap<String, String>();
    draft = srcDoc;
    live = destDoc;

    // should we also check if both have reverse reference?
    return srcDoc != null && destDoc != null && srcDoc.getType().equals(destDoc.getType());
  }

  /**
   * Main method which has to be implemented for individual synchronizers. (a bit of overkill but
   * gives a lot of flexibility without any cost)
   *
   * @param typeName
   * @param propertyPath
   */
  public abstract void synchronizeFV(String typeName, String propertyPath);

  /**
   * Main driver of synchronization process
   */
  public void synchronize() {
    List<String> draftProperties = getPropertiesXPath(draft);

    for (String propertyPath : draftProperties) {
      Type draftPropertyType = draft.getProperty(propertyPath).getType();
      String typeName = draftPropertyType.getName();

      synchronizeFV(typeName, propertyPath);
    }
  }

  /**
   * Synchronizes common between documents types of propertyPaths
   *
   * @param typeName
   * @param propertyPath
   */
  protected void synchronizeCommon(String typeName, String propertyPath) {
    try {
      switch (typeName) {
        case "string":
          String sp = (String) draft.getPropertyValue(propertyPath);
          if (sp != null && !sp.equals(live.getPropertyValue(propertyPath))) {
            live.setPropertyValue(propertyPath, sp);
            auditTrail.put(makeAuditKey(live, propertyPath), "Replaced with " + sp);
          }
          break;

        case "stringList":
          handleStringListProperty(draft, live, propertyPath, auditTrail);
          break;

        case "boolean":
          Boolean bp = (Boolean) draft.getPropertyValue(propertyPath);
          if (bp != null && bp != (Boolean) live.getPropertyValue(propertyPath)) {
            live.setPropertyValue(propertyPath, bp);
            auditTrail.put(makeAuditKey(live, propertyPath), "Replaced with " + bp);
          }
          break;
        case "fvconfparameters":
          // if we want to log anything about paramters NOTE: fvconfparameters are currently
          // skipped
          break;

        default:
          auditTrail
              .put(makeAuditKey(live, propertyPath), "ERROR: Not synchronized type: " + typeName);
          throw new Exception("Not synchronized type " + typeName);
      }
    } catch (Exception e) {
      log.warn("ERROR: Type not present in AbstractSynchronizer:synchronizeCommon - " + e);
    }
  }

  /**
   * Skip partNames we do not want to synchronize This is the method to add conditions on which
   * document parts need to be considered
   *
   * @param docPartName - partName to skip
   * @return
   */
  private boolean skipPartName(String docPartName) {
    // NOTE: "fvlocalconf" can be removed from here if we want to log any information about them
    return docPartName.contains("fvlocalconf") || docPartName.contains("fvancestry") || docPartName
        .contains("fvlegacy") || (!docPartName.startsWith("fv") && !docPartName
        .startsWith("dublincore"));
  }

  /**
   * Skip partName with specific fieldName from synchronization This is needed to pass doublincore
   * values but we are only interested in title holding NAME of the document.
   *
   * @param docPartName - partName to skip
   * @param fieldName   - filed to skip
   * @return
   */
  private boolean skipPartNameWithFiled(String docPartName, String fieldName) {
    return docPartName.startsWith("dublincore") && !fieldName.contains("title");
  }

  /**
   * @return
   */
  public Map<String, String> getAuditTrail() {
    return auditTrail;
  }

  /**
   * Produce a list of paths which will be used to synchronize draft and live docuemnts
   *
   * @param doc - source to generate property paths from
   * @return - list of paths  to synchronize
   */
  protected List<String> getPropertiesXPath(DocumentModel doc) {
    List<String> propertiesName = new ArrayList<String>();
    DocumentPart[] docParts = doc.getParts();

    for (DocumentPart docPart : docParts) {
      Collection<Property> children = docPart.getChildren();
      String docPartName = docPart.getName();

      if (skipPartName(docPartName)) {
        continue;
      }

      for (Property property : children) {
        String fieldName = property.getField().getName().getPrefixedName();

        if (skipPartNameWithFiled(docPartName, fieldName)) {
          continue;
        }

        propertiesName.add(fieldName); // docPartName + ":" +
        //                } else {
        //                    continue;
        //                    List<Property> childrenProperties = addChildrenProperties
        //                    (property, new ArrayList<Property>());
        //
        //                    for (Property cProperty : childrenProperties) {
        //                        propertiesName.add(docPartName + ":" + cProperty.getPath()
        //                        .substring(1));
        //                    }
        //                }
      }
    }

    return propertiesName;
  }

  /**
   * Unused part of the path generation. Left just in case. Would be triggered by code comemnted out
   * in getPropertiesXPath
   *
   * @param property
   * @param properties
   * @return
   */
  protected List<Property> addChildrenProperties(Property property, List<Property> properties) {

    if (!property.isContainer()) {
      properties.add(property);

      return properties;
    } else {
      Collection<Property> children = property.getChildren();

      for (Property child : children) {
        properties = addChildrenProperties(child, properties);
      }

      return properties;
    }
  }
}
