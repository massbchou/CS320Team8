"use client";

import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();
  console.log(searchParams);

  const userID = searchParams.get("userID");
  const userName = searchParams.get("userName");

  // This will be logged on the server during the initial render
  // and on the client on subsequent navigations.
  console.log(userID);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Make the content fill the viewport height
        fontSize: "24px", // Increase font size
      }}
    >
      <div style={{ margin: '20px' }}>userID: {userID} </div>
      <div style={{ margin: '20px' }}>userName: {userName}</div>
    </div>
  );
}
