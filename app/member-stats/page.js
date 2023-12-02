import { MongoClient } from "mongodb";
import Image from "next/image";
import UserList from "./userlist.js";
import SelectedUser from "./selected_user.js";
import StatsGraph from "./stats_graph.js";

export default async function Page() {

  let dataSet = await buildUserDataset();

  return <main
    style={{
      background: "radial-gradient(ellipse at center top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), linear-gradient(140deg, rgba(240, 56, 255, .5) 0%, rgba(255,255,255, .5) 50%, rgba(0, 224, 255, .5) 100%)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      width: "100%",
      height: "100vh",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        src="/images/icon.png"
        width={90}
        height={90}
        quality={100}
        style={{ margin: "10px" }}
        unoptimized
        alt=""
      ></Image>
      <span
        style={{
          textAlign: "center",
          fontSize: "30px",
        }}
      >
        Campuswire Analytics
      </span>
    </div>
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
    <div style={{
        fontSize: '20px',
    }}>Member Statistics</div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "10px",
      }}
    >
      <UserList
        totalCount={121}
        title="Forum Users"
        users={['User #1', 'User #2', 'User #3', 'User #4', 'User #5', 'User #6', 'User #7', 'User #8', 'User #9', 'User #10', 'User #11', 'User #12', 'User #13', 'User #14', 'User #15', 'User #16', 'User #17']}
      ></UserList>
      <SelectedUser
        title='User #1'
        stats={{numPosts: 5, numTrendingPosts: 2, numUnansweredQuestions: 2, avgReplyTime: 35}}
      ></SelectedUser>
      <StatsGraph data={dataSet.dataArr} startDate={dataSet.startDate} name={dataSet.userName}></StatsGraph>
    </div>
  </main>
}

async function buildUserDataset(){
  // initialize MongoClient credentials
  const url = "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let dataArr = [];
  let activityStartDate;
  let name;

  try {
    await client.connect();
    // Connect to cluster

    let usersCollection = client.db("users").collection("users");

    const users = usersCollection.find({});
    let usersObjArr = await users.toArray();

    let userObj = usersObjArr[36];

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