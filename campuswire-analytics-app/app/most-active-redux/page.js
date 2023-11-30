import top_users_algo from "../top_users";
import { MongoClient } from "mongodb";
import Podium from "../Podium";
import background from "../images/background.png";
import BarGraph from "./BarGraph";
import Image from "next/image";
import { userInfo } from "os";

export default async function Page() {
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);
  const firstDay = new Date("2022-09-13");
  const lastDay = new Date("2022-12-17");
  let allUsersRanked;
  let podiumData;
  let firstNamesArr = [];
  let namesArr = [];
  let winnerCommentArr = [];
  let winnerPostArr = [];
  let allCommentArr = [];
  let allPostArr = [];
  let connectUserToScore = [];
  const graphCommentTitle = "Number of Comments Made by Top Contributors";
  const graphPostTitle = "Number of Posts Made by Top Contributors";
  try {
    await client.connect();
    let userCollection = client.db("users").collection("users");
    let usersData = userCollection.find();
    let usersList = await usersData.toArray();
    allUsersRanked = top_users_algo(usersList, firstDay, lastDay);
    podiumData = allUsersRanked
      .slice(0, 5)
      .map((name, position) => ({ name, position }));
    for (let i = 0; i < 5; i++) {
      namesArr.push(
        podiumData[i].name.substring(0, podiumData[i].name.indexOf(" ")),
      );
      namesArr.push(
        podiumData[i].name.substring(
          podiumData[i].name.indexOf(" ") + 1,
          podiumData[i].name.length,
        ),
      );
    }
    for (let i = 0; i < 5; i++) {
      firstNamesArr.push(
        podiumData[i].name.substring(0, podiumData[i].name.indexOf(" ")),
      );
    }

    let contributionCollection = client.db("users").collection("users");
    let queryConditions = [];

    for (let i = 0; i < namesArr.length; i += 2) {
      if (namesArr[i] && namesArr[i + 1]) {
        queryConditions.push({
          $and: [
            { "author.firstName": namesArr[i] },
            { "author.lastName": namesArr[i + 1] },
          ],
        });
      }
    }

    let contributionData = contributionCollection.find({
      $or: queryConditions,
    });
    let winnerList = await contributionData.toArray();

    let count;
    let num_posts;
    let total_posts;
    let total_comments;
    let num_comments;
    let winnerScore = [];

    for(let j = 0; j < 5; j++){//into the 5 data points one for linda one for alexander etc.
      count = 0;
      total_posts = 0;
      total_comments = 0;
      for (let date in winnerList[j]) {
        if (date === "_id" || date === "author") continue;
        num_posts = winnerList[j][date].postCount;
        total_posts += num_posts;
        num_comments = winnerList[j][date].commentCount;
        total_comments += num_comments;
        count += 2 * num_posts + 1 * num_comments;
      }
      winnerScore[j] = {post: total_posts, comment: total_comments, score: count };
    }
    winnerScore.sort((a, b) => b.score - a.score);
    winnerCommentArr = winnerScore.map((winnerInfo) => winnerInfo.comment);
    winnerPostArr = winnerScore.map((winnerInfo) => winnerInfo.post);

    let allContributionCollection = client.db("users").collection("users");
    let allUsersScores = allContributionCollection.find({});
    let allUsersList = await allUsersScores.toArray();

    let totalCount;
    let indivCommentCount = 0;
    let indivPostCount = 0;
    let totalIndivComments;
    let totalIndivPosts;
  
    for(let j = 0; j < allUsersList.length; j++){//into the 5 data points one for linda one for alexander etc.
      totalCount = 0;
      totalIndivComments = 0;
      totalIndivPosts = 0;
      for (let date in allUsersList[j]) {
        if (date === "_id" || date === "author") continue;
        indivCommentCount = allUsersList[j][date].commentCount;
        indivPostCount = allUsersList[j][date].postCount;
        totalIndivComments += indivCommentCount;
        totalIndivPosts += indivPostCount;
        totalCount += indivCommentCount+2*indivPostCount;
      }
      connectUserToScore[j] = ({rank: totalCount, numComments: totalIndivComments, numPosts: totalIndivPosts});
    }
    connectUserToScore.sort((a, b) => b.rank - a.rank);
    console.log(connectUserToScore);
    allCommentArr = connectUserToScore.map((userInfo) => userInfo.numComments);;
    allPostArr = connectUserToScore.map((userInfo) => userInfo.numPosts);
    console.log(allCommentArr);
    console.log(allPostArr);
  } catch (e) {
    console.log("There was an error in connecting to mongo");
    console.error(e);
  } finally {
    await client.close();
  }

  return (

    <main
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100vh",
      backgroundImage: `url(${background.src})`,
      backgroundSize: "100%",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Image and Title Div */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: "30px",
        marginTop: "10px",
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
      />
      <span
        style={{
          fontFamily: "Roboto",
          textAlign: "center",
        }}
      >
        Most Active Users Stats
      </span>
    </div>

    {/* Flex container for graphs, podium, and scrollable list */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        marginTop: "50px", // Adjust as needed
        padding: "20px",
      }}
    >
      {/* Bar Graphs */}
      <div style={{ flex: "0 0 30%"}}>
        <BarGraph namesArr={firstNamesArr} scoresArr={winnerPostArr} title={graphPostTitle} />
        <BarGraph namesArr={firstNamesArr} scoresArr={winnerCommentArr} title={graphCommentTitle} />
      </div>
      {/* Scrollable List */}
      <div
        style={{
          flex: "0 0 30%",
          backgroundImage: "linear-gradient(rgba(0, 242, 255, 0.65), rgba(255, 0, 242, 0.65))",
          padding: "20px",
          overflowY: "scroll",
          maxHeight: '600px',
          maxWidth: "900px",
          boxSizing: "border-box",
          borderRadius: "20px",
        }}
      >
        <div style={{textAlign:'center', fontFamily:'Young Serif', fontSize:'25px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', padding:'3px', marginBottom:'9px'}}>Leader Board</div>

        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{flexBasis: '48%', fontFamily:'Young Serif', fontSize:'20px', textAlign:'center', margin:'6px', padding:'1px', backgroundColor:'rgba(255, 255, 255, 0.9)', opacity:'0.8', borderRadius:'7px'}}>
      Name
    </div>
    <div style={{flexBasis: '48%', fontFamily:'Young Serif', fontSize:'20px', textAlign:'center', margin:'6px', padding:'1px', backgroundColor:'rgba(255, 255, 255, 0.9)', opacity:'0.8', borderRadius:'7px'}}>
      Number of Posts
    </div>
    
    <div style={{flexBasis: '48%', fontFamily:'Young Serif', fontSize:'20px', textAlign:'center', margin:'6px', padding:'1px', backgroundColor:'rgba(255, 255, 255, 0.9)', opacity:'0.8', borderRadius:'7px'}}>
      Number of Comments
    </div>
  </div>

        <ul>
          {allUsersRanked.map((item, i) => (
            <div key={i + 'a'} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <span key={i + 'b'} style={{fontFamily:'Young Serif', fontSize:'20px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'10%'}}>{i + 1}</span>
            <span key={i + 'c'} style={{fontFamily:'Young Serif', fontSize:'20px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'70%'}}>{item}</span>
            <span key={i + 'c'} style={{fontFamily:'Young Serif', fontSize:'20px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'70%'}}>{allPostArr[i]}</span>
            <span key={i + 'c'} style={{fontFamily:'Young Serif', fontSize:'20px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'70%'}}>{allCommentArr[i]}</span>
          </div>           
          ))}
        </ul>
      </div>
      {/* Podium */}
      <div style={{ flex: "0 0 30%", textAlign: "center" }}>
        <Podium winners={podiumData} />
      </div>
    </div>
  </main>
  );
}
