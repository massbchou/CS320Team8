// mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/
import {MongoClient} from "mongodb";
import Image from "next/image";
import goldstar_nobackground from '../public/goldstar_nobackground.png';
import silverstar_nobackground from '../public/silverstar_nobackground.png';
import bronzestar_nobackground from '../public/bronzestar_nobackground.png';

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

function ranking_match(index){
  if(index == 0){
    return goldstar_nobackground;
  }
  else if(index == 1){
    return silverstar_nobackground;
  }
  else if(index == 2){
    return bronzestar_nobackground;
  }
}

function top_post_algo(data){
  //Score = (1) * uniqueViews + (2) * repeatedViews + (20) * totalComments + (50) * totalLikes
  let Score = [data.length];
  for(let i = 0; i < data.length; i++){
    let entry = data[i];
    let uniqueViews = entry.uniqueViewsCount;
    let repeatedViews = entry.viewsCount - entry.uniqueViewsCount;
    let num_comments = entry.comments.length;
    //if there is not a likesCount field the likes for the post are set to 0
    let num_likes = entry.likesCount ? entry.likesCount : 0;
    //Create an object {entry: data, score: #}
    Score[i] = {entry: entry, score: uniqueViews*1 + repeatedViews*2 + num_comments*20 + num_likes*50};
  }
  //Now order based on descending score and return an array of posts
  Score.sort(function(a,b){return b['score']-a['score']});
  let top_posts = Score.map(pair => pair['entry']);
  return top_posts;
 }

function prolific_users_algo(data){
  //authors = firstName + " " + lastName
  let authors = [data.length];
  for(let i = 0; i < data.length; i++){
    //Regardless if the post is anonymous or not it has an author field with first and last name
    let author_name = data[i].author.firstName + " " + data[i].author.lastName;
    authors[i]={full_name: author_name};
  }
  //Gets the count for each name in the array of author objects
  const num_posts = authors.reduce((r, o) => {
    Object.values(o).forEach(e => r[e] = (r[e]||0) + 1)
    return r;
  }, {});
  //Create an array of objects {full_name: name, num_posts: #}
  const authors_num_posts = Object.keys(num_posts).map(name =>({full_name: name, num_posts: num_posts[name]}));
  //Now order based on descending post number
  authors_num_posts.sort((a, b) => b.num_posts - a.num_posts);
  console.log(authors_num_posts);
  return authors_num_posts;
}

export default async function Mongo() {
  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/";
  const client = new MongoClient(url);

  let top_posts;
  let prolific_users;

  try {
    // connect to mongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // get collection "2022-12-15" from database "posts" gives access to all the posts
    const collection = client.db("posts").collection("2022-12-15");

    //find top posts for the Semester
    const entry_data = collection.find({});
    top_posts = top_post_algo(await entry_data.toArray());

    //find most prolific users for the Semester
    const users_data = collection.find({});
    prolific_users = prolific_users_algo(await users_data.toArray());
  } catch (e) {
    console.log("There was an error in connecting to mongo")
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main className="mainscreen">
      <div className='toppostsbox'>
        <div className='boxtitle'>
        Top Posts
        </div>
        <div>
          {top_posts.filter((res,i)=> i<3).map((res, i) => (
          <div className="rankings" key = {i}>
            <div className="medal">
            <Image src={ranking_match(i)}/>  
            </div>
            <a className = 'littlebox' href="mongodb" target="_blank" rel="noopener noreferrer">
              <p>{cutoff_string(res.title)}</p>
            </a>
          </div>
        ))}
        </div>
      </div>
      <div className='prolificusersbox'>
        <div className='boxtitle'>
        Most Active Users
        </div>
        <div>
          {prolific_users.filter((res, i)=> i<3).map((res, i) => (
          <div className="rankings" key = {i}>
            <div className="medal">
            <Image src={ranking_match(i)}/>  
            </div>
            <a className = "littlebox" href="mongodb" target="_blank" rel="noopener noreferrer">
              <p>{cutoff_string(res.full_name)}</p>
            </a>
          </div>
        ))}
        </div>
      </div>
    </main>
  );
}
