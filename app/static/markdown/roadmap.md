## Current Roadmap

### What are the items you're stuck on, or postponing at this point, but which are important.

- [ ] Login via social auth (via Supabase) does not seem to be working.  Part of that seems to be a bug with the latest Supabase library, but I may also have configured my callback URL wrong in Supabase. 
- [ ] Similarly, items that require callbacks, such as "forgot password", are also not working, possibly because it is always redirection to production rather than my local machine for development. 
- [ ] If login is done via a social network, it requires a second landing page for users to enter their usernames. 

### What are the immediate issues you're working on?

- [x] Login via username and password
- [ ] Login via email (magic-link)
- [ ] Once logged in, check if the user has set up a profile yet. If no, send them to /create-profile
- [ ] Provide form to create profile.
- [ ] Reconnect previously written functionality using new Auth provider. (Long story short - this was originally written using FusionAuth as the auth provider but Supabase was just a better solution. Rather than try to add Supabase to the existing repo, it was just quicker to create a new Remix Supa-Fly project.)

### What's on the roadmap?

On the roadmap as of 7/18/2023

- [ ] Upvotes & Downvotes for posts and comments
- [ ] "Reactions" (like Slashdot moderation) for posts and comments
- [ ] "Tags" so that users can tag posts and comments for easy retrieval later
- [ ] Subscriptions to communities
- [ ] A list of most popular communities (by page loads, by subscribers, by posts, by comments, etc)
- [ ] A list of most popular posts (by page loads, by comments, by upvotes, etc)
- [ ] A list of the most relevant & recent (using a "special sauce" to determine page rank from a combination of upvotes and time since posting)
- [ ] A moderation tool
- [ ] Integration with 3rd Party Auth Services (such as Google.)
- [ ] Unit & Integration testing. Normally I do TDD first, but I needed to get used to the Remix environment.
