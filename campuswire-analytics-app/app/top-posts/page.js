export default handlingTopPostCaching;

async function handlingTopPostCaching(collectionDate, thresholdDaysPrior, cachePosts, cacheCollectionPosts) {
  console.log("made it to the helper function");
  if (cachePosts === null) {
    console.log("recognized it needed to load this");
    //if the entry does not exist generate it
    let compDate = new Date(
      new Date(collectionDate).getTime() -
        1000 * 60 * 60 * 24 * thresholdDaysPrior,
    ).toISOString();
    // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

    let entry_data = client
      .db("posts")
      .collection(collectionDate)
      .find({ publishedAt: { $gt: compDate } });
    // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

    topPosts = top_posts_algo(
      await entry_data
        .toArray()
        .then((arr) => arr.filter((x) => !(x.body.substring(0, 3) === "zzz"))),
      collectionDate,
      true,
    );
    await cacheCollectionPosts.insertOne({
      collectionDate: collectionDate,
      thresholdDaysPrior: thresholdDaysPrior,
      hasDecay: true,
      topPosts: topPosts,
    });
    return topPosts;
  } else {
    // If the entry does exist, then just pull the keywords from the database
    return cachePosts.topPosts;
  }
}
