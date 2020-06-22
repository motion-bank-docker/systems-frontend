# Changelog

This document tracks all important changes to the Motion
Bank Systems Frontend.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No changes.

## [2.2.0] - 2020-06-22

### Added

- Add media screen uses `publishedAt` field from YouTube metadata as initial
reference date, if available (e.g. live streams)
- `Live` indicator for YouTube live streams in post-annotator
- Edit media screen allows adding duration for live streams once archived
- Duration field on edit media screen
- Add media screen refuses to add inaccessible videos
- Metadata store relays 'not found' and 'access denied' errors
- [ELAN](https://archive.mpi.nl) `.eaf` file export for media entries

### Changed

- Add media screen explicitly shows option for overriding or auto-detecting media start times
- Make Media duration in post-annotator dynamic
- Enable CSV export on `timelines/edit`

### Fixed

- Exception on edit media screen when media duration is unknown
- Exception in `UserNav` when `route.name` is undefined

### Updated

- [sift](https://github.com/crcn/sift.js/) to v13.1.10


## [2.1.2] - 2020-05-29

### Added

- Showing author information in CellAnnotationList is configurable, defaults to false

### Fixed

- Wrong cell content in GridDisplay due to reuse of rendered components

### Changed

- Add media screen redirects to media list after submit


## [2.1.1] - 2020-05-25

### Added

- Editing functionality for CellAnnotationList
- CellAnnotationList shows errors
- CellAnnotationList shows durations
- GridDisplay can be locked
- Improved content previews in Cells
- Scroll position saved when switching between `Edit` and `View` in GridEditor
- Display style editor for CellImage

### Changed

- Grid Packager API activated for new version
- AnnotationList cell design
- Minor GridEditor design updates
- CellText uses MarkdownDisplay component

### Fixed

- CalendarTimeMain does not set initial value
- Invalid default selector in AnnotationField causing live annotator to break
- Minor exceptions in GridEditor

### Removed

- [vue-video-player](https://github.com/surmon-china/vue-video-player) video wrapper

### Updated

- [Video.js](https://videojs.com/) to 7.7.5


## [2.1.0] - 2020-05-06

### Added

- Groups
- Invitation URLs
- Timelines and Grids can have global ACL presets: `View`, `Contribute` and `Free Editing`
- Grids and Timelines have a read-only mode for the `View` preset
- `settings` store module with persistence option in localStorage
- User administration for [Auth0](https://auth0.com/) users directly in app
- Users can change their Login credentials on `users/manage`
- Environment variables: `COMMIT_HASH`, `BRANCH_NAME` and `APP_VERSION`
- Include FxiOS in supported browsers

### Changed

- Grid and Timeline export enabled again
- Improved error tracking with improved [Sentry](https://sentry.io/) configuration
- All items created within a Timeline or Grid now inherit their respective ACL entries

### Fixed

- User profile editing
- Broken API_HOST configuration
- Redirect to original target after authentication

### Updated

- [cote](https://github.com/dashersw/cote)
to 1.0.0
- [mbjs-data-models](https://gitlab.rlp.net/motionbank/mbjs/data-models)
to 2.0.18
- [mbjs-auth-service](https://gitlab.rlp.net/motionbank/mbjs/auth-service)
to 1.0.8


## [2.0.0] - 2020-03-31

### Added

- [cote](https://cote.js.org) Sockend client integration to
connect to [sockets service](https://gitlab.rlp.net/motionbank/microservices/sockets)
- Cell datatype available as vuex store module
- SwimLane component in post-annotator and on standalone page
- Annotations can have durations through target.selector.value
- PBA vocabularies (titles for pieces)
- Frontend can be built as an [Electron](https://electronjs.org/)
app, including a local metadata service as store module `metadata-ffprobe`
- Mobile device-friendliness
- Breadcrumb navigation
- Buttons now support right-click + open in new tab (still suffers from
[#253](https://gitlab.rlp.net/motionbank/applications/systems-frontend/issues/253))
- Audio annotations (supported types: `.m4a` and `.mp3`) can be added
under `media/create` (playback possible using forked
[vue-video-player](https://github.com/dasantonym/vue-video-player))
- Export timelines as CSV
- Mobile compatiblity for MoSys Editor
- The file `statics/env.js` can be overwritten to configure
the frontend at runtime
- Authentication service attempts silent login when token expires
- [mbjs-auth-service](https://gitlab.rlp.net/motionbank/mbjs/auth-service)

### Changed

- Videos always have title annotations
- Metadata uses video duration from annotation
- Annotation's target.selector.value conforms to standard
- VideoPlayer uses [privacy-enhanced mode](https://support.google.com/youtube/answer/171780)
for YouTube sources to be GDPR compliant
- VideoPlayer uses [dnt](https://github.com/vimeo/player.js/#embed-options)
(do not track) option for showing Vimeo media for GDPR compliance
- Basic colors, look & feel
- New post annotator layout
- Vocabulary menu layout and functionality
- Navigation redesign
- MoSys redesign
- Renamed `Video` to `Media` throughout project

### Updated

- [mbjs-data-models](https://gitlab.rlp.net/motionbank/mbjs/data-models)
  to version 2.0.0
- [mbjs-quasar](https://gitlab.rlp.net/motionbank/mbjs/quasar)
  to version 2.2.0
- [mbjs-api-client](https://gitlab.rlp.net/motionbank/mbjs/api-client)
  to version 2.1.3

### Fixed

- Sync screen
- Timecode millisecond display
- Video player scaling issue

### Removed

- Unused store modules `forms`, `conversions` and `timecodes`
- Routes `media/ingest` and `timelines/timecode`


## [1.3.10] - 2020-02-14

### Added

- Searchable global Piecemaker index

### Updated

- sift module

### Fixed

- Escape semicolons in CSV export
- Missing i18n string for `Index` button

## [1.3.9] - 2019-12-18

### Added

- Annotation table allows export as CSV (including current
search query)

## [1.3.8] - 2019-12-15

### Added

- Table for viewing, editing and searching annotations

## [1.3.7] - 2019-11-15

### Added

- [Vue integration](https://docs.sentry.io/platforms/javascript/vue/)
for sentry

## [1.3.6] - 2019-10-31

### Changed

- Auth service attempts silent login
- Router checks session before each route change

### Fixed

- API client checks auth session before each request

### Updated

- Update mbjs-api-client to v2.1.3


## [1.3.5] - 2019-10-02

### Changed

- Allow non-owner to tag videos

### Updated

- Update mbjs-quasar to v1.5.2


## [1.3.4] - 2019-05-07

### Changed

- CellVideo shows volume panel for videos


## [1.3.3] - 2019-05-04

### Fixed

- Scaling issues in YouTube player in MoSys grids


## [1.3.2] - 2019-04-15

### Fixed

- Removed CSS updates from VideoPlayer component to
temporarily fix scaling issue on sync page


## [1.3.1] - 2019-04-06

### Changed

- MoSys VideoCells only load content when visible

### Fixed

- Resource cache uses the right env variable


## [1.3.0] - 2019-03-26

### Added

#### MoSys

- AnnotationList and Video cells deactivate off visible area
- AnnotationList has an additional tab layout
- AnnotationList shows formatted Markdown
- Exported Grid packages contain all linked grids as well
- Grid URLs accept the query parameter `datetime` specifying an
ISO datetime string (urlencoded) to set the time for video
player cells
- Grid URLs accept the query parameter `x` specifying an initial
horizontal cell index
- Image and Title cells can have links
- AnnotationList cell allows filtering annotations by simple
string or [Regular Expression](https://www.regular-expressions.info/quickstart.html)
- CellEditor adds start and duration filters for AnnotationList
and Video cells
- Cells display additional info in editor (class name, author name)
- CellText uses [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
to format text content
- Grids can have external and embedded stylesheets
defined on their 'edit' page (requires 'cssediting' feature)
- Cells additionally use their annotation target's
`styleClass` property (can be set in cell context menu,
requires 'cssediting' feature)
- Grids can be exported and imported like timelines
- Access control menu available for MoSys grids
- 'Documents' source tab (so far only shows images)

#### General

- Import timeline/grid now allows overriding author for all items
- Docker image already builds with the nginx SPA config
- The generic Vuex modules can use optional caching in memory
(activate with USE_RESOURCE_CACHE env variable)
- Generic vuex resources allow selection of returned
properties through array of strings
- Metadata store module caches responses from the
transcoder service until app reload
- UI version in site footer links to changelog

### Changed

- VideoCell hides volume control
- Text size in grids is relative to window height
- MoSys cell styling
- VideoPlayer styling
- Updated [mbjs-data-models](https://gitlab.rlp.net/motionbank/mbjs/data-models)
to 0.1.3 ([release_0_1](https://gitlab.rlp.net/motionbank/mbjs/data-models/commits/release_0_1)
branch)
- Video and AnnotationList cells now use [luxon](https://moment.github.io/luxon/)
DateTime and Interval objects
- AnnotationList cell's input field is now optional, defaults to off 
- Layout for MoSys Cells: AnnotationList, Title, Video and InternalLink
- Renamed 'mosysGridEditorStore' vuex module to 'mosys'
- Updated
[mbjs-api-client](https://gitlab.rlp.net/motionbank/mbjs/api-client)
to version 2.0.0
- Renamed 'Assets' to 'Documents' in screens and
navigation, Auth0 feature now also needs to be 'documents'
- Updated
[mbjs-quasar](https://gitlab.rlp.net/motionbank/mbjs/quasar)
to version 1.4.3
- Moved ACL functionality to
[mbjs-quasar](https://gitlab.rlp.net/motionbank/mbjs/quasar)
module

### Fixed

- Time and date selection was broken in last release
- Active annotation highlighting in MoSys AnnotationList
- Deep links into post-annotator no longer fail when
lots of annotations need to be loaded
- Delete map no longer fails when encountering access
denied errors (still suffers from
[#119](https://gitlab.rlp.net/motionbank/systems-frontend/issues/119))

### Removed

- Obsolete `MessengerComponent` as component events travel
via `this.$root`


## [1.2.1] - 2019-02-15

### Fixed

- Post-annotator timestamps display correct values,
independent of timezone or DST
- currentIndex property no longer throws when attempting
to scroll to invalid annotation index
- Timestamps in post-annotator are no longer being cut
off, display hours as well


## [1.2.0] - 2019-02-14

### Added

- Post annotator accepts annotation UUIDs as a hash
value and automatically jumps there on load
- Property 'originalTitle' (if title is overridden)
added to result in metadata store
- Very basic search page for timelines added,
accessible only with 'search' feature permission
- API client (and its associated resources' "find"
actions) now accept regular expressions
- Resource 'documents' available in the store
- 'Assets' feature allows uploading of files to
personal S3 compatible bucket
- 'Packager' feature allows export of MoSys grids
as static packages to be hosted in any webspace,
without the need of Motion Bank APIs

### Fixed

- Automatic scrolling to annotations when video
player plays in post annotator
- Video titles are no longer removed when saving
video with same title as before
- Parameter 'feature' can be added to route metadata
to allow access control through Auth0 app metadata
- Exception when passing an id (URI) to ACL store
instead of a UUID
- Incompatibilities in MoSys cells (Video,
AnnotationList)
- App startup no longer breaks on Microsoft Edge
(works from version 15+)
- Perform date related queries to MongoDB with
properly formatted timezones (see:
[#106](https://gitlab.rlp.net/motionbank/systems-frontend/issues/106))

### Changed

- userHasFeature moved to
[mbjs-quasar](https://gitlab.rlp.net/motionbank/mbjs/quasar)
- "More Info" button on welcome page now links to
medium article
- MoSys components included through git submodule from
[quasar-components-mosys](https://gitlab.rlp.net/motionbank/mbjs/quasar-components-mosys)
- Shared components included through git submodule from
[quasar-components-shared](https://gitlab.rlp.net/motionbank/mbjs/quasar-components-shared)

### Updated

- [mbjs-api-client](https://gitlab.rlp.net/motionbank/mbjs/api-client)
now at version 1.1.0


## [1.1.1] - 2019-01-28

### Fixed

- Recursive setting of ACL for a timeline's associated
annotations now traverses the full relational depth.


## [1.1.0] - 2018-12-11

### Added

- Edit video screen allows moving video to another timeline
- Video list shows timeline title
- Data tables use an optional requestTransform function
to process rows on each data update
- Info button in the post-annotator shows video metadata
(so far only title)
- Hyperlinks in annotations are clickable in the
post-annotator
- Limited markdown support for annotations
(allowed tags: 'b', 'i', 'em', 'strong', 'a', 'br', 'p')
- Videos can be tagged
- Vuex module 'tags' - stores and retrieves tags as
annotations

### Changed

- Video list is sorted descending on reference
date by default
- Look of top right buttons in post-annotator
- Users need to explicitly click 'edit' to change
an annotation in the post-annotator
- External titles stored as annotations are retrieved
within the metadata store module
- BrowserWarning and MarkdownDisplay components moved to
[mbjs-quasar](https://gitlab.rlp.net/motionbank/mbjs/quasar)
- Readme info
- Pinned and updated runtime dependencies

### Fixed

- Post-annotation no longer fails when the duration
of a video cannot be retrieved
- Editing external title annotations
- Tables are properly searchable
- Timeline list updates after deleting an item

### Removed

- Old Github badges, CI and code review configs


## [1.0.0] - 2018-12-04

### Added

- Changelog document

### Changed

- Start proper versioning at 1.0.0


[Unreleased]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v2.2.0...release_2_2
[2.2.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v2.1.2...v2.2.0
[2.1.2]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v2.1.1...v2.1.2
[2.1.1]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v2.1.0...v2.1.1
[2.1.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v2.0.0...v2.1.0
[2.0.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.10...v2.0.0
[1.3.10]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.9...v1.3.10
[1.3.9]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.8...v1.3.9
[1.3.8]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.7...v1.3.8
[1.3.7]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.6...v1.3.7
[1.3.6]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.5...v1.3.6
[1.3.5]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.4...v1.3.5
[1.3.4]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.3...v1.3.4
[1.3.3]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.2...v1.3.3
[1.3.2]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.1...v1.3.2
[1.3.1]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.3.0...v1.3.1
[1.3.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.2.1...v1.3.0
[1.2.1]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.2.0...v1.2.1
[1.2.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.1.1...v1.2.0
[1.1.1]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.1.0...v1.1.1
[1.1.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.0.0...v1.1.0
[1.0.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/initial...v1.0.0
