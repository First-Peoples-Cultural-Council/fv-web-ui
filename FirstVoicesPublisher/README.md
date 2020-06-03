# FirstVoicesPublisher

## Module Description
This module handles the publishing logic in FirstVoices. As part of publishing, content, for example dialects, words and phrases, get a `proxy` created that is placed in `sections` locations.

These `sections` follow a similar structure to `Workspaces`, which contain the working copies, however `sections` content is immutable and intended to be accessed by Guests.

## ToDo
* Move Custom Order logic/operations from this module

## Notes
* FirstVoices publishing logic expands on the existing Nuxeo publishing logic. 

## Learn More

* [Read about Nuxeo sections/publishing](https://doc.nuxeo.com/userdoc/share/#working-with-sections)
* [Read about Nuxeo proxies](https://doc.nuxeo.com/nxdoc/data-modeling/#proxies)