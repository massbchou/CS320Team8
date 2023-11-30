export default top_users_algo;

function cutoff_string(name_to_cut) {
  if (name_to_cut.length < 20) {
    return name_to_cut;
  } else {
    //name is too long for bubble
    while (name_to_cut.length >= 19) {
      name_to_cut = name_to_cut.slice(0, name_to_cut.lastIndexOf(" "));
    }
    return name_to_cut + "...";
  }
}

function top_users_algo(usersList, start, end) {
  /**
   * Takes in list of users and returns list sorted by most activity within interval
   * Start and end times should be Date objects
   */
  let top_users = [];
  if (Object.keys(usersList).length === 0) {
    return top_users;
  }

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
      if (date === "_id" || date === "author") continue;
      dateTime = new Date(date);
      if (start > dateTime || dateTime > end) continue;
      //goes through all the dates that a post or comment was made
      num_posts = usersList[i][date].postCount;
      total_posts += num_posts;
      num_comments = usersList[i][date].commentCount;
      total_comments += num_comments;
      //Score = 2*num_posts + 1*num_comments
      count += 2 * num_posts + 1 * num_comments;
    }
    authors[i] = { full_name: author_name, post: total_posts, comment: total_comments, engagement_count: count };
  }
  //Now order based on descending post number
  authors.sort((a, b) => b.engagement_count - a.engagement_count);
  console.log(authors.slice(0,5));
  top_users = authors.map((res) => cutoff_string(res.full_name));
  return top_users;
}
