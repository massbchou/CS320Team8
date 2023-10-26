// import styles from "./page.module.css";
import { MongoClient } from "mongodb";
import Image from "next/image";
import goldstar_nobackground from "../public/goldstar_nobackground.png";
import silverstar_nobackground from "../public/silverstar_nobackground.png";
import bronzestar_nobackground from "../public/bronzestar_nobackground.png";

function cutoff_string(name_to_cut) {
  if (name_to_cut.length < 20) {
    return name_to_cut;
  } else {
    //name is too long for bubble
    while (name_to_cut.length >= 20) {
      name_to_cut = name_to_cut.slice(0, name_to_cut.lastIndexOf(" "));
    }
    return name_to_cut + "...";
  }
}

function ranking_match(index) {
  if (index == 0) {
    return goldstar_nobackground;
  } else if (index == 1) {
    return silverstar_nobackground;
  } else if (index == 2) {
    return bronzestar_nobackground;
  }
}

function computePostScore(post) {
  const w1 = 1,
    w2 = 2,
    w3 = 50,
    w4 = 5,
    w5 = 30;
  const today = new Date();
  const postDate = new Date(post.publishedAt); // Assuming publishedAt is a date string.
  const daysOld = Math.ceil((today - postDate) / (1000 * 60 * 60 * 24));

  // Use totalViews - uniqueViews for repeated views.
  const repeatedViews = post.totalViews - post.uniqueViews;

  return (
    w1 * post.totalViews +
    w2 * repeatedViews +
    w3 * post.totalComments +
    w4 * post.totalLikes -
    w5 * daysOld
  );
}

function findProlificUsers(data) {
  let userCounts = {};

  data.forEach((post) => {
    if (post.author) {
      if (!userCounts[post.author]) {
        userCounts[post.author] = 0;
      }
      userCounts[post.author]++;
    }
  });

  return Object.entries(userCounts)
    .sort(([, aCount], [, bCount]) => bCount - aCount)
    .map(([author]) => author)
    .slice(0, 3);
}

export default function Mongo({ results }) {
  return (
    <main>
      <div className="toppostsbox">
        <div className="boxtitle">Top Posts</div>
        <div>
          {results
            .filter((res, i) => i < 3)
            .map((res, i) => (
              <div className="rankings" key={i}>
                <div className="medal">
                  <Image src={ranking_match(i)} />
                </div>
                <p className="littlebox">{cutoff_string(res.title)}</p>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/";
  const client = new MongoClient(url);

  let results;

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const collection = client.db("posts").collection("2022-12-15");
    const cursor = collection
      .find({ publishedAt: { $regex: "2022-11" }, viewsCount: { $gt: 100 } })
      .sort({ viewsCount: -1 });
    results = await cursor.toArray();
    results.forEach((post) => (post.score = computePostScore(post)));
    results.sort((a, b) => b.score - a.score);
  } catch (e) {
    console.log("There was an error in connecting to mongo");
    console.error(e);
  } finally {
    await client.close();
  }

  return {
    props: {
      results: results || [],
    },
  };
}
