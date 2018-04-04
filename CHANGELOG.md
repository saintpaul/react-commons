# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).


## v4.0.0
#### Changed
 - Bump version
 - [Request] Give more control by adding `enableWithCredentials()` and `disableWithCredentials()` functions to easily instantiate a new Request instead of going through `Configuration` object. 
 - [Request] Refactor `Request` by replacing boolean options with `forceOptions`, which is more robust and easier to maintain for future options. 
 

## v3.0.0
#### Changed
 - [Webpack] We have moved from `Gulp` to `Webpack`.
 - [CallAjax] `Call ajax` doesn't exists anymore. It's `Request` now. It's using `fetch` and `XmlHttpRequest` (to listen upload progress) instead of `$.ajax`. However, the API is still more or less the same. 
 - [Spinner] The spinner has been splitted into `Spinner` and `GlobalSpinner`. `Spinner` is just a simple spinner while `GlobalSpinner` has more logic and should be only once in the DOM (like the old one).
 - [Reflux] Reflux has been upgraded to the latest version. Now, in addition to `RefluxComponent`, we also have `RefluxListener` which is a decorator.
 - [classnames] `classnames` has been moved from `dependencies` to `peerDependencies`

### New
 - [Compose] A `composer` has been added. This allows us to compose a pure component with data retrieving (actions/store) easily. An example has been provided in the demo.

#### Removed
 - Dependencies/PeerDependencies removed : `jquery`, `aggregation`, `lodash`

## v2.0.0 
#### Changed
 - Moved Dependencies to PeerDependencies to load them from project
 - [AlertBox] Updating LODASH require call and reworking call to not use chaining method


## v1.4.0 
[All Commits](https://github.com/saintpaul/react-commons/compare/v1.3.2...v1.4.0)
### Added
 - [Spinner] Spinner has progress and message both optionally. Timeout is hiding progress and message to display timeout message
 - [Spinner] New Spinner. Actions available, `updateProgress(progress, msg)`and `updateMessage(message)`
