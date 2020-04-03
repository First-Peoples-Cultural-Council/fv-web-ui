/*
 *
 * Copyright 2020 First People's Cultural Council
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
 * /
 */

package ca.firstvoices.utils;

import ca.firstvoices.property_readers.*;

import static ca.firstvoices.utils.FVExportConstants.ExportCSVLabels.*;




/*

        WARNING: Unless you really understand what you are doing please do not change anything here.




        Read full description provided in FV_WORDExportCSVColumns before any attempt to change settings in this setup.

 */


public class FV_PhraseExportCSVColumns extends FV_CSVExportColumns
{
    public FV_PhraseExportCSVColumns() {
        super();

        columnRecordHashMap.put(PHRASE, new ExportColumnRecord(PHRASE, FVExportProperties.TITLE, true, 1, FV_PropertyReader.class, null));
        columnRecordHashMap.put(DESCRIPTION, new ExportColumnRecord(DESCR, FVExportProperties.DESCR, true, 1, FV_PropertyReader.class, null));
        columnRecordHashMap.put(DOMINANT_LANGUAGE_DEFINITION, new ExportColumnRecord(DOMINANT_LANGUAGE_DEFINITION, FVExportProperties.DEFINITION, true, 4, FV_WordTranslationReader.class, null));
        columnRecordHashMap.put(CULTURAL_NOTE, new ExportColumnRecord(CULTURAL_NOTE, FVExportProperties.CULTURAL_NOTE, true, 4, FV_SimpleListPropertyReader.class, null));
        columnRecordHashMap.put(REFERENCE, new ExportColumnRecord(REFERENCE, FVExportProperties.REFERENCE, true, 1, FV_PropertyReader.class, null));

        // COMPOUND READERS
        columnRecordHashMap.put(IMAGE, new ExportColumnRecord(IMAGE, FVExportProperties.IMAGE_COMPUND, true, 0, FV_CompoundPropertyReader.class, FVExportProperties.imgCompoundA));
        columnRecordHashMap.put(AUDIO, new ExportColumnRecord(AUDIO, FVExportProperties.AUDIO_COMPUND, true, 0, FV_CompoundPropertyReader.class, FVExportProperties.audioCompoundA));
        columnRecordHashMap.put(VIDEO, new ExportColumnRecord(VIDEO, FVExportProperties.VIDEO_COMPUND, true, 0, FV_CompoundPropertyReader.class, FVExportProperties.videoCompoundA));

        // AUDIO COMPOUND
        columnRecordHashMap.put(AUDIO_TITLE, new ExportColumnRecord(AUDIO_TITLE, FVExportProperties.TITLE, false, 1, FV_PropertyReader.class, null));
        columnRecordHashMap.put(AUDIO_FILENAME, new ExportColumnRecord(AUDIO_FILENAME, FVExportProperties.MEDIA_FILENAME, false, 1, FV_PropertyReader.class, null));
        columnRecordHashMap.put(AUDIO_DESCRIPTION, new ExportColumnRecord(AUDIO_DESCRIPTION, FVExportProperties.DESCR, false, 1, FV_PropertyReader.class, null));
        columnRecordHashMap.put(AUDIO_SHARED_WITH_OTHER_DIALECTS, new ExportColumnRecord(AUDIO_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED, false, 1, FV_BooleanPropertyReader.class, null));
        columnRecordHashMap.put(AUDIO_SOURCE, new ExportColumnRecord(AUDIO_SOURCE, FVExportProperties.MEDIA_ORIGIN, false, 2, FV_SimpleListPropertyReader.class, null));
        columnRecordHashMap.put(AUDIO_CHILD_FOCUSED, new ExportColumnRecord(AUDIO_CHILD_FOCUSED, FVExportProperties.MEDIA_CHILD_FOCUSED, false, 1, FV_BooleanPropertyReader.class, null));
        columnRecordHashMap.put(AUDIO_RECORDER, new ExportColumnRecord(AUDIO_RECORDER, FVExportProperties.MEDIA_RECORDER, false, 2, FV_SimpleListPropertyReader.class, null));

        // IMAGE COMPOUND
        columnRecordHashMap.put(IMG_TITLE, new ExportColumnRecord(IMG_TITLE, FVExportProperties.TITLE, false, 1, FV_PropertyReader.class, null));
        columnRecordHashMap.put(IMG_FILENAME, new ExportColumnRecord(IMG_FILENAME, FVExportProperties.MEDIA_FILENAME, false, 1, FV_PropertyReader.class, null));
        columnRecordHashMap.put(IMG_DESCRIPTION, new ExportColumnRecord(IMG_DESCRIPTION, FVExportProperties.DESCR, false, 1, FV_PropertyReader.class, null));
        columnRecordHashMap.put(IMG_SHARED_WITH_OTHER_DIALECTS, new ExportColumnRecord(IMG_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED, false, 1, FV_BooleanPropertyReader.class, null));
        columnRecordHashMap.put( IMG_SOURCE,                  new ExportColumnRecord( IMG_SOURCE,                       FVExportProperties.MEDIA_ORIGIN, false, 2,          FV_SimpleListPropertyReader.class, null) );
        columnRecordHashMap.put( IMG_CHILD_FOCUSED,           new ExportColumnRecord( IMG_CHILD_FOCUSED,                FVExportProperties.MEDIA_CHILD_FOCUSED, false, 1,   FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( IMG_RECORDER,                new ExportColumnRecord( IMG_RECORDER,                     FVExportProperties.MEDIA_RECORDER, false, 2,        FV_SimpleListPropertyReader.class, null) );

        // VIDEO COMPOUND
        columnRecordHashMap.put( VIDEO_TITLE,                   new ExportColumnRecord( VIDEO_TITLE,                     FVExportProperties.TITLE, false, 1,                FV_PropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_FILENAME,                new ExportColumnRecord( VIDEO_FILENAME,                  FVExportProperties.MEDIA_FILENAME, false, 1,       FV_PropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_DESCRIPTION,             new ExportColumnRecord( AUDIO_DESCRIPTION,               FVExportProperties.DESCR, false, 0,                FV_PropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_SHARED_WITH_OTHER_DIALECTS,  new ExportColumnRecord( VIDEO_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED, false, 1,    FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_SOURCE,                  new ExportColumnRecord( VIDEO_SOURCE,                    FVExportProperties.MEDIA_ORIGIN, false, 2,         FV_SimpleListPropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_CHILD_FOCUSED,           new ExportColumnRecord( VIDEO_CHILD_FOCUSED,             FVExportProperties.MEDIA_CHILD_FOCUSED, false, 1,  FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_RECORDER,                new ExportColumnRecord( VIDEO_RECORDER,                  FVExportProperties.MEDIA_RECORDER, false, 2,       FV_SimpleListPropertyReader.class, null) );

    }
}
