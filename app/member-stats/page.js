import { MongoClient } from "mongodb";
import { useState } from 'react';
import Image from "next/image";
import UserList from "./userlist.js";
import SelectedUser from "./selected_user.js";
import StatsGraph from "./stats_graph.js";

export default function Page() {

  const [dataSet, setDataSet] = useState({ userNames: [], dataArr: [], startDate: null });

  useEffect(() => {
    const fetchData = async () => {
      const result = await buildUserDataset();
      setDataSet(result);
    };
    fetchData();
  }, []);

  const [selectedUserData, setSelectedUserData] = useState(null);

  const handleUserSelect = async (userId) => {
    const url = "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(url);
  
    try {
      await client.connect();
      const usersCollection = client.db("users").collection("users");
  
      const user = await usersCollection.findOne({ "author.id": userId });
  
      setSelectedUserData(user);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  };

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
        totalCount={dataSet.userNames.length}
        title="Forum Users"
        users={dataSet.userNames}
        onUserSelect={handleUserSelect}
      ></UserList>
      <SelectedUser
        userData={selectedUserData}
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
  let userNames = [];

  try {
    await client.connect();
    const usersCollection = client.db("users").collection("users");
    const usersCursor = usersCollection.find({}, { projection: { "author.firstName": 1, "author.lastName": 1, "author.id": 1 } });
    const usersList = await usersCursor.toArray();

    // Build an array of user names and their IDs
    userNames = usersList.map(user => ({
      name: user.author.firstName + ' ' + user.author.lastName,
      id: user.author.id
    }));

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return {
    userName: name,
    dataArr: dataArr,
    startDate: activityStartDate,
    userNames: userNames
  }
}