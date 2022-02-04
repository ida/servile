# servile changelog


## 1.2.3 (2022-02-04)

* Fix index-file not found. 'index' needed to be added to
  request.url too, not only to filePath.


## 1.2.2 (2022-02-03)

* Display errors in webpage.

* Turn off caching for static-files.


## 1.2.1 (2022-02-01)

* Fix #5 remove interest-cohort of response-header, errors in chrome.

* Fix #4 html/json-file not found.

* Fix markdown-files load forever: Changed mimetype.

* Add style for default answer for 404 "not found".

## 1.2.0 (2021-11-03)

* Redirect post-requests, so on a browser-reload forms do not
  accidentally get submitted again, and the browser doesn't
  prompt a warning (PRG-pattern).

## 1.1.9 (2021-11-02)

* Add package "node-static" for serving static files.

## 1.1.8 (2021-06-14)

* Do not close request for server-side-events.

## 1.1.7 (2021-06-09)

* Pass response also to default-views indexless-dir and not-found.

## 1.1.6 (2021-06-02)

* Remove RELOAD-option, add note about using nodemon instead.

## 1.1.5 (2021-06-02)

* Improve server-side-events: Allow exporting funcs.

## 1.1.4 (2021-05-28)

* Support server-side-events.

## 1.1.3 (2021-05-11)

* Fix isDirectory.

## 1.1.2 (2021-04-18)

* Correct using Python-comment instead of JS-comment.

## 1.1.1 (2021-04-18)

* Protect Chrome-users from being tracked, a.k.a. FLoC off Google.

## 1.0.9 (2021-03-26)

* Fix string gets served as JSON, better be HTML.

## 1.0.8 (2021-03-26)

* Enable a script returns an object and serve it as JSON.

## 1.0.7 (2021-03-25)

* Correct path for main-script.

## 1.0.6 (2021-03-25)

* Fix unintended overwrite of default options.

* Enable passing functions for indexless directories and url not found.

## 1.0.5 (2021-03-24)

* Enable passing options to serve().

## 1.0.4 (2021-03-18)

* Fix posted values which contain spaces get replaced with plus signs.

## 1.0.3 (2021-03-18)

* Fix index-files not found on glitch.com. See #1.


## 1.0.2 (2019-10-11)

* Allow waiting for promise-fullfillment in dynamic answers.


## 1.0.1 (2019-09-16)

* Reduce unnecessary complexity: For dynamic answers only
  regard the case a string is returned and send it as HTML.

* Add explanation in README why one could want a dynamic file
  to not return anything.


## 1.0.0 (2019-09-14)

* Initial release.
