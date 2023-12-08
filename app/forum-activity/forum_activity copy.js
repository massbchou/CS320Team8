import Feature from "../feature";
import mp from "../missingParameter";

/**
 * Goes through posts within start and end date and sums up:
 * - Number of posts 60%
 * - Comments 40%
 *
 * Notes:
 * - Use UTC date functions for reliability since post times are already UTC
 *
 * @param {post[]} allPosts array of post objects
 * @param {Date} start yyyy-mm-dd
 * @param {Date} end yyyy-mm-dd
 * @param {7 | 30 | 365} delta
 * - int describing chunk length of time to divide interval into
 * - interval: total window of time from start to end (inclusive)
 * - chunk: (typically smaller) interval of length `delta`
 *    - minDate starts on first day of chunk (e.g. for weekly, wednesday -> monday)
 *    - 1: daily -> same date
 *    - 7: weekly -> start on monday of week
 *    - 30: monthly -> start on first day of month
 *    - else: default to weekly
 *    - if last post date is before end of last chunk, last chunk will include all remaining posts
 * @param {"post" | "comment" | "all"} type of content to track
 * @returns {chunk[]} array of chunks as {posts: [post objects], score: int, startDate: int}
 */
export function getForumActivity(allPosts = mp(), start = mp(), end = mp()) {
  // if getting both posts and comments, use weighted scoring of posts + comments
  // else, weight is just 1 (score = # of posts/comments)
  let chunkMinDate = new Date(3000, 0, 1); // init with arbitrary maximum date 3000-01-01
  let prevIdx = 0;
  // filter posts within start and end publishedAt time
  const relPosts = allPosts.filter((post) => {
    const postDate = new Date(post.publishedAt.slice(0, 10)); // yyyy-mm-dd
    // get date of first post
    if (postDate < chunkMinDate) chunkMinDate = postDate;
    return start < postDate && postDate < end;
  });
  const intervals = { weekly: [], monthly: [], semester: [] };
  const firstPostDate = chunkMinDate;

  const deltas = [7, 30, 365];
  deltas.forEach((delta, i) => {
    chunkMinDate = getFirstDate(firstPostDate, delta);
    // compare post to nextMinDate to know when to make new chunk
    let nextMinDate = getNextMinDate(chunkMinDate, delta);

    Object.values(intervals)[i].push(
      ...relPosts
        // sort posts by increasing publishedAt time
        .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))

        // split array into chunks of time by delta time
        .reduce((acc, post, i, chunks) => {
          // get all posts from minDate to nextMinDate
          const postDate = new Date(post.publishedAt.slice(0, 10));
          const ifLastChunkSmallerThanDelta =
            i === chunks.length && nextMinDate + delta > end;
          // current post is after chunk, get next chunk
          if (postDate > nextMinDate || ifLastChunkSmallerThanDelta) {
            acc.push({
              posts: chunks.slice(prevIdx, i + 1),
              numPosts: 0,
              numComments: 0,
              startDate: new Date(
                new Date(chunkMinDate).getTime() + i * (24 * 60 * 60 * 1000),
              )
                .toISOString()
                .substring(5, 10),
            });
            // update min dates
            chunkMinDate = nextMinDate;
            nextMinDate = getNextMinDate(nextMinDate, delta);
            prevIdx = i;
          }
          return acc;
        }, [])

        // get activity score for each chunk
        .map((chunk) => {
          chunk.posts.forEach((post) => {
            // posts always have comments field with at least empty array
            chunk.numComments += post.comments.length;
          });
          chunk.numPosts = chunk.posts.length;
          // delete chunk.posts;
          return chunk;
        }),
    );
  });
  console.log(intervals);
  return intervals;
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

/**
 * Returns feature on page.js
 */
export function renderForumActivityFeature(forumActivity = mp()) {
  return (
    <Feature
      linkTo="forum-activity"
      title="Forum Activity"
      content={forumActivity.map((chunk) => chunk.score)}
    ></Feature>
  );
}
