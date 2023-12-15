import { MongoClient } from "mongodb";
import Image from "next/image";
import dynamic from "next/dynamic";

export default async function Page(props) {
  let userDataset = await buildUserDataset(props.searchParams.userID);
  // builds the user's dataset for input to the selected user component and the stats graph

  let userList = await buildUserList();
  // builds the data for the user list

  const UserList = dynamic(() => import("./userlist.js"), { ssr: false });
  const SelectedUser = dynamic(() => import("./selected_user.js"), {
    ssr: false,
  });
  const StatsGraph = dynamic(() => import("./stats_graph.js"), { ssr: false });
  // disabled server-side rendering on import for these components to fix hydration error

  return (
    <main
      style={{
        overflowX: "auto",
        overflowY: "auto",
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

/**
 * Given some user's ID, generates all of that user's relevant metrics for the selected user window and the stats graph
 * Generates arrays for posts, top posts, comments, post views, and unanswered questions
 * Generates overall stats for both moderator metrics: average response time and number of first respondent incidents
 * @param {string} userID
 * @returns {object} an object representing all of that user's relevant metrics:
 * {
 *  userName: string;
    dataArr: {
        numPosts: any;
        numComments: any;
        numPostViews: number;
        numUnansweredQuestions: number;
        numTopPosts: number;
    }[];
    startDate: Date;
    userRole: any;
    averageResponseTime: number;
    firstResponderCount: number;
  }
 */
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
  // init all relevant variables

  try {
    await client.connect();
    // Connect to cluster

    const usersCollection = client.db("users").collection("users");
    // get users database

    let userObj;

    if (userID !== undefined) {
      userObj = await usersCollection.findOne({ "author.id": userID });
    } else {
      userObj = await usersCollection.findOne({});
    }
    // if the userID is undefined (not found in the searchParams) then get the stats for the first user in the database instead

    userRole = userObj.author.role;
    name = userObj.author.firstName + " " + userObj.author.lastName;
    // set the role and name variables to the relevant values

    /*
    User database entries are objects of this form:
    {
      _id,
      author: {
        id,
        firstName,
        lastName,
        ...
      }
      2022-09-08: {     (only days of that user's activity)
        postIds: [...]
        commentIds: [...]
      }
      2022-09-15: {
        postIds: [...]
        commentIds: [...]
      }
      ...
    }
    */
    let entries = Object.entries(userObj); // turn that user's object into an array of [key, value] pairs
    activityStartDate = new Date(entries[2][0]); // get the date of the user's first activity (the key of the 3rd object entry, skipping '_id' and 'author')
    let activityDate = new Date(activityStartDate); // turn that string into a Date object

    let postsCollection = client.db("posts").collection("2022-12-15");
    // get posts database for searching with relevant postIds

    let i = 2;
    while (i < entries.length) {
      // iterate through each day within the range of days that that user was active
      if (userObj[activityDate.toISOString().substring(0, 10)] !== undefined) {
        // only if that day is a day of activity for that user, process the data and add the dataset
        let userActivityObj =
          userObj[activityDate.toISOString().substring(0, 10)];

        let totalViews = 0;
        let totalUnansweredQuestions = 0;
        let totalTopPosts = 0;
        // init all count variables to 0

        for (let j = 0; j < userActivityObj.postIds.length; j++) {
          // iterate through all posts that user made in that day
          const post = await postsCollection.findOne({
            id: userActivityObj.postIds[j],
          });
          // find each post in the posts DB
          totalViews += post.viewsCount;
          // increment total post views by this post's views
          if (
            // if a post is of type quesiton, and does not have either a mod answer or an endorsed reply, consider it unanswered
            post.type === "question" &&
            !(
              Object.hasOwn(post, "modAnsweredAt") ||
              post.comments.reduce((acc, comment) => {
                acc || comment.endorsed;
              }, false)
            )
          ) {
            totalUnansweredQuestions++;
            // increment unanswered questions count
          }
          let postScore =
            1 * post.uniqueViewsCount +
            2 * (post.viewsCount - post.uniqueViewsCount) +
            20 * post.comments.length +
            50 * (post.likesCount ? post.likesCount : 0);
          if (postScore >= 300) {
            // if a post's score is above 300, consider it a top post
            totalTopPosts++;
            // increment top posts count
          }
        }
        dataArr.push({
          // Then, push all generated data for that day
          numPosts: userActivityObj.postCount,
          numComments: userActivityObj.commentCount,
          numPostViews: totalViews,
          numUnansweredQuestions: totalUnansweredQuestions,
          numTopPosts: totalTopPosts,
        });
        i++;
      } else {
        // otherwise, if the user was not active on that day, push a dataset in which all values are 0
        dataArr.push({
          numPosts: 0,
          numComments: 0,
          numPostViews: 0,
          numUnansweredQuestions: 0,
          numTopPosts: 0,
        });
      }
      activityDate = new Date(activityDate.getTime() + 24 * 60 * 60 * 1000); // increment the day by one
    }

    if (userRole === "moderator") {
      // only if a user is a moderator, calculate their mod statistics and update the relevant variables
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
    // return object with all relevant data for that user
    userName: name,
    dataArr: dataArr,
    startDate: activityStartDate,
    userRole: userRole,
    averageResponseTime: averageResponseTime,
    firstResponderCount: firstResponderCount,
  };
}

/**
 * Calculates average response time and count of first responses for a given moderator.
 * This function assumes that the first comment made by the moderator is their response to the post.
 *
 * @param {string} userID - The ID of the user (moderator) for whom to calculate stats.
 * @param {MongoClient} client - The MongoDB client to use for database operations.
 * @returns {Promise<Object>} An object containing the average response time and first responder count.
 */
async function calculateModeratorStats(userID, client) {
  // Using the latest collection which has the most up-to-date discussions.
  const collection = client.db("posts").collection("2022-12-15");

  let totalResponseTime = 0;
  let firstResponderCount = 0;

  // Find all posts where the first comment is made by the moderator.
  const moderatorPostsCursor = collection.find({
    "comments.0.author.id": userID,
  });

  // Convert the cursor to an array to process the documents.
  const moderatorPosts = await moderatorPostsCursor.toArray();

  // Iterate through each post to calculate response times.
  for (const post of moderatorPosts) {
    if (post.comments && post.comments.length > 0) {
      const firstComment = post.comments[0];
      if (
        firstComment &&
        firstComment.author &&
        firstComment.author.id === userID
      ) {
        // Calculate the time difference between the post and the moderator's first comment.
        const postDate = new Date(post.publishedAt);
        const responseDate = new Date(firstComment.publishedAt);
        const responseTime = (responseDate - postDate) / 60000;  // Convert milliseconds to minutes.
        totalResponseTime += responseTime; // Accumulate the response times.
        firstResponderCount++; // Increment the count of first responses.
      }
    }
  }

  // Calculate the average response time. If no responses, default to 0.
  const averageResponseTime = firstResponderCount
    ? parseFloat((totalResponseTime / firstResponderCount).toFixed(2))
    : 0;

  // Return the calculated metrics.
  return {
    averageResponseTime: parseFloat(averageResponseTime),
    firstResponderCount,
  };
}

/**
 * Builds and returns the data for the list of users (the input for the <UserList> component)
 * @returns {object[]} an array of objects representing all of the users on the forum:
 * {
 *  name,
    id,
    role,
 * }[]
 */
async function buildUserList() {
  // initialize MongoClient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let users = [];
  // init users array

  try {
    await client.connect();
    const usersCollection = client.db("users").collection("users");
    // get users database
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
    // get all relevant fields for all user objects
    const usersList = await usersCursor.toArray();
    // translate to array

    users = usersList.map((user) => ({
      name: user.author.firstName + " " + user.author.lastName,
      id: user.author.id,
      role: user.author.role,
    }));
    // build an array of user names and their IDs, concatenating their first and last names
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return users;
}
