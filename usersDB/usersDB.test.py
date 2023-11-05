import json

data = None
with open("users.json", "rt", encoding="utf-8") as f:
    data: list[dict] = json.load(f)
print(len(data))

postCount, commentCount, modCount = 0, 0, 0
seenUsers = []
for user in data:
    seenUsers.append(user["author"]["id"])
    seenDates = []
    for key, val in user.items():
        assert "author" in user
        # check role is member or moderator
        if key == "author":
            assert user[key]["role"] in ["member", "moderator"]
            if user[key]["role"] == "moderator":
                modCount += 1
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

        postCount += date["postCount"]
        commentCount += date["commentCount"]
assert len(data) == len(seenUsers)

print(postCount, commentCount, postCount + commentCount)
print(modCount)
