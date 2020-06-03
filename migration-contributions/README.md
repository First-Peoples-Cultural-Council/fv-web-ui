# migration-contributions

## Module Description
This module handles migrating `trash` services due to the change in Nuxeo introducing `ecm:isTrashed` (from `ecm:currentLifecycleState = 'deleted'`).
This should most likely be removed as the Prod state is `Trashed state stored as system property` (i.e. migration was successful).

## ToDo
* Double check and ensure that all code (FE/BE) uses `ecm:isTrashed` and not `ecm:currentLifecycleState = 'deleted'` ([see here](https://doc.nuxeo.com/nxdoc/trash-service/#trash-migration))