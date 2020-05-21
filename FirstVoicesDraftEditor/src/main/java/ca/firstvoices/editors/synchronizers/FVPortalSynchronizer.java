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

import static ca.firstvoices.editors.synchronizers.SynchronizerUtilities.handleListMapProperty;

public class FVPortalSynchronizer extends AbstractSynchronizer {

  /**
   * @param typeName
   * @param propertyPath
   */
  public void synchronizeFV(String typeName, String propertyPath) {
    switch (typeName) {
      case "fv_literal_translationListType":
      case "fv_definitionsListType":
        handleListMapProperty(draft, live, propertyPath, "language", "translation", auditTrail);
      default:
        synchronizeCommon(typeName, propertyPath);
    }
  }
}