# Changelog

This document tracks all important changes to the Motion Bank Systems Frontend.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Hyperlinks in annotations are now clickable in the post-annotator
- Limited markdown support for annotations (allowed tags: 'b', 'i', 'em', 'strong', 'a', 'br', 'p')
- Videos can now be tagged
- Vuex module 'tags' - stores and retrieves tags as annotations

### Changed

- Users need to explicitly click 'edit' to change an annotation in the post-annotator
- External titles stored as annotations are now retrieved within the metadata store module
- BrowserWarning and MarkdownDisplay components moved to [mbjs-quasar](https://gitlab.rlp.net/motionbank/mbjs/quasar)
- Readme info
- Updated Quasar CLI to v0.17.22
- Updated Quasar Framework to v0.17.18
- Pinned and updated runtime dependencies

### Fixed

- Timeline list now updates after deleting an item

### Removed

- Old Github badges, CI and code review configs


## [1.0.0] - 2018-12-04

### Added

- Changelog document

### Changed

- Start proper versioning at 1.0.0


[Unreleased]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/v1.0.0...master
[1.0.0]: https://gitlab.rlp.net/motionbank/systems-frontend/compare/initial...v1.0.0
