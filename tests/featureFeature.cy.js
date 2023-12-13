import React from "react";
import Feature from "../app/feature.js";
import { MongoClient } from "mongodb";
import top_users_algo from "../top_users.js";

describe("Most active users", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    const url =
      "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(url);
    const userCollection = client.db("users").collection("users");
    const studentData = userCollection.find({ "author.role": "member" });
    const studentList = studentData.toArray();
    // entire semester
    const sep1 = new Date("2022-09-01");
    const oct1 = new Date("2022-10-01");
    let topUsers = top_users_algo(studentList, sep1, oct1);
    cy.mount(
      <Feature
        linkTo="most-active-users"
        title="Most Active Students: beginning of semester (sep 15) - oct 1"
        content={topUsers}
      />,
    );
  });
});
