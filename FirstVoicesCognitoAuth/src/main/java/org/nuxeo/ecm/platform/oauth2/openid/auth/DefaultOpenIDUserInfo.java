/*
 * (C) Copyright 2006-2013 Nuxeo SA (http://nuxeo.com/) and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *     Nelson Silva <nelson.silva@inevo.pt> - initial API and implementation
 *     Nuxeo
 */

package org.nuxeo.ecm.platform.oauth2.openid.auth;

import com.google.api.client.json.GenericJson;
import com.google.api.client.util.Key;
import java.util.Objects;

public class DefaultOpenIDUserInfo extends GenericJson implements CommonUserInfo {

  @Key("sub") protected String subject;

  @Override
  public String getSubject() {
    return subject;
  }


  @Override
  public boolean equals(final Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    if (!super.equals(o)) {
      return false;
    }
    final DefaultOpenIDUserInfo info = (DefaultOpenIDUserInfo) o;
    return Objects.equals(getName(), info.getName()) && Objects.equals(getEmail(), info.getEmail());
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), getName(), getEmail());
  }
}
