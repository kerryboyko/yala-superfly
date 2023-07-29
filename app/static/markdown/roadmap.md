## Ready for Users!

Howdy. YALA is in super-early alpha stage. You'll find items marked as "FIXME" or hit with a strikethrough.  These are placeholders to indicate that the functionality is not yet developed, but it will be soon.  

In the meantime, feel free to go around and kick the tires! Try:

* [/c/yaladev - Yala Development Community](/c/yaladev)
* [/allposts - a list of all the posts (so far)](/allposts)
* [/allcommunities - a list of all the communities (so far)](/allcommunities)

### Check out the Github!
[This is the github link for the sourcecode - if you find an issue, feel free to report it!](https://github.com/kerryboyko/yala-superfly)

## Current Roadmap

### Just completed:

- [x] Authors (but not moderators) can now edit posts.
- [x] Authors and moderators can now delete posts. 

### What are the items you're stuck on, or postponing at this point, but which are important.

- [ ] Add "loading" to various buttons (subscribe/unsubscribe/delete) to let the user know it's working. 
- [ ] Login via social auth (via Supabase) does not seem to be working.  Part of that seems to be a bug with the latest Supabase library, but I may also have configured my callback URL wrong in Supabase. 
- [ ] Similarly, items that require callbacks, such as "forgot password", are also not working, possibly because it is always redirection to production rather than my local machine for development. 
- [ ] If login is done via a social network, it requires a second landing page for users to enter their usernames. 
- [ ] I want to provide header images for communities, but it might make sense to create the community first before the header image is added. Thus, any moderator may change the community header, community headers will have filenames based on the community, etc. 
- [ ] I forgot to add 'locking' posts in the database schema so adding that functionality will have to wait until the next big schema migration change; I'm likely to figure out a ton of these little things so that I can just add a 'meta' JSONB field to my Posts or Community tables that can handle these unexpected needs.  Oops!

### What are the immediate issues you're working on?

- [x] Login via username and password
- [x] Created separate Supabase projects for production and development - a "Kick the tires" methodology. The sooner I can get real people to look at the bugs on the site, the sooner I can continue working on them, so I'm creating two DBs, one for production and one for development.  
- [ ] Login via email (magic-link)
- [x] Reconnect previously written functionality using new Auth provider. (Long story short - this was originally written using FusionAuth as the auth provider but Supabase was just a better solution. Rather than try to add Supabase to the existing repo, it was just quicker to create a new Remix Supa-Fly project.)

### What's on the roadmap?

On the roadmap as of 7/18/2023

- [ ] Upvotes & Downvotes for posts and comments
- [ ] "Reactions" (like Slashdot moderation) for posts and comments
- [ ] "Tags" so that users can tag posts and comments for easy retrieval later
- [x] Subscriptions to communities
- [ ] A list of most popular communities (by page loads, by subscribers, by posts, by comments, etc)
- [ ] A list of most popular posts (by page loads, by comments, by upvotes, etc)
- [ ] A list of the most relevant & recent (using a "special sauce" to determine page rank from a combination of upvotes and time since posting)
- [x] A moderation tool to ban/unban users
- [ ] Integration with 3rd Party Auth Services (such as Google.)
- [ ] Unit & Integration testing. Normally I do TDD first, but I needed to get used to the Remix environment.

### What's *not* on the roadmap?

- I've decided I'm not doing social share buttons. Check out [this post](https://solomon.io/why-im-done-with-social-media-buttons/) as why I don't think it's a feature users want or need. 