import LineChart from "@/components/LineChart";
import Feature from "../feature";
import mp from "../missingParameter";
import {
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Young_Serif } from "next/font/google";
const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
});

/**
 * Goes through posts within start and end date and sums up:
 * - Number of posts 60%
 * - Comments 40%
 *
 * Notes:
 * - Use UTC date functions for reliability since post times are already UTC
 *
 * @param {post[]} posts array of post objects
 * @param {Date} start yyyy-mm-dd
 * @param {Date} end yyyy-mm-dd
 * @param {1 | 7 | 30} delta
 * - int describing chunk length of time to divide interval into
 * - interval: total window of time from start to end (inclusive)
 * - chunk: (typically smaller) interval of length `delta`
 *    - minDate starts on first day of chunk (e.g. for weekly, wednesday -> monday)
 *    - 1: daily -> simply add delta
 *    - 7: weekly -> start on monday of week
 *    - 30: monthly -> start on first day of month
 *    - else: default to weekly
 *    - if last post date is before end of last chunk, last chunk will include all remaining posts
 * @param {"post" | "comment" | "all"} type of content to track
 * @returns {chunk[]} array of chunks as {posts: [post objects], score: int, startDate: int}
 */
export function getForumActivity(
  posts = mp(),
  start = mp(),
  end = mp(),
  delta = mp(),
  type = null,
) {
  // if getting both posts and comments, use weighted scoring of posts + comments
  // else, weight is just 1 (score = # of posts/comments)
  const postWeight = type === "all" ? 6 : 1;
  const commentWeight = type === "all" ? 10 - postWeight : 1;
  let chunkMinDate = new Date(3000, 0, 1); // init with arbitrary maximum date 3000-01-01
  let prevIdx = 0;
  // filter posts within start and end publishedAt time
  const relPosts = posts.filter((post) => {
    const postDate = new Date(post.publishedAt.slice(0, 10)); // yyyy-mm-dd
    // get date of first post
    if (postDate < chunkMinDate) chunkMinDate = postDate;
    return start < postDate && postDate < end;
  });
  // compare post to nextMinDate to know when to make new chunk
  chunkMinDate = getFirstDate(chunkMinDate, delta);
  let nextMinDate = getNextMinDate(chunkMinDate, delta);
  return (
    relPosts
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
            score: 0,
            startDate: chunkMinDate,
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
          if (type === "post" || type === "all") chunk.score += postWeight;
          if (type === "comment" || type === "all")
            chunk.score += post.comments.length * commentWeight;
        });
        return chunk;
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
 * @param {1 | 7 | 30} delta
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
 * @param {1 | 7 | 30} delta
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
 * Returns feature on main page.js
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

/**
 * Renders a line graph depicting forum activity
 * x-axis: timeline
 * y-axis: forum activity score
 *
 * @returns jsx block to add to page.js
 */

export function renderForumActivityGraph(forumActivity = mp()) {
  // TODO: insert graph here
  /* 
  LineChart takes in data: {labels: str[], datasets: {
    data: number[]
    ...for more properties see https://www.chartjs.org/docs/latest/charts/line.html
  }}
  */
  const chartData = {
    labels: forumActivity.map((chunk, i) => i),
    // labels: forumActivity.map((chunk) => chunk.startDate),
    datasets: [
      {
        label: "Forum Activity",
        data: forumActivity.map((chunk) => chunk.score),
        backgroundColor: "white",
        borderColor: "rgb(75, 192, 192)",
        tension: 0.2,
      },
    ],
  };
  console.log(chartData);
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px",
        width: "25%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: youngSerif,
            fontSize: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.70)",
            borderRadius: "10px",
            width: "100%",
            padding: "6px",
            marginBottom: "9px",
            marginRight: "9px",
          }}
        >
          {"Forum Activity"}
        </div>
      </div>
      <LineChart chartData={chartData} />
    </div>
  );
}
