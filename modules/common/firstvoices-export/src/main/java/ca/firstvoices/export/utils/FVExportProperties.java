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

import ca.firstvoices.export.propertyreaders.FVDataBinding;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class FVExportProperties {

  private FVExportProperties() {
  }

  public static final String LANGUAGE = "language"; // ??????
  // FVEXPORT:
  public static final String FVEXPORT_PROGRESS_STRING = "fvexport:progressString";
  public static final String FVEXPORT_PROGRESS_VALUE = "fvexport:progressValue";
  public static final String FVEXPORT_DIALECT = "fvexport:dialect";
  public static final String FVEXPORT_FORMAT = "fvexport:format";
  public static final String FVEXPORT_QUERY = "fvexport:query";
  public static final String FVEXPORT_COLUMNS = "fvexport:columns";
  public static final String FVEXPORT_WORK_DIGEST = "fvexport:workdigest";
  public static final String FVEXPORT_DIGEST = "fvexport:exportdigest";
  // FVA:
  public static final String FV_LANGUAGE = "fva:language";
  public static final String FV_DIALAECT = "fva:dialect";
  public static final String FV_FAMILY = "fva:family";
  // DC:
  public static final String TITLE = "dc:title";
  public static final String DESCR = "dc:description";
  public static final String LAST_CONTRIBUTOR = "dc:lastContributor";
  public static final String CREATOR = "dc:creator";
  public static final String CONTRIBUTORS = "dc:contributors";
  // FV:
  public static final String TRANSLATION = "fv:literal_translation";               // complex,
  // FirstVoicesWordTranslationReader
  public static final String CULTURAL_NOTE = "fv:cultural_note";                     // String[]
  public static final String PART_OF_SPEECH_ID = "fv-word:part_of_speech";
  public static final String PHONETIC_INFO = "fv-word:pronunciation";                // String
  public static final String REFERENCE = "fv:reference";
  public static final String AVAILABLE_IN_CHILDRENS_ARCHIVE = "fv:available_in_childrens_archive";
  // Boolean
  public static final String AVAILABLE_IN_GAMES = "fv-word:available_in_games";           //
  // Boolean
  public static final String CHILD_FOCUSED = "fv:child_focused";                     // Boolean
  public static final String DEFINITION = "fv:definitions";
  public static final String RELATED_PHRASES = "fv-word:related_phrases";
  public static final String WORD_CATEGORIES = "fv-word:categories";
  public static final String CONTRIBUTER = "fv:source";
  public static final String RELATED_VIDEOS = "fv:related_videos";
  public static final String RELATED_AUDIO = "fv:related_audio";
  public static final String RELATED_PICTURES = "fv:related_pictures";
  public static final String PHRASE_BOOKS = "fv-phrase:phrase_books";
  // FVL:
  public static final String MEDIA_STATUS = "fvl:status_id";
  public static final String IMPORT_ID = "fvl:import_id";
  public static final String STATUS_ID = "fvl:status_id";
  public static final String ASSIGNED_USR_ID = "fvl:assigned_usr_id";
  public static final String CHANGE_DTTM = "fvl:change_date";
  // FVM:
  public static final String MEDIA_SHARED = "fvm:shared";           // Boolean
  public static final String MEDIA_RECORDER = "fvm:recorder";         // String[]
  public static final String MEDIA_CHILD_FOCUSED = "fvm:child_focused";    // Boolean
  public static final String MEDIA_ORIGIN = "fvm:origin";           // String
  public static final String MEDIA_FILENAME = "file:filename";        // String
  public static final String IMAGE_COMPOUND = "fv:related_pictures";
  public static final String AUDIO_COMPOUND = "fv:related_audio";
  public static final String VIDEO_COMPOUND = "fv:related_videos";

  public static final List<FVDataBinding> imgCompoundA = Collections.unmodifiableList(Arrays.asList(
      new FVDataBinding(FVExportConstants.ExportCSVLabels.IMG_TITLE, TITLE),
      new FVDataBinding(FVExportConstants.ExportCSVLabels.IMG_FILENAME, MEDIA_FILENAME),
      new FVDataBinding(FVExportConstants.ExportCSVLabels.IMG_DESCRIPTION, DESCR),
      new FVDataBinding(FVExportConstants.ExportCSVLabels.IMG_SHARED_WITH_OTHER_DIALECTS,
          MEDIA_SHARED),
      new FVDataBinding(FVExportConstants.ExportCSVLabels.IMG_SOURCE, MEDIA_ORIGIN),
      new FVDataBinding(FVExportConstants.ExportCSVLabels.IMG_RECORDER, MEDIA_RECORDER),
      new FVDataBinding(FVExportConstants.ExportCSVLabels.IMG_CHILD_FOCUSED, MEDIA_CHILD_FOCUSED)));

  public static final List<FVDataBinding> audioCompoundA =
      Collections.unmodifiableList(Arrays.asList(new FVDataBinding(
              FVExportConstants.ExportCSVLabels.AUDIO_TITLE,
              TITLE),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.AUDIO_FILENAME, MEDIA_FILENAME),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.AUDIO_DESCRIPTION, DESCR),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.AUDIO_SHARED_WITH_OTHER_DIALECTS,
              MEDIA_SHARED),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.AUDIO_SOURCE, MEDIA_ORIGIN),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.AUDIO_RECORDER, MEDIA_RECORDER),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.AUDIO_CHILD_FOCUSED,
              MEDIA_CHILD_FOCUSED)));

  public static final List<FVDataBinding> videoCompoundA =
      Collections.unmodifiableList(Arrays.asList(new FVDataBinding(
              FVExportConstants.ExportCSVLabels.VIDEO_TITLE,
              TITLE),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.VIDEO_FILENAME, MEDIA_FILENAME),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.VIDEO_DESCRIPTION, DESCR),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.VIDEO_SHARED_WITH_OTHER_DIALECTS,
              MEDIA_SHARED),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.VIDEO_SOURCE, MEDIA_ORIGIN),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.VIDEO_RECORDER, MEDIA_RECORDER),
          new FVDataBinding(FVExportConstants.ExportCSVLabels.VIDEO_CHILD_FOCUSED,
              MEDIA_CHILD_FOCUSED)));

}
