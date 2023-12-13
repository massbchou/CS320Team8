"use client";

import Link from "next/link";
import { useState } from "react";
import { Young_Serif } from "next/font/google";

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
});

function LeaderBoard({ connectUserToScore }) {
  const [user, setUser] = useState([]);
  const [sortBy, setSortBy] = useState("rank");
  const [sortOrder, setSortOrder] = useState("top"); // State to track sorting order

  const handleSortBy = (criteria) => {
    if (sortBy === criteria) {
      // Toggle sorting order if same criterion is clicked
      setSortOrder((prevOrder) => (prevOrder === "top" ? "bottom" : "top"));
      sortUsers();
    } else {
      // If a new criterion is clicked, set it as the sorting criterion
      setSortBy(criteria);
      setSortOrder("bottom"); // Set default order as ascending for the new criterion
    }
  };

  // Sorting logic based on different criteria
  const sortUsers = () => {
    if (sortBy === "rank") {
      connectUserToScore.sort((a, b) =>
        sortOrder === "top" ? a.rank - b.rank : b.rank - a.rank,
      );
    } else if (sortBy === "numPosts") {
      connectUserToScore.sort((a, b) =>
        sortOrder === "top" ? b.numPosts - a.numPosts : a.numPosts - b.numPosts,
      );
    } else if (sortBy === "numComments") {
      connectUserToScore.sort((a, b) =>
        sortOrder === "top"
          ? b.numComments - a.numComments
          : a.numComments - b.numComments,
      );
    } else if (sortBy === "name") {
      connectUserToScore.sort((a, b) =>
        sortOrder === "top"
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName),
      );
    }
  };

  const handleLinkClick = async (userID, userName) => {
    console.log("User ID:", userID);
    console.log("User Name:", userName);

    if (userID && userName) {
      setUser([userID, userName]);
      let firstName = userName.slice(0, userName.indexOf(" "));
      console.log(firstName);
      let lastName = userName.slice(userName.indexOf(" ") + 1);
      console.log(lastName);
      const user = [userID, userName, firstName, lastName];
      try {
        const response = await fetch("/api/names", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user }),
        });
        if (response.ok) {
          console.log("Name saved successfully");

          // API call successful, perform navigation
          window.location.href = `/member-stats?userID=${userID}&userName=${userName}`;
        } else {
          console.error("Failed to save name");
          // Handle failure if needed
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle other errors
      }
    } else {
      setUser([]);
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 242, 255, 0.65), rgba(255, 0, 242, 0.65))",
        padding: "20px",
        overflowY: "scroll",
        maxHeight: "900px",
        boxSizing: "border-box",
        borderRadius: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: youngSerif,
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
          onClick={() => handleSortBy("rank")}
          style={{
            flexBasis: "48%",
            fontFamily: youngSerif,
            fontSize: "20px",
            textAlign: "center",
            margin: "6px",
            padding: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            opacity: "0.8",
            borderRadius: "7px",
          }}
        >
          Rank
        </div>
        <div
          onClick={() => handleSortBy("name")}
          style={{
            flexBasis: "48%",
            fontFamily: youngSerif,
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
          onClick={() => handleSortBy("numPosts")}
          style={{
            flexBasis: "48%",
            fontFamily: youngSerif,
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
          onClick={() => handleSortBy("numComments")}
          style={{
            flexBasis: "48%",
            fontFamily: youngSerif,
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
                fontFamily: youngSerif,
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
              {item.rank}
            </span>
            <Link
              href={{
                pathname: "/member-stats",
                query: { userID: item.userID, userName: item.fullName },
              }}
              style={{
                color: "black",
                fontFamily: youngSerif,
                fontSize: "20px",
                textAlign: "center",
                margin: "6px",
                padding: "2px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                width: "70%",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.userID, item.fullName);
              }}
            >
              {item.fullName}
            </Link>
            <span
              key={i + "d"}
              style={{
                fontFamily: youngSerif,
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
              {connectUserToScore.map((userInfo) => userInfo.numPosts)[i]}
            </span>
            <span
              key={i + "e"}
              style={{
                fontFamily: youngSerif,
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
              {connectUserToScore.map((userInfo) => userInfo.numComments)[i]}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default LeaderBoard;
