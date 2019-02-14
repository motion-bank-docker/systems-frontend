# Changelog

This document tracks all important changes to the Motion Bank Systems Frontend.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Access control menu available for MoSys grids

### Changed

- Moved ACL functionality to [mbjs-quasar](https://gitlab.rlp.net/motionbank/mbjs/quasar) module


## [1.2.1] - 2019-02-15

### Fixed

- Post-annotator timestamps now display correct values, independent of timezone or DST
- currentIndex property no longer throws when attempting to scroll to invalid annotation index
- Timestamps in post-annotator are no longer being cut off, display hours as well


## [1.2.0] - 2019-02-14

### Added

- Post annotator now accepts annotation UUIDs as a hash value and automatically jumps there on load
- Property 'originalTitle' (if title is overridden) added to result in metadata store
- Very basic search page for timelines added, accessible only with 'search' feature permission
- API client (and its associated resources' "find" actions) now accept regular expressions
- Resource 'documents' available in the store
- 'Assets' feature allows uploading of files to personal S3 compatible bucket
- 'Packager' feature allows export of MoSys grids as static packages to be hosted in any webspace, without the need of Motion Bank APIs

### Fixed

- Automatic scrolling to annotations when video player plays in post annotator
- Video titles are no longer removed when saving video with same title as before
- Parameter 'feature' can now be added to route metadata to allow access control through Auth0 app metadata
- Exception when passing an id (URI) to ACL store instead of a UUID
- Incompatibilities in MoSys cells (Video, AnnotationList)
- App startup no longer breaks on Microsoft Edge (works from version 15+)
- Perform date related queries to MongoDB with properly formatted timezones (see: [#106](https://gitlab.rlp.net/motionbank/systems-frontend/issues/106))

### Changed

- userHasFeature moved to [mbjs-quasar](https://gitlab.rlp.net/motionbank/mbjs/quasar) module
- "More Info" button on welcome page now links to medium article
- MoSys components now included through git submodule from [quasar-components-mosys](https://gitlab.rlp.net/motionbank/mbjs/quasar-components-mosys)
- Shared components now included through git submodule from [quasar-components-shared](https://gitlab.rlp.net/motionbank/mbjs/quasar-components-shared)

### Updated

- [mbjs-api-client](https://gitlab.rlp.net/motionbank/mbjs/api-client) now at version 1.1.0


## [1.1.1] - 2019-01-28

### Fixed

- Recursive setting of ACL for a timeline's associated annotations now traverses the full relational depth.


## [1.1.0] - 2018-12-11

### Added

- Edit video screen now allows moving video to another timeline
- Video list shows timeline title
- Data tables now use an optional requestTransform function to process rows on each data update
- Info button in the post-annotator shows video metadata (so far only title)
- Hyperlinks in annotations are now clickable in the post-annotator
- Limited markdown support for annotations (allowed tags: 'b', 'i', 'em', 'strong', 'a', 'br', 'p')
- Videos can now be tagged
- Vuex module 'tags' - stores and retrieves tags as annotations

### Changed

- Video list is now sorted descending on reference date by default
- Look of top right buttons in post-annotator
- Users need to explicitly click 'edit' to change an annotation in the post-annotator
- External titles stored as annotations are now retrieved within the metadata store module
- BrowserWarning and MarkdownDisplay components moved to [mbjs-quasar](https://gitlab.rlp.net/motionbank/mbjs/quasar)
- Readme info
- Pinned and updated runtime dependencies

### Fixed

- Post-annotation no longer fails when the duration of a video cannot be retrieved
- Editing external title annotations
- Tables are now properly searchable
- Timeline list now updates after deleting an item

### Removed

- Old Github badges, CI and code review configs


## [1.0.0] - 2018-12-04

### Added

- Changelog document

### Changed

- Start proper versioning at 1.0.0


[Unreleased]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.2.1...master
[1.2.1]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.2.0...v1.2.1
[1.2.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.1.1...v1.2.0
[1.1.1]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.1.0...v1.1.1
[1.1.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.0.0...v1.1.0
[1.0.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/initial...v1.0.0
