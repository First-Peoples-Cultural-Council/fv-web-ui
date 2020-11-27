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

package ca.firstvoices.user;

import org.nuxeo.ecm.user.invite.UserRegistrationInfo;

public class FVUserRegistrationInfo extends UserRegistrationInfo {

  protected String requestedSpace;

  protected String preferences;

  protected String ageGroup;

  protected String role;

  protected Boolean languageTeamMember;

  protected Boolean communityMember;

  protected String comment;

  public FVUserRegistrationInfo() {
  }

  public String getPreferences() {
    return preferences;
  }

  public void setPreferences(String preferences) {
    this.preferences = preferences;
  }

  public String getRequestedSpace() {
    return requestedSpace;
  }

  public void setRequestedSpace(String requestedSpace) {
    this.documentId = requestedSpace;
    this.requestedSpace = requestedSpace;
  }

  public String getAgeGroup() {
    return ageGroup;
  }

  public void setAgeGroup(String ageGroup) {
    this.ageGroup = ageGroup;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public Boolean getLanguageTeamMember() {
    return languageTeamMember;
  }

  public void setLanguageTeamMember(Boolean languageTeamMember) {
    this.languageTeamMember = languageTeamMember;
  }

  public Boolean getCommunityMember() {
    return communityMember;
  }

  public void setCommunityMember(Boolean communityMember) {
    this.communityMember = communityMember;
  }
}
