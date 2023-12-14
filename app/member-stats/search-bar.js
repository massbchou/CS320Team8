"use client";
import Image from "next/image";
import UserList from "./userlist.js";
import SelectedUser from "./selected_user.js";
import StatsGraph from "./stats_graph.js";

export default function SearchBar({ dataSet }) {
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
        }}
      >
        <div
          style={{
            fontSize: "20px",
          }}
        >
          Member Statistics
        </div>
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
          users={[
            "User #1",
            "User #2",
            "User #3",
            "User #4",
            "User #5",
            "User #6",
            "User #7",
            "User #8",
            "User #9",
            "User #10",
            "User #11",
            "User #12",
            "User #13",
            "User #14",
            "User #15",
            "User #16",
            "User #17",
          ]}
        ></UserList>
        <SelectedUser
          title={dataSet.userName}
          stats={{
            numPosts: 5,
            numTrendingPosts: 2,
            numUnansweredQuestions: 2,
            avgReplyTime: 35,
          }}
        ></SelectedUser>
        <StatsGraph
          data={dataSet.dataArr}
          startDate={dataSet.startDate}
          name={dataSet.userName}
        ></StatsGraph>
      </div>
    </main>
  );
}
