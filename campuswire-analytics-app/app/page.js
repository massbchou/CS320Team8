// import styles from "./page.module.css";
import { MongoClient } from "mongodb";
import Image from "next/image";
import goldstar_nobackground from '../public/goldstar_nobackground.png';
import silverstar_nobackground from '../public/silverstar_nobackground.png';
import bronzestar_nobackground from '../public/bronzestar_nobackground.png';

function cutoff_string(name_to_cut){
  if (name_to_cut.length < 20){
    return name_to_cut;
  }
  else{//name is too long for bubble
    while(name_to_cut.length >= 20){
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

function find_prolific_users(data){
  //
}

export default async function Mongo() {
  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/";
  const client = new MongoClient(url);

  let results;
  let prolific_users;
  try {
    // connect to mongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // get collection "2022-12-15" from database "posts" gives access to all the posts
    const collection = client.db("posts").collection("2022-12-15");

    // find all posts from September with viewsCount > 100
    // use *
    const cursor = collection.find({publishedAt: {$regex: '2022-11'}, viewsCount: {$gt: 100}}).sort({viewsCount:-1});
    results = await cursor.toArray();
    // console.log(results);

    //find most prolific users from September
    const users_data = collection.find({});
    prolific_users = await users_data.toArray();
  } catch (e) {
    console.log("There was an error in connecting to mongo")
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main>
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
            <p className='littlebox'>{cutoff_string(res.title)}</p>
          </div>
        ))}
        </div>
      </div>

      <div className='toppostsbox'>
        <div className='boxtitle'>
        Top Posts
        </div>
        <div>
          {results.filter((res, i)=> i<3).map((res, i) => (
          <div className="rankings" key = {i}>
            <div className="medal">
            <Image src={ranking_match(i)}/>  
            </div>
            <p className='littlebox'>{cutoff_string(res.title)}</p>
          </div>
        ))}
        </div>
      </div>
    </main>
  );
}
