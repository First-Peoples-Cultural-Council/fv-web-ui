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

public final class FVExportConstants {

  public static final long MILLISECONDS = 1000;

  // support for FVSupportedExportColumns endpoint
  public static final String FVWORD = "FVWord";
  public static final String FVPHRASE = "FVPhrase";

  // Events sent to trigger start of export workers
  public static final String PRODUCE_FORMATTED_DOCUMENT = "produceFormattedDocument";       //
  // start of worker by user action
  public static final String FINISH_EXPORT_BY_WRAPPING_BLOB = "produceWrappedBlob";
  // trigger event for starting of export worker
  public static final String AUTO_PRODUCE_FORMATTED_DOCUMENT = "autoProduceFormattedDocument";
  // cron event to trigger cyclic worker
  public static final String AUTO_NEXT_EXPORT_WORKER = "autoWorkOnNextDialect";          //
  // continue cyclic work

  public static final String FVEXPORT = "FVExport";                           // export document
  // type
  public static final String DIALECT_RESOURCES_TYPE = "FVResources";                        //
  // Resource folder type
  public static final String DIALECT_DICTIONARY_TYPE = "FVDictionary";                       //
  // Dictionary type

  // Parameters passed in Export trigger events

  public static final String DIALECT_RESOURCES_NAME = "Resources";
  public static final String INHERITED_FROM_OTHER = "INHERITED";                         //
  // Cyclic worker param specification
  public static final String CSV_FORMAT = "CSV";
  public static final String PDF_FORMAT = "PDF";
  public static final String CYCLIC_WORKER_ID = "cyclic-export-worker";               // id for
  // cyclic worker
  public static final String CYCLIC_WORKER_QUEUE_ID = "cyclicExportWorker";
  public static final String CYCLIC_EXPORT_WORKER_CATEGORY = CYCLIC_WORKER_QUEUE_ID;
  public static final String ON_DEMAND_WORKER_QUEUE_ID = "demandExportWorker";
  // queue id for user triggered worker
  public static final String BLOB_WORKER = "blob_Worker";                        // listener
  // triggered completion worker
  public static final String ON_DEMAND_WORKER_CATEGORY = ON_DEMAND_WORKER_QUEUE_ID;
  // queue ID for user triggered worker
  public static final String DOCS_TO_EXPORT = "DOCS_TO_EXPORT";                     // context
  // property key to pass IDs of docs to process
  public static final String EXPORT_WORK_INFO = "EXPORT_WORK_INFO";                   //
  // workInfo record key to pass in context


  // CSV Columns to be placed in exported document
  public final class ExportCSVLabels {

    private ExportCSVLabels() {

    }

    public static final String WORD_VALUE = "WORD";
    public static final String CULTURAL_NOTE = "CULTURAL_NOTE";
    public static final String PART_OF_SPEECH_ID = "PART_OF_SPEECH_ID";
    public static final String PART_OF_SPEECH = "PART_OF_SPEECH";
    public static final String PHONETIC_INFO = "PRONUNCIATION";
    public static final String ASSIGNED_USR_ID = "ASSIGNED_USR_ID";
    public static final String CHANGE_DTTM = "CHANGE_DTTM";
    public static final String WORD_ID = "WORD_ID";
    public static final String WORD_STATUS = "WORD_STATUS";
    public static final String REFERENCE = "REFERENCE";
    public static final String PHRASE_COLUMN = "RELATED_PHRASE";
    public static final String DOMINANT_LANGUAGE = "DOMINANT_LANGUAGE";
    public static final String AVAILABLE_IN_CHILDRENS_ARCHIVE = "CHILD_FRIENDLY";
    public static final String AVAILABLE_IN_GAMES = "INCLUDE_IN_GAMES";
    public static final String CHILD_FOCUSED = "CHILD_FOCUSED";
    public static final String DOMINANT_LANGUAGE_DEFINITION = "DEFINITION";
    public static final String LITERAL_TRANSLATION = "LITERAL_TRANSLATION";
    public static final String REALTED_PHRASE = "REALTED_PHRASE";
    public static final String RELATED_PHRASE_LITERAL_TRANSLATION =
        "RELATED_PHRASE_LITERAL_TRANSLATION";
    public static final String RELATED_PHRASE_DEFINITION = "RELATED_PHRASE_DEFINITION";
    public static final String CATEGORY_ID = "CATEGORY_ID";
    public static final String CATEGORY_NAME = "CATEGORY_NAME";
    public static final String CATEGORIES = "CATEGORIES";
    public static final String CONTRIBUTER = "CONTRIBUTER";
    public static final String ID = "ID";
    public static final String FILENAME = "FILENAME";
    public static final String DESCR = "DESCRIPTION";
    public static final String SHARED = "SHARED_WITH_OTHER_DIALECTS";
    public static final String RECORDER = "RECORDER";
    public static final String USER_ID = "USER_ID";
    public static final String CONTRIBUTOR = "CONTRIBUTOR";
    public static final String SOURCE = "SOURCE";
    public static final String STATUS = "STATUS";
    public static final String TITLE = "TITLE";
    public static final String CODE = "CODE";
    public static final String USERNAME = "USERNAME";
    public static final String DESCRIPTION = "DESCRIPTION";

    public static final String AUDIO = "AUDIO";                      // compound descriptor
    public static final String AUDIO_TITLE = "AUDIO_TITLE";
    public static final String AUDIO_FILENAME = "AUDIO_FILENAME";
    public static final String AUDIO_DESCRIPTION = "AUDIO_DESCRIPTION";
    public static final String AUDIO_SHARED_WITH_OTHER_DIALECTS =
        "AUDIO_SHARED_WITH_OTHER_DIALECTS";
    public static final String AUDIO_SOURCE = "AUDIO_SOURCE";
    public static final String AUDIO_RECORDER = "AUDIO_RECORDER";
    public static final String AUDIO_CHILD_FOCUSED = "AUDIO_CHILD_FOCUSED";

    public static final String IMAGE = "IMAGE";                      // compound descriptor
    public static final String IMG_TITLE = "IMG_TITLE";
    public static final String IMG_FILENAME = "IMG_FILENAME";
    public static final String IMG_DESCRIPTION = "IMG_DESCRIPTION";
    public static final String IMG_SHARED_WITH_OTHER_DIALECTS = "IMG_SHARED_WITH_OTHER_DIALECTS";
    public static final String IMG_SOURCE = "IMG_SOURCE";
    public static final String IMG_RECORDER = "IMG_RECORDER";
    public static final String IMG_CHILD_FOCUSED = "IMG_CHILD_FOCUSED";
    public static final String IMG_HEADLINE = "IMG_HEADLINE";
    public static final String IMG_PICTURE_SOURCE = "PICTURE_SOURCE";
    public static final String IMG_PICTURE_ORIGIN = "PICTURE_ORIGIN";
    public static final String IMG_PICTURE_CAPTION = "PICTURE_CAPTION";
    public static final String IMG_PICTURE_CREDIT = "PICTURE_CREDIT";
    public static final String IMG_PICTURE_HEADLINE = "PICTURE_HEADLINE";


    public static final String VIDEO = "VIDEO";                       // compound descriptor
    public static final String VIDEO_TITLE = "VIDEO_TITLE";
    public static final String VIDEO_FILENAME = "VIDEO_FILENAME";
    public static final String VIDEO_DESCRIPTION = "VIDEO_DESCRIPTION";
    public static final String VIDEO_SHARED_WITH_OTHER_DIALECTS =
        "VIDEO_SHARED_WITH_OTHER_DIALECTS";
    public static final String VIDEO_SOURCE = "VIDEO_SOURCE";
    public static final String VIDEO_RECORDER = "VIDEO_RECORDER";
    public static final String VIDEO_CHILD_FOCUSED = "VIDEO_CHILD_FOCUSED";

    // public static final String


    public static final String PHRASE = "PHRASE";
    public static final String PHRASE_ID = "PHRASE_ID";
    public static final String PHRASE_STATUS = "PHRASE_STATUS";
    public static final String DOMINANT_LANGUAGE_PHRASE_C = "DOMINANT_LANGUAGE_PHRASE";
    public static final String LAST_CONTRIBUTOR_C = "LAST_CONTRIBUTOR";
    public static final String PHRASE_BOOKS_C = "PHRASE_BOOKS";

  }


}
