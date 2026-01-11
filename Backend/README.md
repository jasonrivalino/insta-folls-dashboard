# Running Backend Side
1. Run ```npm install``` first to install all dependencies
2. Make ```.env``` file for setup environment<br>
   ```js
   # Example for PostgreSQL
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/databaseName?schema=public"
   
   # Example for MySQL
   # DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/databaseName"
   # DB_HOST=localhost
   # DB_PORT=3306
   # DB_USER=YOUR_USERNAME
   # DB_PASSWORD="YOUR_PASSWORD"
   # DB_NAME=databaseName
   ```
3. Change ```prisma.config.ts``` conditional based on database that want to use (PostgreSQL or MySQL)
   ```js
   import "dotenv/config";
   import { defineConfig, env } from "prisma/config";
   
   export default defineConfig({
     // schema: "prisma-postgre/schema.prisma",
     schema: "prisma-mysql/schema.prisma",
     migrations: {
       // path: "prisma-postgre/migrations",
       path: "prisma-mysql/migrations",
       seed: "tsx prisma-mysql/seed.ts",
     },
     datasource: {
       url: env("DATABASE_URL"),
     },
   });
   ```
4. Run ```npx prisma generate``` to generate prisma client
5. If you need to seed database, run this ```npx prisma db seed``` (MySQL only)
6. Change this condition based on database that you used on every controllers file
```js
// import prisma from '../lib/prisma-postgres' // Use postgres if needed
import prisma from '../lib/prisma-mysql' // Use mysql if needed
```
7. Run Backend Server by ```npm run dev```