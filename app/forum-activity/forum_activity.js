import mp from "../missingParameter";

/**
 * Takes in an array of posts and gets the number of posts and comments for each day
 * Filters posts between start and end dates, both inclusive
 * Each day is represented as an object {numPosts: int, numComments: int}
 * @param {post[]} allPosts
 * @param {Date} start
 * @param {Date} end
 * @returns {{numPosts: int, numComments: int}[]}
 * array of objects containing number of posts and comments
 */
export function getForumActivity(allPosts = mp(), start = mp(), end = mp()) {
  let currentDate = new Date(3000, 0, 1); // init with arbitrary maximum date 3000-01-01
  let prevIdx = 0;
  return (
    allPosts
      // filter posts within start and end publishedAt time
      .filter((post) => {
        const postDate = new Date(post.publishedAt.slice(0, 10)); // yyyy-mm-dd
        // get date of first post
        if (postDate < currentDate) currentDate = postDate;
        return start <= postDate && postDate <= end;
      })

      // sort posts by increasing publishedAt time
      .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))

      // split posts into days
      .reduce((curDate, post, i, relPosts) => {
        const postDate = new Date(post.publishedAt.slice(0, 10));
        // current post is after current date, get next date
        // or is last post
        if (postDate > currentDate || i === relPosts.length) {
          curDate.push({
            posts: relPosts.slice(prevIdx, i + 1),
            numPosts: 0,
            numComments: 0,
          });
          // update current date
          currentDate = postDate;
          prevIdx = i;
        }
        return curDate;
      }, [])

      // get number of posts/comments for each date
      .map((date) => {
        date.numPosts = date.posts.length;
        date.numComments = date.posts.reduce(
          (sum, post) => sum + post.comments.length,
          0,
        );
        delete date.posts; // dont need posts anymore
        return date;
      })
  );
}
