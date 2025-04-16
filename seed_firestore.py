import requests
import json

url = "http://localhost:9999/task-me-later/us-central1/seed_firestore"

with open("seed_data.json", "r") as f:
    payload = json.load(f)

response = requests.post(url, json=payload)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
