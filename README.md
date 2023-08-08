# YALA - Yet Another Link Aggregator, Codebase
## Development

- Create a [Supabase Database](https://supabase.com/) (free tier gives you 2 databases)

  > **Note:** Only one for playing around with Supabase or 2 for `staging` and `production`

  > **Note:** Used all your free tiers ? Also works with [Supabase CLI](https://github.com/supabase/cli) and local self-hosting

  > **Note:** Create a strong database password, but prefer a passphrase, it'll be more easy to use in connection string (no need to escape special char)
  >
  > _example : my_strong_passphrase_

- Go to https://app.supabase.io/project/{PROJECT}/settings/api to find your secrets
- "Project API keys"
- Add the following to the .env file: 
  - `SUPABASE_URL`, 
  - `SERVER_URL` (is your localhost on dev, likely "http://localhost:3000"), 
  - `SUPABASE_SERVICE_ROLE` (aka `service_role` `secret`), 
  - `SUPABASE_ANON_PUBLIC` (aka `anon` `public`) and 
  - `DATABASE_PASSWORD`
  - `SESSION_SECRET` (a secret to use with sessions)
  - `SUPABASE_REFERENCE_ID` (ie., the random name superbase assigns your project)
  - `OAUTH_CALLBACK` (needs to be full URL. For dev, this should be `http://localhost:3000/oauth/callback`)
  - `DB_CONNECTION_STRING` (`postgresql://postgres:<YOUR DATABASE PASSWORD>@db.<SUPABASE REFERENCE ID>.supabase.co:5432/postgres`)
  - `HEADER_IMAGE_STORAGE_BUCKET` (set to `yala-header-images` - and create a 'yala-header-images' bucket in your supabase)

You will also need to run a series of commands:

- Install the node packages
```sh
npm i
```

- Setup and seed the database. 
```sh
npm run setup
```

- Start dev server:
```sh
  npm run dev
```


## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

## Start working with Supabase

You are now ready to go further, congrats!

To extend your Prisma schema and apply changes on your supabase database :

- Make your changes in [./app/database/schema.prisma](./app/database/schema.prisma)
- Prepare your schema migration
  ```sh
  npm run db:prepare-migration
  ```
- Check your migration in [./app/database/migrations](./app/database)
- Apply this migration to production

  ```sh
  npm run db:deploy-migration
  ```

## If your token expires in less than 1 hour (3600 seconds in Supabase Dashboard)

If you have a lower token lifetime than me (1 hour), you should take a look at `REFRESH_ACCESS_TOKEN_THRESHOLD` in [./app/modules/auth/session.server.ts](./app/modules/auth/session.server.ts) and set what you think is the best value for your use case.
