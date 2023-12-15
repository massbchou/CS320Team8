export default top_users_algo;

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
 * Function to determine the top users based on activity within a specified interval.
 * @param {Array} usersList - List of users with their activity data.
 * @param {Date} start - Start date of the interval.
 * @param {Date} end - End date of the interval.
 * @returns {Array} - List of top users sorted by activity within the interval.
 */
function top_users_algo(usersList, start, end) {
  /**
   * Takes in list of users and returns list sorted by most activity within interval
   * Start and end times should be Date objects
   */
  // List to store top users
  let top_users = [];
  if (Object.keys(usersList).length === 0) {
    return top_users;
  }

  // Array to hold user activity details
  //authors = firstName + " " + lastName
  let authors = [usersList.length];
  let count;
  let dateTime;
  let num_posts;
  let total_posts;
  let total_comments;
  let num_comments;
  for (let i = 0; i < usersList.length; i++) {
    //for all the posts
    count = 0;
    total_posts = 0;
    total_comments = 0;
    //Regardless if the post is anonymous or not it has an author field with first and last name
    let author_name =
      usersList[i].author.firstName + " " + usersList[i].author.lastName;

    for (let date in usersList[i]) {
      // Skip _id and author fields
      if (date === "_id" || date === "author") continue;
      dateTime = new Date(date);
      // Check if the activity falls outside the specified interval
      if (start > dateTime || dateTime > end) continue;
      //goes through all the dates that a post or comment was made
      num_posts = usersList[i][date].postCount;
      total_posts += num_posts;
      num_comments = usersList[i][date].commentCount;
      total_comments += num_comments;
      //Score = 2*num_posts + 1*num_comments
      // Calculate user engagement score based on post and comment count
      count += 2 * num_posts + 1 * num_comments;
    }
    // Store user activity details in the array
    authors[i] = {
      full_name: author_name,
      post: total_posts,
      comment: total_comments,
      engagement_count: count,
    };
  }
  //Now order based on descending post number
  authors.sort((a, b) => b.engagement_count - a.engagement_count);
  // Truncate names and store in top_users list
  top_users = authors.map((res) => cutoff_string(res.full_name));
  return top_users;
}
