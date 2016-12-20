# react-commons
Set of reusable components for reactjs applications


## Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

### 2.0.0 
#### Changed
 - Moved Dependencies to PeerDependencies to laod them from project
 - [AlertBox] Updating LODASH require call and reworking call to not use chaining method


### 1.4.0 
[All Commits](https://github.com/saintpaul/react-commons/compare/v1.3.2...v1.4.0)
#### Added
 - [SPINNER] Spinner has progress and message both optionally. Timeout is hiding progress and message to disaply timeout message
 - [SPINNER] New Spinner.Actions available, `updateProgress(progress, msg)`and `updateMessage(message)`
