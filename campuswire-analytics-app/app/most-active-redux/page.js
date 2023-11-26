import top_users_algo from "../top_users";
import { MongoClient } from "mongodb";

export default async function Page() {
    const url = "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(url);
    const firstDay = new Date ("2022-09-15");
    const lastDay = new Date ("2022-12-15");
    let allUsersRanked;
    try{
        await client.connect();
        let userCollection = client.db("users").collection("users");
        let usersData = userCollection.find();
        let usersList = await usersData.toArray();
        allUsersRanked = top_users_algo(usersList, firstDay, lastDay);
    }
    catch(e){
        console.log("There was an error in connecting to mongo");
        console.error(e);
    }
    finally {
        await client.close();
    }

    return (
        <main> 
            <div style={{display: "flex", flexDirection: "row", height: "100vh"}}>
                <div style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "#ddd"}}>
                    Left col
                </div>
                
                <div style={{flex: 1, background: "#aaa", overflow: "scroll"}}>
                    <ul>
                        {allUsersRanked.map((item, i) => (<li key={i}>{ item }</li>))}
                    </ul>
                </div>
                
                <div style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "#e7e7e7"}}>
                    Right col
                </div>
            </div>
        </main>
    );
}