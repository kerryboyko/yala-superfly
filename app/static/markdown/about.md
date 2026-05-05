### Who are you?

I'm [Kerry Ann Burke](https://linkedin.com/in/kerryboyko). I'm a senior software engineer with ten years experience. This is a sideproject I built in 2023 to keep my skills fresh, to learn Remix, and to learn how to use Supabase for application deployment. 

This is a built-from-the-ground-up clone of Reddit. (Which itself could have been said to be a built-from-the-ground-up clone of Digg, if I recall correctly...)

The idea is to create a "larger-than toy" project. This site has been built _to scale_. This is because I wanted a challenge like those I am currently facing in my career. It's designed to keep my skills sharp and learning new technologies and new approaches to application development.

### Why another link aggregator?

Reddit as a link aggregator is essentially a clone of Digg, but what it does, it does well, especially with recursive nests of comments.  

There are some absolutely well designed applications - Lemmy and Kbin among them, that, like Mastodon for Twitter, use the Activity Pub standard in order to create a federation of interrelated link aggregators.

And I like them, but I found them frustrating to use, even though I'm kind of a power user. Say what you want about it, but centralization is _the_ killer app of Reddit. Discussion forums have been on the Internet since, well, before there _was_ an Internet, in the form of dial up BBS boards. But you had to know the number to dial in, and you were restricted by location (or maybe not if you were really good with that Captain Crunch whistle and could make free phone calls.)

Those BBS boards gave way to Usenet newsgroups - a centralized way to communicate. And there was a lovely time as people had fun with alt.swedish-chef.bork.bork.bork. However, sadly, Usenet's technology didn't withstand the spammers, becuase it lacked tools for effective moderation.

From Usenet newsgroups came BBForum and other web-based forums which could be effectively moderated, but once again were hard to find, spread out, and you didn't have a central identity. You also had to know exactly where you were going.

Reddit's big draw is _centralization with moderation_. Like Usenet, everything was in one place. Unlike Usenet, things could be more or less moderated. Like the bulletin boards and BBS boards, they could cover every topic under the sun, but you only needed one login to start posting about every topic. Indeed, chances are if the topic existed, there is a forum dedicated to it.

What Lemmy and Kbin are trying to do is not centralization but _federation_, and while federation is, in my professional opinion, _really neat_, it isn't centralization. You can kinda-sorta have one login, but because you have one login, that doesn't mean you can easily interact with people on other Lemmy or Kbin instances as easily and seamlessly as interacting on Reddit. It can be hard to have the same experience as everyone else, as different servers have different rules about what data they pull down from other clients. In other words, it's just... not the same.

Not to mention that it suffers from what my friend Andy calls the "One Guy In Kansas" problem. It costs money to host a federated instance, and you are at the whim of the person hosting the service to keep your account and connections. If they're doing it for fun, the site will go down when it stops being fun and starts being work. If they're doing it for money, the site will go down when the money stops flowing.

Federation is a way to create a robust network out of individually fragile instances; but nobody wants their user experience to be "individually fragile."

### Can I fork the source code?

By all means! [Here you go!](https://github.com/kerryboyko/yala-superfly)

### Will you be adding ActivityPub?

Not for the minimum viable product. There may be a way to integrate existing ActivityPub published entities with Yala, but if so, the idea would still be to make it operate seamlessly with the rest of the site, so that we don't lose the benefit of centralization.

### What's your tech stack?

- This is being built on the [Remix Supa-Fly stack](https://github.com/rphlmr/supa-fly-stack).
- [Remix](https://remix.run/) is a front-end/back-end framework that uses the technology behind [React Router](https://reactrouter.com/en/main) to create a server-side rendering framework for React that supports nested routes. It is similar to, but distinct from, Next.js.
  - It should be pointed out - Next.js _can_ do nested routes. Remix was designe _around_ nested routes from the ground up. 
- The main BaaS (backend as a service) provider is [Supabase](https://supabase.com/), chosen because they have simple authentication using JWT tokens and provide a Postgres database.
  - [PostgreSQL](https://www.postgresql.org/) Postgres was chosen both because of the relational nature of conversational data and the ability to handle JSON data, which means that altering future schemas for future needs won't be as challenging compared to something like MariaDB.
  - The auth services are also provided by Supabase and rely on cookie storage of JWT tokens, which are passed in the header of the user's requests (when logged in).
- The ORM used for that database is [Prisma](https://www.prisma.io/), (which honestly, coming from Knex.js and raw SQL, feels like cheating!).
- Deployment is on [Fly.io](https://fly.io).
- The base UI framework is using [Shadcn/UI](https://ui.shadcn.com/), a command line tool based on [Radix](https://www.radix-ui.com/).
- Styling is done using SCSS. Tailwind _is_ installed to support Shadcn/ui, but I don't like it and I don't use it in my code.
  - Thanks to Yomesh Gupta for his article on devtools.tech: ["Setting up SASS with Remix Run"](https://devtools.tech/blog/setting-up-sass-with-remix-run---rid---lXDyMjDSdDZDXxNcJ2ep)
- Unit Testing will be done via Jest; integration testing via Cypress.

## Special Thanks:

Special thanks go to the [Remix Discord Server](https://rmx.as/discord) for helping me with some thorny issues getting used to the framework.

Thanks also go to my mom, who doesn't understand why anyone would want to use a site like this, but helpfully caught two misspelled words in this About page.

And thanks to Andy, who introduced me to a very similar project with a very similar model.

## Update for May 2026

I'm reviewing this code again after a while as I've just completed an M.A. and am returning from education into the workforce. 

"If I knew then what I knew now" is the unofficial motto of software engineers. Here's what I've learned:

* The node ecosystem moves underneath your feet. Old codebases need constant maintainance. This is why, I think, enterprises tend to stick with using C#/.NET or Java Spring Boot for backend services. (Indeed, I've started learning C#/.NET and the quality of life features, especially for connecting to databases, is silvery smooth.)