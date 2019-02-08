/**
 *
 */
package ca.firstvoices.export.utils;

import ca.firstvoices.export.property_readers.*;

import static ca.firstvoices.export.utils.FVExportConstants.ExportCSVLabels.*;

// headers for CSV file
public final class FV_WordExportCSVColumns extends FV_CSVExportColumns
{
    /*
        WARNING: Unless you really understand what you are doing please do not change anything here.

        FV_WordExportCSVColumns and corresponding FV_PhraseExportCSVColumns are THE MAIN binding between request for
        export, column names in export file, db properties which need to be read and data readers to do that.

        Key labeled 'IDENTIFIER from UI' is provided from front-end and serves as a selector of the records to initiate
        CSV or PDF exports.
        FVSupportedExportColumns endpoint returns all valid keys ('IDENTIFIER from UI') for FVWord and FVPhrase exports.

        ExportColumnRecord class binds export 'COLUMN NAME', name written to an export file as a column header,
        to database object property defined in 'PROPERTY' and which will be read during export.
        'READER TO CREATE' is a class which will be created to read 'PROPERTY'. Each reader class encapsulates
        information about property type and what needs to be done to properly produce it during export.

        Additional attributes which have to be populated (but are not labeled with column description).

        'ufe:" - stands for 'use-for-export' is either true or false and determines if ExportColumnRecord can be used
                 in requested export. If true 'IDENTIFIER from UI' will be returned in FVSupportedExportColumns response
                 and property reader to be used to export property.

        'nc:'  - stand for 'number-columns' and defines number of columns to be created for a specific property.
                 Some properties will have multiple columns but only one name 'COLUMN NAME' to define the output.
                 In such a case, when 'nc:' > 1, export will generate additional column headers by appending a number
                 to declared column name.

        'c:'   - stands for 'compound' and provides input for compound properties which can generate multiple rows,
                 for each column. Compounds are defined as FV_DataBinding[]. This class is used
                 universally to bind 2 entities together. Compounds are defined in FVExportProperties and apply to
                 properties describing media type properties with multiple attributes.
                 Compounds do need to have 'nc:' defined as they are deduced from other factors.
                 NOTE: there are records below which are labeled as 'AUDIO COMPOUND', 'IMAGE COMPOUND', 'VIDEO COMPOUND'
                 which should always have 'ufe:' set to false as they cannot read properties without being a part of compound.
                 Label 'not done' designed property readers which are not completed yet.


        NOTE: the same format is followed in defining mapping in FV_PhraseExportCSVColumns to support export
              of phrases.
    */


    public FV_WordExportCSVColumns()
    {
        super();

        //                       IDENTIFIER from UI                                     COLUMN NAME                      PROPERTY                                                  READER TO CREATE
        columnRecordHashMap.put( TITLE,                         new ExportColumnRecord( WORD_VALUE,                      FVExportProperties.TITLE, true, 1,              FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE,             new ExportColumnRecord( DOMINANT_LANGUAGE,               FVExportProperties.LANGUAGE, true, 1,           FV_PropertyReader.class, null) );

        columnRecordHashMap.put( PART_OF_SPEECH_ID,             new ExportColumnRecord( PART_OF_SPEECH,                  FVExportProperties.PART_OF_SPEECH_ID, true, 1 , FV_PartOfSpeechPropertyReader.class, null ) );
        columnRecordHashMap.put( CULTURAL_NOTE,                 new ExportColumnRecord( CULTURAL_NOTE,                   FVExportProperties.CULTURAL_NOTE, true, 6,      FV_SimpleListPropertyReader.class, null ) );
        columnRecordHashMap.put( PHONETIC_INFO,                 new ExportColumnRecord( PHONETIC_INFO,                   FVExportProperties.PHONETIC_INFO ,true, 1,      FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( ASSIGNED_USR_ID,               new ExportColumnRecord( ASSIGNED_USR_ID,                 FVExportProperties.ASSIGNED_USR_ID, true, 1,    FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( CHANGE_DTTM,                   new ExportColumnRecord( CHANGE_DTTM,                     FVExportProperties.CHANGE_DTTM, true, 1,        FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( LITERAL_TRANSLATION,           new ExportColumnRecord( LITERAL_TRANSLATION,             FVExportProperties.TRANSLATION, true, 6,        FV_WordTranslationReader.class, null ) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_DEFINITION,  new ExportColumnRecord( DOMINANT_LANGUAGE_DEFINITION,    FVExportProperties.DEFINITION, true, 6,         FV_WordTranslationReader.class, null ) );
        columnRecordHashMap.put( AVAILABLE_IN_GAMES,            new ExportColumnRecord( AVAILABLE_IN_GAMES,              FVExportProperties.AVAILABLE_IN_GAMES, true, 1, FV_BooleanPropertyReader.class, null ) );
        columnRecordHashMap.put( AVAILABLE_IN_CHILDRENS_ARCHIVE, new ExportColumnRecord( AVAILABLE_IN_CHILDRENS_ARCHIVE, FVExportProperties.AVAILABLE_IN_CHILDRENS_ARCHIVE, true, 1, FV_BooleanPropertyReader.class, null ) );
        columnRecordHashMap.put( REFERENCE,                     new ExportColumnRecord( REFERENCE,                       FVExportProperties.REFERENCE, true, 1,          FV_PropertyReader.class, null) );
        columnRecordHashMap.put( CATEGORIES,                    new ExportColumnRecord( CATEGORIES,                      FVExportProperties.WORD_CATEGORIES, true,1 ,    FV_CategoryPropertyReader.class, null ) );
        columnRecordHashMap.put( CHILD_FOCUSED,                 new ExportColumnRecord( CHILD_FOCUSED,                   FVExportProperties.CHILD_FOCUSED, true, 1,      FV_BooleanPropertyReader.class, null ) );

        columnRecordHashMap.put( REALTED_PHRASE,                new ExportColumnRecord( PHRASE_COLUMN,                   FVExportProperties.RELATED_PHRASES, true, 6,    FV_CategoryPropertyReader.class, null ) );

        columnRecordHashMap.put( WORD_STATUS,                   new ExportColumnRecord( WORD_STATUS,                     FVExportProperties.STATUS_ID, true, 1,          FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( CONTRIBUTOR,                   new ExportColumnRecord( CONTRIBUTOR,                     FVExportProperties.CONTRIBUTORS, true, 1,       FV_SimpleListPropertyReader.class, null ) );

        // COMPOUND READERS
        columnRecordHashMap.put( IMAGE,                         new ExportColumnRecord( IMAGE,                           FVExportProperties.IMAGE_COMPUND, true, 0,      FV_CompoundPropertyReader.class, FVExportProperties.imgCompoundA ) );
        columnRecordHashMap.put( AUDIO,                         new ExportColumnRecord( AUDIO,                           FVExportProperties.AUDIO_COMPUND, true, 0,      FV_CompoundPropertyReader.class, FVExportProperties.audioCompoundA ) );
        columnRecordHashMap.put( VIDEO,                         new ExportColumnRecord( VIDEO,                           FVExportProperties.VIDEO_COMPUND, true, 0,      FV_CompoundPropertyReader.class, FVExportProperties.videoCompoundA ) );

        // AUDIO COMPOUND
        columnRecordHashMap.put( AUDIO_TITLE,                   new ExportColumnRecord( AUDIO_TITLE,                     FVExportProperties.TITLE, false, 1,                FV_PropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_FILENAME,                new ExportColumnRecord( AUDIO_FILENAME,                  FVExportProperties.MEDIA_FILENAME, false, 1,       FV_PropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_DESCRIPTION,             new ExportColumnRecord( AUDIO_DESCRIPTION,               FVExportProperties.DESCR, false, 1,                FV_PropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_SHARED_WITH_OTHER_DIALECTS,  new ExportColumnRecord( AUDIO_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED, false, 1,    FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_SOURCE,                  new ExportColumnRecord( AUDIO_SOURCE,                    FVExportProperties.MEDIA_ORIGIN, false, 2,         FV_SimpleListPropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_CHILD_FOCUSED,           new ExportColumnRecord( AUDIO_CHILD_FOCUSED,             FVExportProperties.MEDIA_CHILD_FOCUSED, false, 1,  FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_RECORDER,                new ExportColumnRecord( AUDIO_RECORDER,                  FVExportProperties.MEDIA_RECORDER, false, 2,       FV_SimpleListPropertyReader.class, null) );

        // IMAGE COMPOUND
        columnRecordHashMap.put( IMG_TITLE,                   new ExportColumnRecord( IMG_TITLE,                        FVExportProperties.TITLE, false, 1,                 FV_PropertyReader.class, null) );
        columnRecordHashMap.put( IMG_FILENAME,                new ExportColumnRecord( IMG_FILENAME,                     FVExportProperties.MEDIA_FILENAME, false, 1,        FV_PropertyReader.class, null) );
        columnRecordHashMap.put( IMG_DESCRIPTION,             new ExportColumnRecord( IMG_DESCRIPTION,                  FVExportProperties.DESCR, false, 1,                 FV_PropertyReader.class, null) );
        columnRecordHashMap.put( IMG_SHARED_WITH_OTHER_DIALECTS,  new ExportColumnRecord( IMG_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED, false, 1,        FV_BooleanPropertyReader.class, null) );
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

        // not done
        columnRecordHashMap.put( CONTRIBUTER,                   new ExportColumnRecord( CONTRIBUTER,                    "?", false, 1,       null, null) );
        columnRecordHashMap.put( PHRASE_BOOKS_C,                new ExportColumnRecord( PHRASE_BOOKS_C,                  FVExportProperties.PHRASE_BOOKS, false, 1, null, null) );
        columnRecordHashMap.put( WORD_ID,                       new ExportColumnRecord( WORD_ID,                         "?", false, 0, null, null) );
        columnRecordHashMap.put( CATEGORY_ID,                   new ExportColumnRecord( CATEGORY_ID,                     "?", false, 0, null, null) );
        columnRecordHashMap.put( ID,                            new ExportColumnRecord( ID,                              "?", false, 0, null, null) );
        columnRecordHashMap.put( FILENAME,                      new ExportColumnRecord( FILENAME,                        "?", false, 0, null, null) );
        columnRecordHashMap.put( DESCR,                         new ExportColumnRecord( DESCR,                           "?", false, 0, null, null) );
        columnRecordHashMap.put( SHARED,                        new ExportColumnRecord( SHARED,                          "?", false, 0, null, null) );
        columnRecordHashMap.put( USER_ID,                       new ExportColumnRecord( USER_ID,                         "?", false, 0, null, null) );
        columnRecordHashMap.put( CODE,                          new ExportColumnRecord( CODE,                            "?", false, 0, null, null) );
        columnRecordHashMap.put( USERNAME,                      new ExportColumnRecord( USERNAME,                        "?", false, 0, null, null) );
     }
}