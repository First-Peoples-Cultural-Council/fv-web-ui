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

import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AUDIO;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AUDIO_CHILD_FOCUSED;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AUDIO_DESCRIPTION;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AUDIO_FILENAME;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AUDIO_RECORDER;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AUDIO_SHARED_WITH_OTHER_DIALECTS;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AUDIO_SOURCE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.AUDIO_TITLE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.CULTURAL_NOTE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.DESCR;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.DESCRIPTION;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.IMAGE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.IMG_CHILD_FOCUSED;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.IMG_DESCRIPTION;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.IMG_FILENAME;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.IMG_RECORDER;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.IMG_SHARED_WITH_OTHER_DIALECTS;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.IMG_SOURCE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.IMG_TITLE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.PHRASE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.REFERENCE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.VIDEO;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.VIDEO_CHILD_FOCUSED;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.VIDEO_DESCRIPTION;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.VIDEO_FILENAME;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.VIDEO_RECORDER;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.VIDEO_SHARED_WITH_OTHER_DIALECTS;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.VIDEO_SOURCE;
import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.VIDEO_TITLE;

import ca.firstvoices.export.propertyreaders.FVBooleanPropertyReader;
import ca.firstvoices.export.propertyreaders.FVCompoundPropertyReader;
import ca.firstvoices.export.propertyreaders.FVPropertyReader;
import ca.firstvoices.export.propertyreaders.FVSimpleListPropertyReader;
import ca.firstvoices.export.propertyreaders.FirstVoicesWordTranslationReader;




/*

        WARNING: Unless you really understand what you are doing please do not change anything
        here.




        Read full description provided in FV_WORDExportCSVColumns before any attempt to change
        settings in this setup.

 */


public class FVPhraseExportCSVColumns extends FirstVoicesCSVExportColumns {

  public FVPhraseExportCSVColumns() {
    super();

    columnRecordHashMap.put(PHRASE,
        new ExportColumnRecord(PHRASE, FVExportProperties.TITLE, true, 1, FVPropertyReader.class,
            null));
    columnRecordHashMap.put(DESCRIPTION,
        new ExportColumnRecord(DESCR, FVExportProperties.DESCR, true, 1, FVPropertyReader.class,
            null));
    columnRecordHashMap.put(DOMINANT_LANGUAGE_DEFINITION,
        new ExportColumnRecord(DOMINANT_LANGUAGE_DEFINITION, FVExportProperties.DEFINITION, true, 4,
            FirstVoicesWordTranslationReader.class, null));
    columnRecordHashMap.put(CULTURAL_NOTE,
        new ExportColumnRecord(CULTURAL_NOTE, FVExportProperties.CULTURAL_NOTE, true, 4,
            FVSimpleListPropertyReader.class, null));
    columnRecordHashMap.put(REFERENCE,
        new ExportColumnRecord(REFERENCE, FVExportProperties.REFERENCE, true, 1,
            FVPropertyReader.class, null));

    // COMPOUND READERS
    columnRecordHashMap.put(IMAGE,
        new ExportColumnRecord(IMAGE, FVExportProperties.IMAGE_COMPOUND, true, 0,
            FVCompoundPropertyReader.class, FVExportProperties.imgCompoundA));
    columnRecordHashMap.put(AUDIO,
        new ExportColumnRecord(AUDIO, FVExportProperties.AUDIO_COMPOUND, true, 0,
            FVCompoundPropertyReader.class, FVExportProperties.audioCompoundA));
    columnRecordHashMap.put(VIDEO,
        new ExportColumnRecord(VIDEO, FVExportProperties.VIDEO_COMPOUND, true, 0,
            FVCompoundPropertyReader.class, FVExportProperties.videoCompoundA));

    // AUDIO COMPOUND
    columnRecordHashMap.put(AUDIO_TITLE,
        new ExportColumnRecord(AUDIO_TITLE, FVExportProperties.TITLE, false, 1,
            FVPropertyReader.class, null));
    columnRecordHashMap.put(AUDIO_FILENAME,
        new ExportColumnRecord(AUDIO_FILENAME, FVExportProperties.MEDIA_FILENAME, false, 1,
            FVPropertyReader.class, null));
    columnRecordHashMap.put(AUDIO_DESCRIPTION,
        new ExportColumnRecord(AUDIO_DESCRIPTION, FVExportProperties.DESCR, false, 1,
            FVPropertyReader.class, null));
    columnRecordHashMap.put(AUDIO_SHARED_WITH_OTHER_DIALECTS,
        new ExportColumnRecord(AUDIO_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED,
            false, 1, FVBooleanPropertyReader.class, null));
    columnRecordHashMap.put(AUDIO_SOURCE,
        new ExportColumnRecord(AUDIO_SOURCE, FVExportProperties.MEDIA_ORIGIN, false, 2,
            FVSimpleListPropertyReader.class, null));
    columnRecordHashMap.put(AUDIO_CHILD_FOCUSED,
        new ExportColumnRecord(AUDIO_CHILD_FOCUSED, FVExportProperties.MEDIA_CHILD_FOCUSED, false,
            1, FVBooleanPropertyReader.class, null));
    columnRecordHashMap.put(AUDIO_RECORDER,
        new ExportColumnRecord(AUDIO_RECORDER, FVExportProperties.MEDIA_RECORDER, false, 2,
            FVSimpleListPropertyReader.class, null));

    // IMAGE COMPOUND
    columnRecordHashMap.put(IMG_TITLE,
        new ExportColumnRecord(IMG_TITLE, FVExportProperties.TITLE, false, 1,
            FVPropertyReader.class, null));
    columnRecordHashMap.put(IMG_FILENAME,
        new ExportColumnRecord(IMG_FILENAME, FVExportProperties.MEDIA_FILENAME, false, 1,
            FVPropertyReader.class, null));
    columnRecordHashMap.put(IMG_DESCRIPTION,
        new ExportColumnRecord(IMG_DESCRIPTION, FVExportProperties.DESCR, false, 1,
            FVPropertyReader.class, null));
    columnRecordHashMap.put(IMG_SHARED_WITH_OTHER_DIALECTS,
        new ExportColumnRecord(IMG_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED,
            false, 1, FVBooleanPropertyReader.class, null));
    columnRecordHashMap.put(IMG_SOURCE,
        new ExportColumnRecord(IMG_SOURCE, FVExportProperties.MEDIA_ORIGIN, false, 2,
            FVSimpleListPropertyReader.class, null));
    columnRecordHashMap.put(IMG_CHILD_FOCUSED,
        new ExportColumnRecord(IMG_CHILD_FOCUSED, FVExportProperties.MEDIA_CHILD_FOCUSED, false, 1,
            FVBooleanPropertyReader.class, null));
    columnRecordHashMap.put(IMG_RECORDER,
        new ExportColumnRecord(IMG_RECORDER, FVExportProperties.MEDIA_RECORDER, false, 2,
            FVSimpleListPropertyReader.class, null));

    // VIDEO COMPOUND
    columnRecordHashMap.put(VIDEO_TITLE,
        new ExportColumnRecord(VIDEO_TITLE, FVExportProperties.TITLE, false, 1,
            FVPropertyReader.class, null));
    columnRecordHashMap.put(VIDEO_FILENAME,
        new ExportColumnRecord(VIDEO_FILENAME, FVExportProperties.MEDIA_FILENAME, false, 1,
            FVPropertyReader.class, null));
    columnRecordHashMap.put(VIDEO_DESCRIPTION,
        new ExportColumnRecord(AUDIO_DESCRIPTION, FVExportProperties.DESCR, false, 0,
            FVPropertyReader.class, null));
    columnRecordHashMap.put(VIDEO_SHARED_WITH_OTHER_DIALECTS,
        new ExportColumnRecord(VIDEO_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED,
            false, 1, FVBooleanPropertyReader.class, null));
    columnRecordHashMap.put(VIDEO_SOURCE,
        new ExportColumnRecord(VIDEO_SOURCE, FVExportProperties.MEDIA_ORIGIN, false, 2,
            FVSimpleListPropertyReader.class, null));
    columnRecordHashMap.put(VIDEO_CHILD_FOCUSED,
        new ExportColumnRecord(VIDEO_CHILD_FOCUSED, FVExportProperties.MEDIA_CHILD_FOCUSED, false,
            1, FVBooleanPropertyReader.class, null));
    columnRecordHashMap.put(VIDEO_RECORDER,
        new ExportColumnRecord(VIDEO_RECORDER, FVExportProperties.MEDIA_RECORDER, false, 2,
            FVSimpleListPropertyReader.class, null));

  }
}
