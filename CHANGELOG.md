# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## v4.8.0
#### New
- [Request] Add blob() support for images response

## v4.7.0
#### New
- [Request] Add Basic auth support `Request.withBasicAuth(login, password)`

## v4.6.5
#### New
- [Request] Add the original response to the error object passed to `displayRestError()`

## v4.6.3
#### Fixed
- [Request] Extract response status whatever the response type is

## v4.6.2
#### Fixed
- [Request] Pass good response error to `displayRestError()` (response rerror was undefined) 

## v4.6.1
#### Fixed
- [Request] Pass good response status to `displayRestError()` (status was always set to 404)

## v4.6.0
#### Fixed
- [Request] Clone `Request.Config` to be able to have multiple instances of Request with different configurations
- [All] Replace "LodashUtils" by lodash library (cherry-picking done by `babel-plugin-lodash`) 

## v4.5.2
#### Fixed
- [Request] Use text parser if `Content-type` response header contains 'text'.
Some text responses (ex: `text/html`) were parsed as JSON, but they should be parsed as text.

## v4.5.1
#### Fixed
- [Request] Rollback missing argument from Promise rejection.
If response failed (status != 2xx), give back full response object and json content. Exemple: `catch({response, json})`

## v4.5.0
#### New
- [Request] Support "text/plain" responses

## v4.4.3
#### Fixed
- Update release script : no need to pass a "v" before version number when releasing

## v4.4.2
#### Fixed
- [Request] Fix typo

## v4.4.1
#### Fixed
- [Request] Fix "progress" callback (now using xhr2.upload.progress)

## v4.4.0
#### Changed
- [node] Upgrade node-sass and fsevents to support Node 10.15.3

## v4.3.1
#### Fixed
 - [Request] Some BadRequest wasn't catched because of a bad argument
 
## v4.3.0
#### New
 - [React] Support React 16

## v4.2.1
#### Fixed
 - [Request] Fixed issue related to bad usage of Request options. Now using `getOptions()` to access options.

## v4.1.0
#### New
 - [Request] Add `withTimeOut()` to set a timeout on the Promise. Do not misunderstood with `enableTimeout()` which enable a timeout for spinner 


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
