import mp from "../missingParameter";

/**
 * Takes in an array of posts and gets the number of posts and comments for each day
 * Filters posts between start and end dates (inclusive)
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

/**
 * Gets next minDate (minDate + delta) depending on delta:
 * - 1: daily -> simply add delta
 * - 7: weekly -> start on monday of week
 * - 30: monthly -> start on first day of month
 * - else: default to weekly
 * @param {Date} next
 * @param {7 | 30 | 365} delta
 * @returns {Date} new date
 */
export function getNextMinDate(date = mp(), delta = mp()) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + delta);
  return getFirstDate(next, delta);
}
/**
 * Gets first date of interval depending on delta
 * - 1: daily -> same date
 * - 7: weekly -> start on monday of week
 * - 30: monthly -> start on first day of month
 * - else: default to weekly
 * @param {Date} date
 * @param {7 | 30 | 365} delta
 * @returns {Date} first date of interval
 */
export function getFirstDate(date = mp(), delta = mp()) {
  if (delta === 7) {
    // weekly, get monday of week
    const day = date.getUTCDay(); // # of day in week (sunday = 0, saturday = 7)
    const monday = date.getUTCDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    date.setUTCDate(monday);
  } else if (delta >= 30) {
    // monthly, get first day of month
    date.setUTCDate(1);
  }
  // else daily, simply return date
  return date;
}
