This is a simple POC with the strava API.

It will go through an OAuth process, then make the following actions on behalf of the logged in user:
- list activities in the last 6 hours and take the first of these
- update the activity's name to 'Easy'

That's it!

There's no statefulness to the client side, there's no particular thought to async or error handling. Future improvements would have to address those and more.