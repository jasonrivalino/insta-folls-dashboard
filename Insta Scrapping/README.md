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