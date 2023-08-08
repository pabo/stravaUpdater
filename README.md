# POC to update recently recorded strava activities

## Description
It's `docker`ized, served by `express`, with a framework-less vanilla JS front end.

## Why does it exist?
After most runs I want to give the activity a title that is more descriptive than the default "Morning Run". Loading up the strava app and doing this is several steps with loading delays. This is faster.

## Why vanilla JS?
Sometimes you need to blow up the stack and go back to basics to really appreciate everything.

## Issues / TODOs
- storing strava api bearer token client side in a non-`httpOnly` cookie
- token timeout is pretty small, and we go through full oauth flow every time. can I use refresh token? or otherwise have strava remember that this user has already allowed access to the app?
- error handling is a little rough
