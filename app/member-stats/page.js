import SearchBar from './search-bar'
import { MongoClient } from "mongodb";

export default async function Page(props) {

  let dataSet = await buildUserDataset(props.searchParams.userID);

  return <main
    style={{
      background: "radial-gradient(ellipse at center top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), linear-gradient(140deg, rgba(240, 56, 255, .5) 0%, rgba(255,255,255, .5) 50%, rgba(0, 224, 255, .5) 100%)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      width: "100%",
      height: "100vh",
    }}
  >
    <SearchBar dataSet={dataSet}/>
  </main>
}

async function buildUserDataset(id){
  // initialize MongoClient credentials
  const url = "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let dataArr = [];
  let activityStartDate;
  let name;

  try {
    await client.connect();
    // Connect to cluster

    const usersCollection = client.db("users").collection("users");
    let userObj;

    if(id !== undefined){
      userObj = await usersCollection.findOne({'author.id': id});
    }else{
      userObj = await usersCollection.findOne({});
    }

    let entries = Object.entries(userObj);
    name = userObj.author.firstName + ' ' + userObj.author.lastName;
    activityStartDate = new Date(entries[2][0]);
    let activityDate = new Date (activityStartDate);

    let postsCollection = client.db("posts").collection('2022-12-15');
    let i = 2;

    while(i < entries.length){

      if(userObj[activityDate.toISOString().substring(0, 10)] !== undefined){
        let userActivityObj = userObj[activityDate.toISOString().substring(0, 10)];

        let totalViews = 0;
        let totalUnansweredQuestions = 0;
        let totalTopPosts = 0;
        for(let j = 0; j < userActivityObj.postIds.length; j++){
          const post = await postsCollection.findOne({id: userActivityObj.postIds[j]});
          totalViews += post.viewsCount;
          if(post.type === 'question' && !(Object.hasOwn(post, 'modAnsweredAt') || post.comments.reduce((acc, comment) => {acc || comment.endorsed}, false))){
            totalUnansweredQuestions++;
          }
          let postScore = 1 * post.uniqueViewsCount + 2 * (post.viewsCount - post.uniqueViewsCount) + 20 * post.comments.length + 50 * (post.likesCount ? post.likesCount : 0);
          if(postScore >= 300){
            totalTopPosts++;
          }
        }
        dataArr.push({
          numPosts: userActivityObj.postCount,
          numComments: userActivityObj.commentCount,
          numPostViews: totalViews,
          numUnansweredQuestions: totalUnansweredQuestions,
          numTopPosts: totalTopPosts,
        });
        i++;
      }else{
        dataArr.push({
          numPosts: 0,
          numComments: 0,
          numPostViews: 0,
          numUnansweredQuestions: 0,
          numTopPosts: 0,
        });
      }
      activityDate = new Date(activityDate.getTime() + (24 * 60 * 60 * 1000));
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return {
    userName: name,
    dataArr: dataArr,
    startDate: activityStartDate,
  }
}