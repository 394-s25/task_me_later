import requests

response = requests.get("http://localhost:9999/task-me-later/us-central1/get_user?id=1")
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")

response = requests.post(
    "http://localhost:9999/task-me-later/us-central1/add_user",
    json={"username": "added another"},
)
