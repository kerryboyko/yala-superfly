## Current Roadmap

Last update: August 24, 2023

### FEATURE FREEZE

- Release 0.1.0 ALPHA; 

Quite frankly, I've put off doing this for long enough.  We're now in a spot with the site where it can be considered to be more or less feature complete, even if it's not 100% where it needs to be with regards to login sessions, e-mail services, or etc.  

Right now, this site is less of a viable product, and more of a tech demo while I'm applying to jobs.  The problem is - this tech demo is not 100% where I would like to show the code. First, there's a lack of unit testing and integration testing.  Those were put to the side to deliver the features, but it can be put off no longer. 

Secondly, there are a number of scenarios where I'd like to simplify and organize the code base.  A lot of reusable database calls are in the /routes folder, when that really should be a 'seperate concern'. 

And finally, the SCSS files could use simplification and reorganization.  

So for that reason, I'm calling a feature freeze right now and calling what I have Release 0.1.0 ALPHA and get the site ready for Release 0.2.0 BETA. 

### Bugs Found

- 🔲 If the user is writing a reply and the token expires behind the scenes, the application, instead of trying to renew the token, will spit them out to the /login page to get that token refreshed. This means the user loses data they have entered. Annoying.

### Bugs Quashed

- ✅ Anonymous Users (who cannot vote) have shown that they _have_ voted - visual bug. -> Anonymous users now cannot vote and are not shown otherwise. Voting has a loading spinner to indicate processing time.
- ✅ Markdown does not render properly in Post Summary View. -> Markdown now renders properly in post-summary view.
- ✅ When a token expires, it doesn't notify the user. It should automatically refresh instead of kicking the user back to the /login route.
  - _This bug was caused because "remix-superfly", set the auto refresh and persist values manually to 'false', overriding the default of 'true'. (Cue the Simpsons meme: "Here's your problem, someone set this thing to evil.")_
- ✅ Elements now have loading spinners to indicate status (and prevent confusion as to whether the user needs to reload the page or click again.)
  - ✅ Voting now has a loading spinner
  - ✅ Creating communities now has a loading spinner
  - ✅ Creating posts now has a loading spinner
  - ✅ Creating comments now has a loading spinner
  - ✅ Creating replies now has a loading spinner
  - ✅ Subscribing now has a loading spinner

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
- ✅ Users can now add images to their posts via URLs. (but not yet edit them.)
- ✅ Authors can now edit post images as well as text.
- ✅ Visitors can now see a list of most popular communities by subscribers, and posts.
- ✅ Visitors can now see a list of most posts (by 'hotness', most recent, etc.)
- ✅ Users _creating a community_ can _upload_ a jpg/png/webp/gif header image to be stored on our servers.
- ✅ Moderators can now edit/update the description of their community, as well as the header image.

### What's _immediately_ next;

- 🔲 As a developer, I'd like Unit & Integration testing. (Normally I do TDD first, but I needed to get used to the Remix environment and see what features are feasible.)
### What's next?

- 🔲 As a site owner, I would like to require email confirmation for signups before a user can post.
- 🔲 As a user, I would like to place "Reactions" (like Slashdot moderation) for posts and comments
- 🔲 As a user, I would like to be able to tag posts and comments with arbitrary hashes.
- 🔲 As a user _making a post_ (but not a comment), I would like to be able to embed youtube videos.
- 🔲 As a user, I'd like to be able to get a share menu for posts (a popover) which allows me to copy a link to the clipboard or to have a downloadable HTML code that I can embed in a webpage.
- 🔲 As a user, I would like to have a way to semi-privately message other users, perhaps using real-time chat.
- 🔲 As a user, I would like to have a loading notification when I switch routes and load a new website. This should be available through Remix's useNavigation() hook.
- 🔲 As a moderator, I would like to 'lock' posts so that no more edits or comments can be made.
- 🔲 As a moderator, I would like to 'sticky' posts so that they always show up at the top of the page.
- 🔲 As a moderator, I would like to add other users as moderators

- 🔲 As a developer, I would like to have a blog system that uses markdown so that I can have a development blog.

### What is being postponed?

- 🔲 Error boundaries need to be configured and prettified.
- 🔲 I may offer support for private communities as a subscription service.

### Refactor Targets

- 🔲 SCSS files are servicable but might be simplified for reuse. Undecided if we should just clean up the Scss itself or if Styled Components can be used with Remix's idiosyncratic CSS bundling while still retaining the performance benefits.
