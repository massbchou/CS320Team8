import json


def main():
    """
    Creates testPosts.json file with minimal fields of all posts
    """
    postsList = None
    with open("2022-12-15.json", "rt", encoding="utf-8") as postsJSON:
        postsList = json.load(postsJSON)
    testPosts, numPosts, numComments = scrapePosts(postsList)
    print(numPosts, numComments)

    with open("testPosts.json", "w", encoding="utf-8") as testPosts:
        out = json.dumps(testPosts)
        testPosts.write(out)


def scrapePosts(postsList):
    """
    Pulls from each post and returns list of minimized posts with:
    - id
    - publishedAt
    - comments
        - id
        - publishedAt
    """
    posts = {}
    numPosts, numComments = 0, 0
    for post in postsList:
        postId = post["id"]
        posts[postId] = {"id": postId, "publishedAt": post["publishedAt"], "comments": []}

        for comment in post["comments"]:
            posts[postId]["comments"].append(
                {"id": comment["id"], "publishedAt": comment["publishedAt"]}
            )
            numComments += 1
        numPosts += 1

    return list(posts.values()), numPosts, numComments

def createPosts():
    posts = {}
    numMonths = 2
    for month in range(numMonths):
        pass

    return list(posts.values())


if __name__ == "__main__":
    main()
