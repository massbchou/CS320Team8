import json

data = None
with open("users.json", "rt") as f:
    data: list[dict] = json.load(f)
print(len(data))

seenUsers = []
for user in data:
    seenUsers.append(user["author"]["id"])
    seenDates = []
    for key, val in user.items():
        if key == "author":
            continue
        date = user[key]
        # check counts
        assert date["postCount"] == len(date["postIds"])
        assert date["commentCount"] == len(date["commentIds"])
        assert date["totalCount"] == len(date["postIds"]) + len(date["commentIds"])
        # check duplicates
        assert len(date["postIds"]) == len(set(date["postIds"]))
        assert len(date["commentIds"]) == len(set(date["commentIds"]))
        assert key not in seenDates
        seenDates.append(key)
assert len(data) == len(seenUsers)