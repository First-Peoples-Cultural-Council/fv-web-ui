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

package ca.firstvoices.export.propertyreaders;

import java.util.List;

/*
    FVDataBinding is a utility class which binds different properties/values together.
    It is used to bind property and column name in some cases and
    different data types to column name in other ones.

    In a nutshell it can be thought of as a basket carrying data around between different
    stages of creating of export file.

    Note: diagram of compound binding is included in FVCompoundPropertyReader file

*/
public class FVDataBinding {

  protected Object readPropertyValue;

  protected String outputColumnName;

  protected Object[] properties; // can be created as a duplicate of readPropertyValue to allow
  // indexed access

  public FVDataBinding(String ocn, Object rp) {
    readPropertyValue = rp;
    outputColumnName = ocn;
  }

  public Object getReadProperty() {
    return readPropertyValue;
  }

  public String getOutputColumnName() {
    return outputColumnName;
  }

  public String getKey() {
    return outputColumnName;
  }

  // used when payload is output from compound
  public int getNumberOfCompoundColumn() {
    if (isMultiLine()) {
      return ((List) readPropertyValue).size();
    }

    return 1;
  }

  public Object getColumnObject(int index) {
    if (!isMultiLine()) {
      return null;
    }

    if (properties == null) {
      properties = ((List) readPropertyValue).toArray();
    }

    if (properties.length > index) {
      return properties[index];
    }

    return null;
  }

  // will confirm if dealing with multi-line output from a compound property
  public boolean isMultiLine() {
    return readPropertyValue instanceof List;
  }

  public int outputLinesInProperty() {
    if (isMultiLine()) {
      return ((List) readPropertyValue).size();
    }

    return 1;
  }

  public Object getListOfColumnObjects() {
    if (isMultiLine()) {
      return readPropertyValue;
    }

    return null;
  }
}
