
import json

input_file = "followers_test.json"
output_file = "followers_extracted.json"

# Read JSON file
with open(input_file, "r", encoding="utf-8") as file:
    json_data = json.load(file)

# Extract values only
data = [
    string_data["value"]
    for item in json_data
    for string_data in item.get("string_list_data", [])
    if "value" in string_data
]

# Save as a JSON array
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print(f"Successfully extracted {len(data)} values!")
