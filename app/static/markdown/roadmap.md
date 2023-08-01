## Current Roadmap

### Completed:

- [x] Signup and Login via Email/Password (basic, happy path)
- [x] Signed in users can create communities.
- [x] Signed in users can create posts on communities
- [x] Signed in users can create comments on posts
- [x] Signed in users can create comments on other comments
- [x] Authors (but not moderators) can now edit posts.
- [x] Authors and moderators can now delete posts.
- [x] Login via username and password
- [x] Login via Google Auth
- [x] Created separate Supabase projects for production and development - a "Kick the tires" methodology. The sooner I can get real people to look at the bugs on the site, the sooner I can continue working on them, so I'm creating two DBs, one for production and one for development.
- [x] Reconnect previously written functionality using new Auth provider. (Long story short: this was originally written using FusionAuth as the auth provider but Supabase was just a better solution. Rather than try to add Supabase to the existing repo, it was just quicker to create a new Remix Supa-Fly project.)
- [x] A moderation tool to ban/unban users from communities
- [x] Users can vote on posts, and posts display how the user voted, as well as the total of all votes
- [x] Users can vote on comments, and comments display how the user voted, as well as the total of all votes
- [x] Banned users cannot create new posts, cannot create new comments, in communities where they are banned
- [x] Users can reset their password via 'forgot-password'
- [x] Authors can edit or delete comments
- [x] Moderators can delete, but not edit comments.
- [x] If a comment with children is deleted, the comment is marked as deleted, but not removed in the comment hierarchy.

### What are the items you're stuck on, or postponing at this point, but which are important.

- [ ] Add "loading" to various buttons (subscribe/unsubscribe/delete) to let the user know it's working.
- [ ] Login via social auth (via Supabase) does not seem to be working. Part of that seems to be a bug with the latest Supabase library, but I may also have configured my callback URL wrong in Supabase.
- [ ] Similarly, items that require callbacks, such as "forgot password", are also not working, possibly because it is always redirection to production rather than my local machine for development.
- [ ] If login is done via a social network, it requires a second landing page for users to enter their usernames.
- [ ] I want to provide header images for communities, but it might make sense to create the community first before the header image is added. Thus, any moderator may change the community header, community headers will have filenames based on the community, etc.
- [ ] I forgot to add 'locking' posts in the database schema so adding that functionality will have to wait until the next big schema migration change; I'm likely to figure out a ton of these little things so that I can just add a 'meta' JSONB field to my Posts or Community tables that can handle these unexpected needs. Oops!
- [ ] Error boundaries need to be configured and prettified.

### What are the immediate issues you're working on?

- [ ] Add confirmation to email signups

### What's on the roadmap?

On the roadmap as of 7/18/2023

- [ ] As a moderator, I would like to delete comments (but leave any replies), and make sure the comment cannot be rewritten.
- [ ] As a user, I would like to place "Reactions" (like Slashdot moderation) for posts and comments
- [ ] As a user, I would like to be able to tag posts and comments with arbitrary hashes.
- [ ] As a visitor, I'd like to see a list of most popular communities by page loads, subscribers, posts, comments, etc.
- [ ] As a visitor, I'd like to see a list of most posts (by votes, by visits, by 'hotness', most recent, etc.)
- [ ] As a developer, I'd like Unit & Integration testing. (Normally I do TDD first, but I needed to get used to the Remix environment and see what features are feasible.)
- [ ] As a user, I'd like to be able to get a share menu for posts (a popover) which allows me to copy a link to the clipboard or to have a downloadable HTML code that I can embed in a webpage.
