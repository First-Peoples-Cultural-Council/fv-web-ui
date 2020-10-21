# Operations

## Dictionary Field Correction

```
dictionary-field-correction
-url
"https://ENV_URL/nuxeo/"
-username
USERNAME
-dictionary
aa000a00-a0a0-000a-000a-a000a0a00a0a
-pageSize
500
-where
"AND (ecm:primaryType='FVWord')"
-operation
assign-value-to-field
-field
fv-word:available_in_games
-fVal
true
-password
PASSWORD
```

## Dictionary Status Correction

This is a very specific task for correcting unwanted workflow transitions that happened by a system account (systemPrincipal). The task will retrieve the correct status from the documents audit log, and revert to it. Handle with care!

```
dictionary-status-correction 
-url "https://ENV_URL/nuxeo/" 
-username 
USERNAME 
-dictionary aa000a00-a0a0-000a-000a-a000a0a00a0a
-pageSize 1000 
-where "AND (ecm:primaryType='FVWord' OR ecm:primaryType='FVPhrase') AND ecm:currentLifeCycleState = 'Published'" 
-principal SYSTEM_USERNAME
```

## Clean export registrations

This task will remove processed or non-existent user registrations, and generate a CSV for follow up.

```
users-clean-export-registrations
-url
"https://ENV_URL/nuxeo/"
-dialect
aa000a00-a0a0-000a-000a-a000a0a00a0a
-export-dir
/DIRECTORY/FOR/CSV
-username
USERNAME
-password
PASSWORD
```

## Clean Duplicate/Stale Tasks
```
clean-duplicate-stale-tasks
-url
"https://ENV_URL/nuxeo/"
-username
USERNAME
-affected-group
"group:administrators"
-dry-run
-password
```

You can optionally specify:

```
-export-dir
   /DIRECTORY/FOR/CSV
```

Or, to clear published words/phrases, specify:

```
-clear-published
```

To export the remaining tasks after cleanup.

## Dictionary Simple Export
Provides an export of either words or phrases and includes the uid, title, definitions, and the state for each entry.
```
dictionary-simple-export
-url
"https://ENV_URL/nuxeo/"
-username
USERNAME
-dictionary
aa000a00-a0a0-000a-000a-a000a0a00a0a
-export-dir
/DIRECTORY/FOR/CSV
```
To run on phrases (the default is FVWords) add:
```
-exportType
"FVPhrase"
```

If you want to select fewer documents per iteration than 1000 (the default limit), for example for performance reasons, specify:
```
-pageSize 500
  ```
## Dictionary Export
Functions with the same parameters as dictionary-simple-export but provides a more detailed output that includes: 
* uid
* type of entry
* up to 5 definitions
* up to 2 literal translations
* pronunciation
* cultural note
* the original creator of the entry
* reference
* acknowledgement
* has related audio (boolean)
* has related image (boolean)
* has related video (boolean)
* State of the entry
```
dictionary-export
```

## Contributors clean

First, add the contributors you want to keep to contributors map.
Key => contributor name, Value => elder (true/false)

```
contributors-clean-records
-url
"https://ENV_URL/nuxeo/"
-username
USERNAME
-contributorsDir
aa000a00-a0a0-000a-000a-a000a0a00a0a
-dictionaryDir
aa000a00-a0a0-000a-000a-a000a0a00a0a
-resourcesDir
aa000a00-a0a0-000a-000a-a000a0a00a0a
```

To run on sections, replace UIDs and add:
```
-runOnSections
```

## Dictionary app compatible export

Provides an Android/iOS app compatible export, that can include downloading blobs. Run on 'sections' recommended.
NOTE: Run on sections GUID to get only publicly available words.

```
dictionary-app-compatible-export
-url
"https://ENV_URL/nuxeo/"
-username
USERNAME
-downloadBlobs
-slugifyBlobs
-pageSize
250
-exportType
FVWord
-dictionary
aa000a00-a0a0-000a-000a-a000a0a00a0a
-export-dir
/DIRECTORY/FOR/BLOB/AND/JSON/EXPORT
-password
```

To avoid downloading blobs, and just generate JSON export with remote URLs, remove:
```
-downloadBlobs
```

To use real file names rather than hashes, remove:
```
-slugifyBlobs
```

To generate a CSV file, in addition to a JSON file, use:
```
-generateCSV
```

To (optionally) set a remote path, add the following:
```
-remotePath https://my-bucket-name.s3.ca-central-1.amazonaws.com/folder/
```

To (optionally) select only a subset of words or phrases, add a WHERE clause:
```
-where
"AND fv:property = 'value'"
```

This script will not re-download files that exist on the file system, unless they have 0 bytes (usually due to a failed download - look for output).

## Create Language

This task creates a language at /FV/Workspaces/Data/{the language directory supplied}/{the language name supplied} \
Four users are automatically created: {LANGUAGENAME}_MEMBER, {LANGUAGENAME}_RECORDER, {LANGUAGENAME}_RECORDER_APPROVER, {LANGUAGENAME}_ADMIN, with
the correct permissions. All use the password as set with the CYPRESS_FV_PASSWORD environment variable, which must be set before running this task.

```
create-language
-url
"http://127.0.0.1:8080/nuxeo
-username
USERNAME
-password
PASSWORD
-language-directory
TEst/Test/
-language-name
TestLanguage
```


## Delete Language

This task deletes a language at /FV/Workspaces/Data/{the language directory supplied}/{the language name supplied} \
The users {LANGUAGENAME}_MEMBER, {LANGUAGENAME}_RECORDER, {LANGUAGENAME}_RECORDER_APPROVER, {LANGUAGENAME}_ADMIN are removed as well.
```
delete-language
-url
"http://127.0.0.1:8080/nuxeo
-username
USERNAME
-password
PASSWORD
-language-directory
TEst/Test/
-language-name
TestLanguage
```

## Migrate Shared Categories

This is a specific task to migrate categories from Shared Categories to a dialect's own Categories.
```
migrate-shared-categories
-url
"https://ENV_URL/nuxeo/"
-dialectId
aa000a00-a0a0-000a-000a-a000a0a00a0a
-log-dir
DIRECTORY/FOR/OUTPUT/AND/ERROR/LOGS
-username
USERNAME
-password
PASSWORD
```
To run on sections, replace Dialect UID and add:
```
-runOnSections
```

## Assign Related Words

This is a task to assign related words between existing words. It takes a CSV spreadsheet as an input, in the format of:
```csv
ID	  RELATED_ENTRIES     USERNAME
91	  92; 93;             user@user.com
94	  95                  user@user.com
```

Making a link on the word with the `ID` to the `RELATED_ENTRIES` words.
IDs represent the `import_id-v2` field. 

```
dictionary-related-assets-assignment
-url "https://ENV_URL/nuxeo/"
-dictionaryId aa000a00-a0a0-000a-000a-a000a0a00a0a
-import-file /DIRECTORY/WITH/RELATED_WORDS/CSV/file.csv
-username USERNAME
-password
PASSWORD
```
