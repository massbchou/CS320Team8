import json
import copy
from typing import Literal
from datetime import timedelta
from dateutil import parser


def main():
    """
    Creates users.json file with all users
    """
    postsList = None
    with open("2022-12-15.json", "rt", encoding="utf-8") as postsJSON:
        postsList = json.load(postsJSON)
    users = getUsers(postsList)

    with open("users.json", "w", encoding="utf-8") as usersJSON:
        out = json.dumps(users)
        usersJSON.write(out)


def getUsers(postsList: list[dict]) -> list[dict]:
    """
    Parses input json file as a list of dicts (posts) and returns a list of user dicts

    Each entry of user database:
    - {author}
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
    - ...more dates

    Notes:
    - Forum activity is defined as posting, commenting, and editing a post/comment on a different
      date than it was published.
    - Post/comments are sorted by increasing date
    - Dates are sorted by increasing date
        - May be out of order if edit date of a post/comment is after the next normal post/comment
          date
    """
    users: dict[dict] = {}  # use user ids as keys
    incrDate = lambda content: content["publishedAt"]  # sort by increasing date

    # create users from posts
    for post in sorted(postsList, key=incrDate):
        processContent(users, post, "postIds")

        # process comments
        commentsList = post["comments"]
        for comment in sorted(commentsList, key=incrDate):
            processContent(users, comment, "commentIds")

    # label users as member or moderator
    addUsersRole(users, postsList)

    return list(users.values())


def processContent(
    usersDict: dict[dict], content: dict, contentType: Literal["postIds", "commentIds"]
) -> None:
    """
    Takes in post or comment dict and updates users dict

    Pulls from each post:
    - id (post id)
    - {author}
    - publishedAt
    - lastEditedAt
    - [{comments}]
        - id (comment id)
        - {author}
        - publishedAt
        - lastEditedAt
    """
    contentId = content["id"]
    author = content["author"]
    datesList = [content["publishedAt"][:10]]  # yyyy-mm-dd

    # add new user
    userId = author["id"]
    if userId not in usersDict:
        usersDict[userId] = {"author": copy.deepcopy(author)}
    user = usersDict[userId]

    # include content in multiple dates if edited (original + edit)
    if "lastEditedAt" in content:
        datesList.append(content["lastEditedAt"][:10])

    for date in datesList:
        # initialize date
        if date not in user:
            user[date] = {
                "postIds": [],
                "commentIds": [],
                "postCount": 0,
                "commentCount": 0,
                "totalCount": 0,
            }

        # update date
        if contentId in user[date][contentType]:
            continue  # ignore edits made on same day
        user[date][contentType].append(contentId)
        user[date][f"{contentType[:-3]}Count"] += 1  # e.g. postIds - Ids + Count = postCount
        user[date]["totalCount"] += 1


def addUsersRole(usersDict: dict[dict], postsList: list[dict]) -> None:
    """
    Overwrites each user role with "member" or "moderator"
    - Old role was 0 for all users so it was meaningless (probably revoked mod privileges at end of
      semester)

    Posts that were answered by a mod have a "modAnsweredAt" time field. We assume that comments
    published to those posts at the same time were written by a mod. To avoid false positives caused
    by students coincidentally posting comments at the same time, we track how many comments fall
    within the same time frame as "modAnsweredAt":
    - Check for comments made on post within 1 second of modAnsweredAt
    - If probableModComments >= 2: user is mod

    Rationale:
    If a student is looking at the post when a mod answers, they might quickly leave a
    short "thanks" comment. To avoid counting these we give a 2 second window (+-1) and there are
    86400 seconds in a day. Assuming independence, the probability of a student commenting at the
    same time is 2/86400 ~= 0.00002. To minimize false positives, we also require at least 2
    matching comments which would make the odds of a student commenting within a second twice be 1
    in 20 billion, assuming that they aren't camping posts.

    Limitations:
    - Does not acknowledge posts - only comments
    - Assumes that each mod is the first to answer 2 posts
    - Some professors are hands-off and leave comments to TAs/UCAs - can be labeled as member
    - Can't use exact time because modAnsweredAt and corresponding comment have slightly different
      times (~100 ms)
    - If a student is trying to beat world record reply speeds, can be labeled as moderator
    """
    # init mod comment count for each user
    probableModCommentCount = {userId: 0 for userId in usersDict.keys()}

    # count mod comments
    for post in postsList:
        if "modAnsweredAt" not in post:
            continue
        modAnsweredTime = parser.parse(post["modAnsweredAt"])  # datetime object
        oneSecond = timedelta(seconds=1)
        comments = post["comments"]

        # check for comments published within 1 second of modAnsweredAt
        for comment in comments:
            userId = comment["author"]["id"]
            commentTime = parser.parse(comment["publishedAt"])
            if modAnsweredTime - oneSecond < commentTime < modAnsweredTime + oneSecond:
                probableModCommentCount[userId] += 1

    # add role to user
    for userId, user in usersDict.items():
        user["author"]["role"] = "moderator" if probableModCommentCount[userId] >= 2 else "member"


if __name__ == "__main__":
    main()
