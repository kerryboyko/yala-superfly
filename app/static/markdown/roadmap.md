## Current Roadmap

Last update: August 1, 2023

### Bugs Found

- 🔲 Markdown does not render properly in Post Summary View. 
- 🔲 Sometimes, elements do not update right away, requiring a reload. This likely will be addressed when the "loading" spinners are added. 

### Bugs Quashed
- ✅ Anonymous Users (who cannot vote) have shown that they *have* voted - visual bug. 


### Completed:

- ✅ Signup and Login via Email/Password (basic, happy path)
- ✅ Signed in users can create communities.
- ✅ Signed in users can create posts on communities
- ✅ Signed in users can create comments on posts
- ✅ Signed in users can create comments on other comments
- ✅ Authors (but not moderators) can now edit posts.
- ✅ Authors and moderators can now delete posts.
- ✅ Login via username and password
- ✅ Login via Google Auth (and should be simple to do other Oauth providers)
- ✅ When a user logs in for the first time with GoogleAuth, they are prompted to choose a username so that they can contribute on the site. 
- ✅ Created separate Supabase projects for production and development - a "Kick the tires" methodology. The sooner I can get real people to look at the bugs on the site, the sooner I can continue working on them, so I'm creating two DBs, one for production and one for development.
- ✅ Reconnect previously written functionality using new Auth provider. (Long story short: this was originally written using FusionAuth as the auth provider but Supabase was just a better solution. Rather than try to add Supabase to the existing repo, it was just quicker to create a new Remix Supa-Fly project.)
- ✅ A moderation tool to ban/unban users from communities
- ✅ Users can vote on posts, and posts display how the user voted, as well as the total of all votes
- ✅ Users can vote on comments, and comments display how the user voted, as well as the total of all votes
- ✅ Banned users cannot create new posts, cannot create new comments, in communities where they are banned
- ✅ Users can reset their password via 'forgot-password'
- ✅ Authors can edit or delete comments
- ✅ Moderators can delete, but not edit comments.
- ✅ If a comment with children is deleted, the comment is marked as deleted, but not removed in the comment hierarchy.

### What's next? 

- 🔲 As a site owner, I would like to require email confirmation for signups before a user can post. 
- 🔲 As a user, I would like to place "Reactions" (like Slashdot moderation) for posts and comments
- 🔲 As a user, I would like to be able to tag posts and comments with arbitrary hashes.
- 🔲 As a visitor, I'd like to see a list of most popular communities by page loads, subscribers, posts, comments, etc.
- 🔲 As a visitor, I'd like to see a list of most posts (by votes, by visits, by 'hotness', most recent, etc.)
- 🔲 As a developer, I'd like Unit & Integration testing. (Normally I do TDD first, but I needed to get used to the Remix environment and see what features are feasible.)
- 🔲 As a user, I'd like to be able to get a share menu for posts (a popover) which allows me to copy a link to the clipboard or to have a downloadable HTML code that I can embed in a webpage.
- 🔲 As a user, I would like to upload avatars, images, community header images, etc. to bucket storage on supabase and have them displayed.
- 🔲 As a moderator, I would like to 'lock' posts so that no more edits or comments can be made. 
- 🔲 As a moderator, I would like to 'sticky' posts so that they always show up at the top of the page. 
- 🔲 As a user, I would like to add a direct message system. 
### What is being postponed?

- 🔲 Add "loading" to various buttons (subscribe/unsubscribe/delete) to let the user know it's working.
- 🔲 I want to provide header images for communities, but it might make sense to create the community first before the header image is added. Thus, any moderator may change the community header, community headers will have filenames based on the community, etc.
- 🔲 Error boundaries need to be configured and prettified.


