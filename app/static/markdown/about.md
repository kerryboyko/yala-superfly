## YALA: Yet Another Link Aggregator

### Who are you?

I'm [Kerry Boyko](https://linkedin.com/in/kerryboyko). I'm a senior software engineer with eight years experience, but I had to move back from the UK to the US to get some medical care. I also had to leave my job to do so, so right now I'm spending much of my time looking for a new one. This is my side project, a built-from-the-ground-up clone of Reddit. (Which itself could have been said to be a built-from-the-ground-up clone of Digg, if I recall correctly...)

The idea is not to create a toy project that can show you can "code" (if I was fresh out of school, I'd have a number of such projects), but this site has been built _to scale_. This is because I wanted a challenge like those I am currently facing in my career. It's designed to keep my skills sharp and learning new technologies and new approaches to application development.

### Why another link aggregator?

Honestly, because I think we kind of need one.

I _really_ adored Reddit. It was an amazing way to learn about all sorts of projects, to connect with community and like-minded individuals. Yes, there were some cesspools on there, but some bright spots too.

About a month ago as of this writing (July 2023), I deleted my Reddit account of 15 years, in response to how the company behind Reddit decided to respond to people who had concerns about the API changes. Personally, I couldn't care less about the API changes, but the idea of forcibly removing moderators from the communities they built from the ground up, was insane, especially considering that the only value that Reddit had was created not by the company's technology but by the moderators and users of the site. (Nobody goes to Reddit to ooh and awe at the source code, or ponder the database, not even me!)

Indeed, this was a known problem in social media which was documented in an article in Wired Magazine by Cory Doctorow, entitled (forgive the language), ["The 'Enshittification' of Tik Tok"]("https://www.wired.com/story/tiktok-platforms-cory-doctorow/"). From that article:

> **Here is how platforms die**: First, they are good to their users; then they abuse their users to make things better for their business customers; finally, they abuse those business customers to claw back all the value for themselves. Then, they die.

All of that seemed to be what happened to Digg - and one of the reasons that Reddit overtook Digg. It also seemed to happen with Facebook, with Amazon, and it certainly has happened with Twitter.

I thought I could do better.

### Right, but why _another_ link aggregator?

Okay, I get that. There are some absolutely well designed applications - Lemmy and Kbin among them, that, like Mastodon for Twitter, use the Activity Pub standard in order to create a federation of interrelated link aggregators.

And I like them, but I found them frustrating to use, even though I'm kind of a power user. Say what you want about it, but centralization was _the_ killer app of Reddit. Discussion forums have been on the Internet since, well, before there _was_ an Internet, in the form of dial up BBS boards. But you had to know the number to dial in, and you were restricted by location (or maybe not if you were really good with that Captain Crunch whistle and could make free phone calls.)

Those BBS boards gave way to Usenet newsgroups - a centralized way to communicate. And there was a lovely time as people had fun with alt.swedish-chef.bork.bork.bork. However, sadly, Usenet's technology didn't withstand the spammers, becuase it lacked tools for effective moderation.

From Usenet newsgroups came BBForum and other web-based forums which could be effectively moderated, but once again were hard to find, spread out, and you didn't have a central identity. You also had to know exactly where you were going.

Reddit's big draw was _centralization with moderation_. Like Usenet, everything was in one place. Unlike Usenet, things could be more or less moderated. Like the bulletin boards and BBS boards, they could cover every topic under the sun, but you only needed one login to start posting about every topic. Indeed, chances are if the topic existed, there was a forum dedicated to it.

What Lemmy and Kbin are trying to do is not centralization but _federation_, and while federation is, in my professional opinion, _really neat_, it isn't centralization. You can kinda-sorta have one login, but because you have one login, that doesn't mean you can easily interact with people on other Lemmy or Kbin instances as easily and seamlessly as interacting on Reddit. It can be hard to have the same experience as everyone else, as different servers have different rules about what data they pull down from other clients. In other words, it's just... not the same.

The problem with Reddit was not technological. The problem was the business model. I think I might have a way to solve that.

### Okay, what do you mean, "business model?"

All of these social network sites tend to engage in Doctorow's 'enshittification' cycle because they are operating in order to _maximize profit._ And maximizing profit means that (in the words of Cat Valente), the push once the social network is established as a forum of conversation is to tell users to stop communicating and start spending money. That's really what the API drive of Reddit was about: you provided value to us for free, now we're going to charge _you_ to provide value to _us_.

From [Cat Valente](https://catvalente.substack.com/p/stop-talking-to-each-other-and-start):

> Stop talking to each other and start buying things. Stop providing content for free and start paying us for the privilege. Stop shining sunlight on horrors and start advocating for more of them. Stop making communities and start weaponizing misinformation to benefit your betters.
>
> It’s the same. It’s always been the same. _Stop benefitting from the internet, it’s not for you to enjoy, it’s for us to use to extract money_ from _you. Stop finding beauty and connection in the world, loneliness is more profitable and easier to control._
>
> _Stop being human. A mindless bot who makes regular purchases is all that’s really needed._

It's hyperbole, but not by much.

The interesting thing about all of this is that there was one, very well known social media site, where people can and do collaborate, where they do provide value, where they, despite the fact that human beings tend to screw up things that they touch, has actually created something good and decent and grand.

Wikipedia.

And that's because Wikipedia is run as a non-profit company. They don't have to answer to shareholders as to why they haven't maximized profit, so they can make concious choices not to run ads, to turn down money from interested parties who wish to puff themselves up or detract from their competitors. Somehow, the Wikimedia foundation has made things _actually work._

Once this site has reached what I would consider to be a "minimum viable product", I intend to launch it and then set it up as a non-profit using the Wikimedia Foundation model. I have no idea if it will succeed.

### Right, so, what does that mean?

Right now - nothing much. Sign up, try it out. Kick the tires. Hopefully this place will eventually get some critical mass and we'll see what happens from there.

## Tech stuff

### Can I fork the source code?

By all means! [Here you go!](https://github.com/kerryboyko/YetAnotherLinkAggregator)

### Will you be adding ActivityPub?

Not for the minimum viable product. There may be a way to integrate existing ActivityPub published entities with Yala, but if so, the idea would still be to make it operate seamlessly with the rest of the site, so that we don't lose the benefit of centralization.

### What's your tech stack?

- This is being built on the [Remix Supa-Fly stack](https://github.com/rphlmr/supa-fly-stack). 
- [Remix](https://remix.run/) is a front-end/back-end framework that uses the technology behind [React Router](https://reactrouter.com/en/main) to create a server-side rendering framework for React that supports nested routes.  It is similar to, but distinct from, Next.js.
- The main BaaS (backend as a service) provider is [Supabase](https://supabase.com/), chosen because they have simple authentication using JWT tokens and provide a Postgres database.  
  - [PostgreSQL](https://www.postgresql.org/) Postgres was chosen both because of the relational nature of conversational data and the ability to handle JSON data, which means that altering future schemas for future needs won't be as challenging compared to something like MariaDB.
  - The auth services are also provided by Supabase and rely on cookie storage of JWT tokens, which are passed in the header of the user's requests (when logged in). 
- The ORM used for that database is [Prisma](https://www.prisma.io/), (which honestly, coming from Knex.js and raw SQL, feels like cheating!).
- Deployment is on [Fly.io](https://fly.io).
- The base UI framework is using [Shadcn/UI](https://ui.shadcn.com/), a command line tool based on [Radix](https://www.radix-ui.com/).
- Styling is done using SCSS.
  - Thanks to Yomesh Gupta for his article on devtools.tech: ["Setting up SASS with Remix Run"](https://devtools.tech/blog/setting-up-sass-with-remix-run---rid---lXDyMjDSdDZDXxNcJ2ep)
- Unit Testing will be done via Jest; integration testing via Cypress.

### What are the immediate issues you're working on?

- [X] Login via username and password
- [X] Login via email (magic-link)
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

## Special Thanks:

Special thanks go to the [Remix Discord Server](https://rmx.as/discord) for helping me with some thorny issues getting used to the framework.
