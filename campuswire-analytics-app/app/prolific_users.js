export default prolific_users_algo

function cutoff_string(name_to_cut){
  if (name_to_cut.length < 20){
    return name_to_cut;
  }
  else{//name is too long for bubble
    while(name_to_cut.length >= 19){
      name_to_cut = name_to_cut.slice(0,name_to_cut.lastIndexOf(' '));
    }
    return name_to_cut+"...";
  }
}

function prolific_users_algo(data){
    //authors = firstName + " " + lastName
    let authors = [data.length];
    for(let i = 0; i < data.length; i++){ //for all the posts
      let count = 0;
      //Regardless if the post is anonymous or not it has an author field with first and last name
      let author_name = data[i].author.firstName + " " + data[i].author.lastName;
      
      for(let date in data[i]){
        if(!(date === "_id" || date === "author")){//goes through all the dates that a post or comment was made by a specific user
          let num_posts = data[i][date].postCount;
          let num_comments = data[i][date].commentCount;
          // Score = 2*num_posts + 1*num_comments
          count += 2*num_posts+1*num_comments;
        }
      }
      authors[i]={full_name: author_name, engagement_count: count};
    }
    //Now order based on descending post number
    authors.sort((a, b) => b.engagement_count - a.engagement_count);
    let prolific_users = authors.filter((res,i)=> i<5).map((res, i) => cutoff_string(res.full_name));
    console.log(prolific_users);
    return prolific_users;
  }