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

import static org.nuxeo.ecm.platform.usermanager.UserConfig.SCHEMA_NAME;

public class FVRegistrationConstants {

  // Registration process ACTIONS constants - NOT timeouts
  public static final int MID_REGISTRATION_PERIOD_ACT = 1;

  public static final int REGISTRATION_DELETION_ACT = 3;
  // constants for validating registration attempt
  public static final int REGISTRATION_CAN_PROCEED = 0;
  public static final int EMAIL_EXISTS_ERROR = 1;
  public static final int LOGIN_EXISTS_ERROR = 2;
  public static final int LOGIN_AND_EMAIL_EXIST_ERROR = 3;
  public static final int REGISTRATION_EXISTS_ERROR = 4;
  // constants for Group and User update operations
  public static final String APPEND = "append";
  public static final String UPDATE = "update";
  public static final String REMOVE = "remove";
  public static final int MID_REGISTRATION_PERIOD_IN_DAYS = 10;
  public static final int REGISTRATION_DELETION_IN_DAYS = 31;
  public static final String GROUP_SCHEMA = "group";
  public static final String GROUP_COLON = GROUP_SCHEMA + ':';
  public static final String USER_COLON = SCHEMA_NAME + ':';
  public static final String GROUP_NAME = "groupname";
  public static final String GROUP_LABEL = "grouplabel";
  public static final String GROUP_DESCRIPTION = "description";
  public static final String MEMBERS = "members";
  public static final String SUB_GROUPS = "subGroups";
  public static final String PARENT_GROUPS = "parentGroups";
  // events
  public static final String LADMIN_APPROVED_GROUP_CHANGE =
      "newUserApprovedByLanguageAdministrator";
  public static final String SYSTEM_APPROVED_GROUP_CHANGE = "newUserApprovedBySystem";
  public static final String INVITATION_VALIDATED = "invitationValidated";
  public static final String CHECK_REGISTRATION_TIMEOUT_EVENT_NAME = "checkRegistrationTimeout";
  public static final String GROUP_NAME_ARG = "groupName";
  public static final String USER_NAME_ARG = "userName";
  public static final String GROUP_CHANGE_ARGS = "groupChangeArgs";

  private FVRegistrationConstants() {
    throw new IllegalStateException("Utility class");
  }
}
