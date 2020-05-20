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

package ca.firstvoices.editors.configuration;

import org.nuxeo.ecm.core.api.localconfiguration.LocalConfiguration;

public interface FVLocalConf extends LocalConfiguration<FVLocalConf> {

  // NOTE: we are using some of the constants in FVDocumentValidationEventListener
  // if you change facet, property or original_uuid or draft_uuid .. they have to be modified there

  // TODO perhaps configuration should become its own modul so it can used anywhere?

  public static final String FV_CONFIGURATION_FACET = "FVLocalConf"; // inter-file dependent
  public static final String FV_CONFIGURATION_SCHEMA = "fvlocalconf";
  public static final String FV_CONFIGURATION_PARAMETERS_PROPERTY = "fvconf:fvconfparameters";
  // inter-file dependent
  public static final String FV_CONFIGURATION_PARAMETER_KEY = "key";
  public static final String FV_CONFIGURATION_PARAMETER_VALUE = "value";
  public static final String LIVE_UUID_REF = "live-ref"; // inter-file dependent
  public static final String DRAFT_UUID_REF = "draft-ref"; // inter-file dependent

  String get(String var1);

  String get(String var1, String var2);

  String put(String var1, String var2);

  void remove(String var1);

}
