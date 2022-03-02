### Built with:

Next.js
Tailwind css
Prisma (ORM)
Supabase (Database, Storage, and Authentication)

#### Running the app:

Create a .env file in the root directory of the project.
Fill in the values provided in .env.template

Run the development server:

yarn dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prisma

### Creating A Migration

Change the schema to look like you want it to and then run:

npx prisma migrate dev --name [MIGRATION NAME]

### Deploy database changes

npx prisma db deploy
