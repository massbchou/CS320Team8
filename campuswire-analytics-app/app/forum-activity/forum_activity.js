import Feature from "../feature";
import {
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScal,
} from "chart.js";

/**
 * Goes through posts within start and end date and checks for:
 * - Number of posts 60%
 * - Comments 40%
 *
 * @param posts [post objects]
 * @param start Date object
 * @param end Date object
 * @param delta int describing length of time to divide interval into
 * e.g. weekly (7 days), daily (1 day), etc
 * last chunk of posts may be smaller than delta bc not enough posts
 * @returns [chunk: {posts: [post objects], score: int}]
 */
export function getForumActivity(posts, start, end, delta) {
  let postWeight = 6;
  let commentWeight = 10 - postWeight;
  return (
    posts
      // filter posts within start and end publishedAt time
      .filter((post) => {
        let postTime = new Date(post.publishedAt);
        return start < postTime && postTime < end;
      })
      // sort posts by increasing publishedAt time
      .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))
      // split array into chunks of time by delta time
      .reduce((acc, _, i, arr) => {
        if (i % delta === 0)
          acc.push({ posts: arr.slice(i, i + delta), score: 0 });
        return acc;
      }, [])
      // get activity score for each chunk
      .map((chunk) => {
        chunk.posts.forEach((post) => {
          chunk.score += postWeight;
          // posts always have comments field with at least empty array
          chunk.score += commentWeight * post.comments.length;
        });
        return chunk;
      })
  );
}

/**
 * Returns feature on main page.js
 */
export function renderForumActivityFeature(forumActivity) {
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
export function renderForumActivityGraph(forumActivity) {
  // TODO: insert graph here
  return <></>;
}
