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

package ca.firstvoices.export.utils;

import ca.firstvoices.export.propertyreaders.FVAbstractPropertyReader;
import ca.firstvoices.export.propertyreaders.FVDataBinding;
import java.util.List;

/*
 * ExportColumnRecord class binds list of values together to provide a concise record to describe
 * output and provide a reader to generate it
 *
 * This structure is used by FirstVoicesCSVExportColumns to
 * define bindings for properties in Phrases
 * and Words
 */
public class ExportColumnRecord {

  public final String colID;          // column label as received from UI to identify property
  public final String property;       // property string to retrieve value
  public final boolean useForExport;   // set to true if it is ready to be used for export
  public final int numCols;        // max number of columns we want to allow in csv
  public final Class<? extends FVAbstractPropertyReader> requiredPropertyReader;
  public final List<FVDataBinding> compound;

  ExportColumnRecord(
      String columnId, String prop, boolean ufe, Integer nc, Class<?
      extends FVAbstractPropertyReader> rpr, List<FVDataBinding> c) {
    colID = columnId;
    property = prop;
    useForExport = ufe;
    numCols = nc;
    requiredPropertyReader = rpr;
    compound = c;
  }

}
