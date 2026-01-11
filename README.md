# Instagram Folls Dashboard
An Instagram Dashboard Management system designed to monitor, analyze, and manage Instagram account data such as followers, followings, mutual connections, and engagement-related insights in a structured and visualized way.
<br><br>
Made for one of my Project Portfolio...


## Features
### Main Dashboard Analytics
   - Card preview data including total data, average followers & following, top 3 highest followers & following, and the oldest–newest Instagram accounts created.
   - Bar chart to show data including followers, following, and gap distribution with a customized scale and maximum range.
   - Scatter plot to show the X–Y relationship between followers and following with an outlier remover.
   - Pie chart to show the proportion of private–public and mutual–non-mutual accounts across all Instagram data.
   - Multiple bar chart to compare average followers, following, and gap between all relations.
<br>
<img width="1920" height="877" alt="Screenshot (569)" src="https://github.com/user-attachments/assets/1523cf2c-b5e2-4ded-bae6-890cdf2065a3" />
<img width="1463" height="730" alt="Screenshot (576)" src="https://github.com/user-attachments/assets/27d0488e-5918-4e44-9dd7-a5fe2dfb337b" />
<img width="1500" height="558" alt="Screenshot (577)" src="https://github.com/user-attachments/assets/4fd08d57-677e-42c3-93ec-446d08bdaaf8" />
<img width="1495" height="560" alt="Screenshot (578)" src="https://github.com/user-attachments/assets/13720b61-8f08-484e-ad81-bef8e00b2aae" />

### Table of Instagram User Data
   - Shows all detailed Instagram user data, including Instagram ID, Username, Full Name, Is Private, Followers, Following, Gap, Total Posts, Biography, Is Mutual, Relations, and ranking among all data.
   - Uses a search bar to find specific Instagram usernames and filters to display data by privacy status, mutual status, or existing relations.
   - Download all data in three selected formats (CSV, JSON, XLSX), or all of them.
<br>
<img width="1920" height="874" alt="Screenshot (570)" src="https://github.com/user-attachments/assets/92b68c10-3020-403b-9102-cbc2a1c04487" />

### Instagram Users CRUD<br>
   Do Create, Read, Update, and Delete for Instagram user data. You can modify all personal Instagram user data, followers–following and media counts, and set all relationships between Instagram users.
<br><br>
<img width="1920" height="874" alt="Screenshot (579)" src="https://github.com/user-attachments/assets/0dfb78e7-a436-4133-97fa-03113a2dab7a" />

### Relational CRUD<br>
   Do Create, Read, Update, and Delete for relational badge data. You can change the naming of relations and customize the badge background and text colors.
<br><br>
<img width="1920" height="876" alt="Screenshot (580)" src="https://github.com/user-attachments/assets/efc77087-a11f-4a12-98b8-753bc30adcd6" />

### Personal Profile
   View your personal Instagram data information and change the main center account.
<br><br>
<img width="1920" height="875" alt="Screenshot (573)" src="https://github.com/user-attachments/assets/02305810-f954-48fd-9eb5-724fc801e916" />


## App Architecture
<img width="1182" height="361" alt="Project Diagram Documentation drawio(1)" src="https://github.com/user-attachments/assets/51f0af84-b5e8-449b-ac71-2f7c9a1a642e" />


## Tech Stack
1. Frontend
   - React.js + Vite
   - Typescript
   - TailwindCSS
   - Chart.js
3. Backend
   - Node.js
   - Express.js
   - Prisma ORM
   - MySQL
   - PostgreSQL
   - REST API
4. Insta Scrapping
   - Python
   - Instagrapi Library
   - Pandas Library
   - SQLAlchhemy Library


## Requirements
1. Visual Studio Code
2. Node.js (default version: v22.15.0)
3. PostgreSQL or MySQL
4. Python (default version: 3.12.7)


## Program Setup
### Instagram Scrapping
1. Make ```.env``` file for setup environment<br>
   Make sure data is correct and DON'T USE YOUR REAL INSTAGRAM, MAKE A DUMMY ACCOUNT FOR THIS EXPERIMENT
   ```js
   # Account Username and Password for Instagram Login
   ACCOUNT_USERNAME = YOUR_INSTAGRAM_USERNAME_HERE
   ACCOUNT_PASSWORD = YOUR_INSTAGRAM_PASSWORD_HERE
   
   # Target PK for Data Scrapping of specific Instagram
   INSTA_TARGET_PK = TARGET_ACCOUNT_PRIMARY_KEY_HERE
   
   # PostgreSQL Database Seeding using CSV file
   DATABASE_URL = YOUR_DATABASE_URL_HERE
   CSV_FILE_PATH = YOUR_CSV_FILE_PATH_HERE
   ```
2. Do scrapping for Instagram data, there are two methods.
   - Mutual of Personal or Target Instagram (Target Based on INSTA_TARGET_PK on .env)
      - Use this ```instaapi_webscrap_mutual.py``` file
      - Change code in this part (too busy for makin optional param 😂), choose only one
        ```js
        # Option 1: Use own account
        # Get user ID from username
        user_id = cl.user_id_from_username(ACCOUNT_USERNAME)
         
        # Option 2: Use another profile
        # Get user ID use from another profile
        user_id = int(INSTA_TARGET_PK)
        ```
      - Run Python file
      - You can choose to get data for mutual, followers not follback by you, and following that not follback you
   - Specific Username Array<br>
      - Use this ```instaapi_webscrap_username.py``` file
      - Change Code in this part (too busy for makin txt reader 😂)
        ```js
        # Replace with actual target usernames
        target_usernames = ['lorem_ipsum', 'dolor_sit_amet']
        ```
      - Run Python file
3. After scrapping done, there are 3 files that created in CSV, JSON, and XLSX
4. Copy directory of that CSV file to .env
5. Do importing data to PostgreSQL Database (make sure you have a database created first), by run  ```csv_import_db.py``` file.
  
### Backend Side
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

### Frontend Side
1. Run ```npm install``` first to install all dependencies
2. Make ```.env``` file for setup environment<br>
   ```js
   # Default: localhost:3000
   VITE_BACKEND_URL=YOUR_BACKEND_URL_HERE
   ```
   Note: Ensure the backend server is running before starting the frontend
3. Run Frontend Server by ```npm run dev```
4. Enjoy using the application 😁!


## Relational Database Table
<img width="822" height="382" alt="Project Diagram Documentation drawio" src="https://github.com/user-attachments/assets/27d20e88-0503-49a7-95bc-ffb3f0e3fc65" />


## Disclaimer
This project is intended for educational and internal analysis purposes only.<br>
Use of Instagram data must comply with Instagram’s Terms of Service.


## Author
<b>Jason Rivalino</b>
