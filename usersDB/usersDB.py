import json, copy
from typing import Literal
from pymongo import MongoClient


def main():
    data = None
    with open("2022-12-15.json", "rt") as f:
        data: list[dict] = json.load(f)
    allPosts, allComments = [], []
    users = getUsers(data, allPosts, allComments)

    numPosts, numComments = 0, 0
    for user in users:
        for key in user:
            if key == "author":
                continue
            numPosts += len(user[key]["postIds"])
            numComments += len(user[key]["commentIds"])
    # print(f"{len(allPosts)} + {len(allComments)} = {len(allPosts) + len(allComments)}")
    # if numPosts + numComments != 591 + 511 + 15:
    #     print(f"numPosts + numComments ({numPosts + numComments}) != 591 + 511 ({591 + 511})")
    #     return

    with open("users.json", "w") as f:
        out = json.dumps(users)
        f.write(out)

    # url = "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/"
    # client = MongoClient(url)
    # print(client)
    # collection = client.users.users  # users collection in users db
    # print(collection)
    # print("mongodb")


def getUsers(posts: list[dict], allPosts: list, allComments: list) -> list[dict]:
    """
    Parses input json file as a list of dicts (posts) and returns a list of user dicts

    Each entry (user object) of user database, based on "author" field:
    - id
    - slug
    - firstName
    - lastName
    - registered
    - role
    - {date 1}
        - [post ids]
        - [comment ids]
        - count (of posts + comments for this date)
        (post and comments are sorted by increasing date)
    - ...more dates
    """
    users = {}  # use user ids as keys
    incrDate = lambda content: content["publishedAt"]  # sort by increasing date

    # create users from posts
    for post in sorted(posts, key=incrDate):
        processContent(users, post, "postIds", allPosts, allComments)

        # process comments
        comments = post["comments"]
        for comment in sorted(comments, key=incrDate):
            processContent(users, comment, "commentIds", allPosts, allComments)

    return list(users.values())


def processContent(
    users: dict,
    content: dict,
    contentType: Literal["postIds", "commentIds"],
    allPosts: list,
    allComments: list,
) -> None:
    """
    Takes in post or comment dict and updates users dict

    Pulls from each post:
    - id (post id)
    - {author}
    - publishedAt
    - lastEditedAt
    - categoryId
    - [{comments}]
        - id (comment id)
        - {author}
            - id
        - publishedAt
        - lastEditedAt
    """
    contentId = content["id"]
    author = content["author"]
    dates = [content["publishedAt"][:10]]  # yyyy-mm-dd

    # add new user
    userId = author["id"]
    if userId not in users:
        users[userId] = {"author": copy.deepcopy(author)}

    # include content in multiple dates if edited (original + edit)
    if "lastEditedAt" in content:
        dates.append(content["lastEditedAt"][:10])

    user = users[userId]
    for date in dates:
        # initialize date
        if date not in user:
            user[date] = {
                "postIds": [],
                "commentIds": [],
                "postCount": 0,
                "commentCount": 0,
                "totalCount": 0
            }

        # update date
        if contentId in user[date][contentType]:
            continue  # ignore edits on same day
        user[date][contentType].append(contentId)
        user[date][f"{contentType[:-3]}Count"] += 1  # postIds - Ids + Count = postCount
        user[date]["totalCount"] += 1
        if contentType == "postIds":
            allPosts.append(contentId)
        else:
            allComments.append(contentId)


if __name__ == "__main__":
    main()
