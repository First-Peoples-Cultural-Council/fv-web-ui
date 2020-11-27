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

package ca.firstvoices.resetpassword.runner;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.core.api.NuxeoException;

public class StringHashGenerator {

  private static final byte[] SALT = "Hell0WorlDBr4nD".getBytes();

  public static String hashStrings(String... args) {
    byte[] txt = StringUtils.join(args, "-").getBytes();
    try {
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      md.update(SALT);
      byte[] bytes = md.digest(txt);
      StringBuilder sb = new StringBuilder();
      for (byte byteHolder : bytes) {
        sb.append(Integer.toString((byteHolder & 0xff) + 0x100, 16).substring(1));
      }
      return sb.toString();
    } catch (NoSuchAlgorithmException e) {
      throw new NuxeoException(e);
    }
  }

}
