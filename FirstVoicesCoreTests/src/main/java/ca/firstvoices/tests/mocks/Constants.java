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

package ca.firstvoices.tests.mocks;

public class Constants {

  //Should import most of these constants from FirstVoicesData when possible
  public static final String GROUP_NAME = "Mocks";
  public static final String FV_LANGUAGE = "FVLanguage";
  public static final String FV_LANGUAGE_FAMILY = "FVLanguageFamily";
  public static final String FV_DIALECT = "FVDialect";
  public static final String FV_CHARACTER = "FVCharacter";

  // Groups
  public static final String RECORDERS_GROUP = "recorders";
  public static final String RECORDERS_APPROVERS_GROUP = "recorders_with_approval";
  public static final String LANGUAGE_ADMINS_GROUP = "language_administrators";

  private Constants() {
    throw new IllegalStateException("Utility class");
  }
}
