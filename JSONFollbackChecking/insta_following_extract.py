
import json

input_file = "following_test.json"
output_file = "following_extracted.json"

# Read JSON file
with open(input_file, "r", encoding="utf-8") as file:
    json_data = json.load(file)

# Extract titles only
data = [
    item["title"]
    for item in json_data.get("relationships_following", [])
    if "title" in item
]

# Save as a JSON array
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print(f"Successfully extracted {len(data)} titles!")
