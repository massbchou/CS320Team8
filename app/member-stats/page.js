import { MongoClient } from "mongodb";
import Image from "next/image";
import dynamic from 'next/dynamic'

export default async function Page(props) {
  let userDataset = await buildUserDataset(props.searchParams.userID);

  let userList = await buildUserList();

  const UserList = dynamic(() => import('./userlist.js'), { ssr: false })
  const SelectedUser = dynamic(() => import('./selected_user.js'), { ssr: false })
  const StatsGraph = dynamic(() => import('./stats_graph.js'), { ssr: false })

  return (
    <main
      style={{
        background:
          "radial-gradient(ellipse at center top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), linear-gradient(140deg, rgba(240, 56, 255, .5) 0%, rgba(255,255,255, .5) 50%, rgba(0, 224, 255, .5) 100%)",
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "20px",
          }}
        >
          Member Statistics
        </div>
        <a
          href="/home-page"
          style={{ display: "inline-block", marginTop: "7px" }}
        >
          Return Home
          <div style={{ display: "inline-block" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-2 -2 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
        </a>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <UserList userList={userList}></UserList>
        <SelectedUser userDataset={userDataset}></SelectedUser>
        <StatsGraph
          data={userDataset.dataArr}
          startDate={userDataset.startDate}
          name={userDataset.userName}
        ></StatsGraph>
      </div>
    </main>
  );
}

async function buildUserDataset(userID) {
  // initialize MongoClient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let dataArr = [];
  let activityStartDate;
  let name;
  let userRole;
  let averageResponseTime = 0;
  let firstResponderCount = 0;

  try {
    await client.connect();
    // Connect to cluster

    const usersCollection = client.db("users").collection("users");
    let userObj;

    if (userID !== undefined) {
      userObj = await usersCollection.findOne({ "author.id": userID });
    } else {
      userObj = await usersCollection.findOne({});
    }

    userRole = userObj.author.role;

    let entries = Object.entries(userObj);

    name = userObj.author.firstName + " " + userObj.author.lastName;
    activityStartDate = new Date(entries[2][0]);
    let activityDate = new Date(activityStartDate);

    let postsCollection = client.db("posts").collection("2022-12-15");

    let i = 2;
    while (i < entries.length) {
      if (userObj[activityDate.toISOString().substring(0, 10)] !== undefined) {
        let userActivityObj =
          userObj[activityDate.toISOString().substring(0, 10)];

        let totalViews = 0;
        let totalUnansweredQuestions = 0;
        let totalTopPosts = 0;
        for (let j = 0; j < userActivityObj.postIds.length; j++) {
          const post = await postsCollection.findOne({
            id: userActivityObj.postIds[j],
          });
          totalViews += post.viewsCount;
          if (
            post.type === "question" &&
            !(
              Object.hasOwn(post, "modAnsweredAt") ||
              post.comments.reduce((acc, comment) => {
                acc || comment.endorsed;
              }, false)
            )
          ) {
            totalUnansweredQuestions++;
          }
          let postScore =
            1 * post.uniqueViewsCount +
            2 * (post.viewsCount - post.uniqueViewsCount) +
            20 * post.comments.length +
            50 * (post.likesCount ? post.likesCount : 0);
          if (postScore >= 300) {
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
      } else {
        dataArr.push({
          numPosts: 0,
          numComments: 0,
          numPostViews: 0,
          numUnansweredQuestions: 0,
          numTopPosts: 0,
        });
      }
      activityDate = new Date(activityDate.getTime() + 24 * 60 * 60 * 1000);
    }

    if (userRole === "moderator") {
      const statsforMods = await calculateModeratorStats(userID, client);
      averageResponseTime = statsforMods.averageResponseTime;
      firstResponderCount = statsforMods.firstResponderCount;
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
    userRole: userRole,
    averageResponseTime: averageResponseTime,
    firstResponderCount: firstResponderCount,
  };
}

async function calculateModeratorStats(userID, client) {
  const collection = client.db("posts").collection("2022-12-15");

  let totalResponseTime = 0;
  let firstResponderCount = 0;

  const moderatorPostsCursor = collection.find({
    "comments.0.author.id": userID,
  });

  const moderatorPosts = await moderatorPostsCursor.toArray();

  for (const post of moderatorPosts) {
    if (post.comments && post.comments.length > 0) {
      const firstComment = post.comments[0];
      if (
        firstComment &&
        firstComment.author &&
        firstComment.author.id === userID
      ) {
        const postDate = new Date(post.publishedAt);
        const responseDate = new Date(firstComment.publishedAt);
        const responseTime = (responseDate - postDate) / 60000;
        totalResponseTime += responseTime;
        firstResponderCount++;
      }
    }
  }

  const averageResponseTime = firstResponderCount
    ? parseFloat((totalResponseTime / firstResponderCount).toFixed(2))
    : 0;

  return {
    averageResponseTime: parseFloat(averageResponseTime),
    firstResponderCount,
  };
}

async function buildUserList() {
  // initialize MongoClient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let users = [];

  try {
    await client.connect();
    const usersCollection = client.db("users").collection("users");
    const usersCursor = usersCollection.find(
      {},
      {
        projection: {
          "author.firstName": 1,
          "author.lastName": 1,
          "author.id": 1,
          "author.role": 1,
        },
      },
    );
    const usersList = await usersCursor.toArray();

    // Build an array of user names and their IDs
    users = usersList.map((user) => ({
      name: user.author.firstName + " " + user.author.lastName,
      id: user.author.id,
      role: user.author.role,
    }));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return users;
}
