### Built with:

Next.js
Tailwind css
Prisma (ORM)
Supabase (Database, Storage, and Authentication)

#### Running the app:

This app uses Supabase.

You need to install the [Supabase CLI](https://github.com/supabase/cli)

Once installed you can run `supabase start`

This will produce a number of values such as:

Started local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs

Create a .env file in the root directory of the project.
Fill in the values provided in .env.template with the values provided by `supabase start`.

You will likely need to setup and migrate the database:

- Run the migrations `npx prisma migrate deploy`

You can also run `npx prisma db seed` to seed the database.

Run the development server:

yarn dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stripe testing

Use the following credit card numbers with any other info for testing:
Payment succeeds:

```
4242 4242 4242 4242
```

Payment requires authentication:

```
4000 0025 0000 3155
```

Payment is declined:

```
4000 0000 0000 9995
```

## Prisma

### Creating A Migration

Change the schema to look like you want it to and then run:

npx prisma migrate dev --name [MIGRATION NAME]

### Deploy database changes

npx prisma db deploy
