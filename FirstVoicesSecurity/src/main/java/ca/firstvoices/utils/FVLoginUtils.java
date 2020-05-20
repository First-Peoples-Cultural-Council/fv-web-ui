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

package ca.firstvoices.utils;

import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.platform.ui.web.rest.RestHelper;
import org.nuxeo.runtime.api.Framework;

public class FVLoginUtils {

  // this is configured with a property to be set easily in nuxeo.conf in different envs
  static String fvContextPath = Framework.getProperty("fv.contextPath", "app");

  public static String getBaseURL(RestHelper restHelper) {
    return removeNuxeoFromPath(restHelper.getBaseURL(), restHelper.getContextPath());
  }

  public static String removeNuxeoFromPath(String baseUrl, String contextPath) {
    // if we don't serve /app we don't need /nuxeo in the url either
    if (StringUtils.isEmpty(fvContextPath)) {
      baseUrl = baseUrl.replaceAll(contextPath, "");
    }

    return baseUrl;
  }
}
