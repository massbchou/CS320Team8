"use client";
import Link from "next/link";

const LeaderBoard = ({ connectUserToScore, allPostArr, allCommentArr }) => {
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 242, 255, 0.65), rgba(255, 0, 242, 0.65))",
        padding: "20px",
        overflowY: "scroll",
        maxHeight: "600px",
        maxWidth: "900px",
        boxSizing: "border-box",
        borderRadius: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: "Young Serif",
          fontSize: "25px",
          backgroundColor: "rgba(255, 255, 255, 0.70)",
          borderRadius: "10px",
          padding: "3px",
          marginBottom: "9px",
        }}
      >
        Leader Board
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Adjust styles and content as needed */}
        {/* Add header elements */}
        <div
          style={{
            flexBasis: "48%",
            fontFamily: "Young Serif",
            fontSize: "20px",
            textAlign: "center",
            margin: "6px",
            padding: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            opacity: "0.8",
            borderRadius: "7px",
          }}
        >
          Name
        </div>
        <div
          style={{
            flexBasis: "48%",
            fontFamily: "Young Serif",
            fontSize: "20px",
            textAlign: "center",
            margin: "6px",
            padding: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            opacity: "0.8",
            borderRadius: "7px",
          }}
        >
          Number of Posts
        </div>
        <div
          style={{
            flexBasis: "48%",
            fontFamily: "Young Serif",
            fontSize: "20px",
            textAlign: "center",
            margin: "6px",
            padding: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            opacity: "0.8",
            borderRadius: "7px",
          }}
        >
          Number of Comments
        </div>
      </div>

      <ul>
        {/* Map through the data to generate the leaderboard */}
        {connectUserToScore.map((item, i) => (
          <div
            key={i + "a"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Display the leaderboard items */}
            <span
              key={i + "b"}
              style={{
                fontFamily: "Young Serif",
                fontSize: "20px",
                textAlign: "center",
                margin: "6px",
                padding: "2px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                width: "10%",
              }}
            >
              {i + 1}
            </span>
            <Link
              href={{
                pathname: "/member-stats",
                query: { userID: item.userID, userName: item.fullName },
              }}
              style={{
                color: "black",
                fontFamily: "Young Serif",
                fontSize: "20px",
                textAlign: "center",
                margin: "6px",
                padding: "2px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                width: "70%",
              }}
            >
              {item.fullName}
            </Link>
            <span
              key={i + "d"}
              style={{
                fontFamily: "Young Serif",
                fontSize: "20px",
                textAlign: "center",
                margin: "6px",
                padding: "2px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                width: "70%",
              }}
            >
              {allPostArr[i]}
            </span>
            <span
              key={i + "e"}
              style={{
                fontFamily: "Young Serif",
                fontSize: "20px",
                textAlign: "center",
                margin: "6px",
                padding: "2px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                width: "70%",
              }}
            >
              {allCommentArr[i]}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;
