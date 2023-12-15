export default top_posts_algo;

/**
 * Truncates a string if its length exceeds 20 characters.
 * @param {string} name_to_cut - The string to truncate.
 * @returns {string} The truncated string.
 */
function cutoff_string(name_to_cut) {
  if (name_to_cut.length < 20) {
    return name_to_cut;
  } else {
    //name is too long for bubble so truncate after the space
    while (name_to_cut.length >= 19) {
      name_to_cut = name_to_cut.slice(0, name_to_cut.lastIndexOf(" "));
    }
    //add on ellipsis to indicate truncation
    return name_to_cut + "...";
  }
}
/**
 * Calculates the number of days between two dates.
 * @param {string} createdAtStr - The date the post was created.
 * @param {string} collectionDate - The current date for comparison.
 * @returns {number} The number of days difference.
 */
function days_old(createdAtStr, collectionDate) {
  const post_date = new Date(createdAtStr);
  const current_day = new Date(collectionDate);
  const days_diff = (current_day - post_date) / (1000 * 3600 * 24);
  return Math.floor(days_diff);
}

/**
 * Algorithm to determine top posts based on specific criteria.
 * @param {Array} data - Array of posts with associated data.
 * @param {string} collectionDate - The current date for comparison.
 * @returns {Array} An array of top posts titles.
 */
function top_posts_algo(data, collectionDate) {
  //Score = (1) * uniqueViews + (2) * repeatedViews + (20) * totalComments + (50) * totalLikes
  let top_posts = [];
  // If there's no data, return an empty array
  if (Object.keys(data).length === 0) {
    return top_posts;
  }
  let Score = [data.length];
  // Calculate scores for each post based on the Score algorithm
  for (let i = 0; i < data.length; i++) {
    let entry = data[i];
    let uniqueViews = entry.uniqueViewsCount;
    let repeatedViews = entry.viewsCount - entry.uniqueViewsCount;
    let num_comments = entry.comments.length;
    //if there is not a likesCount field the likes for the post are set to 0
    let num_likes = entry.likesCount ? entry.likesCount : 0;
    let decay_days = days_old(entry.createdAt, collectionDate);
    //Create an object {entry: data, score: #}
    Score[i] = {
      entry: entry,
      score:
        uniqueViews * 1 +
        repeatedViews * 2 +
        num_comments * 20 +
        num_likes * 50 -
        decay_days * 30,
    };
  }
  //Now order based on descending score and return an array of posts
  Score.sort(function (a, b) {
    return b["score"] - a["score"];
  });
  // Extract top 5 posts and truncate their titles if needed
  let ranked_posts = Score.map((pair) => pair["entry"]);
  top_posts = ranked_posts
    .filter((_, i) => i < 5)
    .map((res) => cutoff_string(res.title));
  return top_posts;
}
