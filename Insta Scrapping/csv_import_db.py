# Data transformation and loading script to import Instagram data from a CSV file into a PostgreSQL database.
# The script reads a CSV file, transforms the data to match the database schema, and loads it into the specified PostgreSQL table.

import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

# STEP 1: INITIAL SETUP
# Get environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
CSV_FILE_PATH = os.getenv("CSV_FILE_PATH")

# Making connection to PostgreSQL
engine = create_engine(DATABASE_URL)

# Read CSV file
df = pd.read_csv(CSV_FILE_PATH)

# ------------------------------------------------------

# STEP 2: DATA TRANSFORMATION
# Drop column 'id' because it's auto-incremented in the database
df = df.drop(columns=["id"], errors="ignore")

# Change column names to match database schema
df = df.rename(columns={
    "pk": "pk_def_insta",
    "full_name": "fullname",
    "profile_pic_url_hd": "profile_picture",
    "media_count": "media_post_total",
    "follower_count": "followers",
    "following_count": "following",
})

# Ensure all necessary columns are present
required_columns = [
    "pk_def_insta",
    "username",
    "fullname",
    "is_private",
    "media_post_total",
    "followers",
    "following",
    "biography",
]
df = df[required_columns]

# Add is_mutual column to set its value to True (indicating mutual followers)
df["is_mutual"] = True
df["last_update"] = pd.Timestamp.now().floor("s")

# Change data types if necessary
df["pk_def_insta"] = df["pk_def_insta"].astype("int64")
df["is_private"] = df["is_private"].astype(bool)
df["media_post_total"] = df["media_post_total"].astype(int)
df["followers"] = df["followers"].astype(int)
df["following"] = df["following"].astype(int)
df["is_mutual"] = df["is_mutual"].astype(bool)

# ------------------------------------------------------

# STEP 3: DATA LOADING
# Load data into PostgreSQL
df.to_sql(
    "Main_Instagram_Data", # Name of the target table in the database
    engine,
    if_exists="append",
    index=False
)

print("Import CSV ke PostgreSQL berhasil")