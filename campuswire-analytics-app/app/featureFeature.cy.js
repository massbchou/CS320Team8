import React from "react";
import Feature from "./feature";
import { MongoClient } from "mongodb";

describe("Most active users", () => {
  it("renders", async () => {
    // see: https://on.cypress.io/mounting-react
    const url =
      "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(url);
    const userCollection = client.db("users").collection("users");
    const studentData = userCollection.find({ "author.role": "member" });
    const studentList = await studentData.toArray();
    // entire semester
    prolificUsers = prolific_users_algo(studentList);
    cy.mount(
      <Feature
        linkTo="most-active-users"
        title="Most Active Students: beginning of semester (sep 15) - oct 1"
        content={prolificUsers}
      />,
    );
  });
});
