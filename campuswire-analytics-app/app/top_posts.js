export default top_posts_algo

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

function top_posts_algo(data){
  //Score = (1) * uniqueViews + (2) * repeatedViews + (20) * totalComments + (50) * totalLikes
  //Try to add Time Decay
  let Score = [data.length];
  for(let i = 0; i < data.length; i++){
    let entry = data[i];
    let uniqueViews = entry.uniqueViewsCount;
    let repeatedViews = entry.viewsCount - entry.uniqueViewsCount;
    let num_comments = entry.comments.length;
    //if there is not a likesCount field the likes for the post are set to 0
    let num_likes = entry.likesCount ? entry.likesCount : 0;
    //Create an object {entry: data, score: #}
    Score[i] = {entry: entry, score: uniqueViews*1 + repeatedViews*2 + num_comments*20 + num_likes*50 /*-30 entry.publishAt*/ };
  }
  //Now order based on descending score and return an array of posts
  Score.sort(function(a,b){return b['score']-a['score']});
  let ranked_posts = Score.map(pair => pair['entry']);
  let top_posts = ranked_posts.filter((res,i)=> i<5).map((res, i) => cutoff_string(res.title));
  return top_posts;
 }