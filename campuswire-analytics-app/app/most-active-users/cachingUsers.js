export default handlingTopUserCaching;

async function handlingTopUserCaching(cacheUsers){
    if (cacheUsers === null) {
        //if the entry does not exist generate it
        const endDate = new Date(collectionDate);
        let beginDate = new Date(
          new Date(collectionDate).getTime() -
            1000 * 60 * 60 * 24 * thresholdDaysPrior,
        );
    
        // Finds all posts made by all users -- see students vs moderators in most-active-users/page.js
        let user_data = client.db("users").collection("users");
        // filter users by role, unless role is "all" which gets all users
        user_data =
          userRole === "all"
            ? user_data.find()
            : user_data.find({ "author.role": userRole });
    
        let user_arr = await user_data.toArray();
        // Gets the data as an array
    
        const filteredDocuments = user_arr.map((entry) => {
          //for every post within the collection
          const filteredDocument = { _id: entry._id, author: entry.author };
    
          for (const key in entry) {
            //for every field in the entry find the ones that are dates (so exclude id and author)
            if (["_id", "author"].includes(key)) continue;
    
            const date = new Date(key);
            if (beginDate < date && date < endDate) {
              //find what dates come before the end threshold (collectionDate), and after the begin threshold (20 days prior to collectionDate)
              filteredDocument[key] = entry[key]; //adds the date field if its within the date range (the field that stores the values postIds, commentIds, postCount, commentCount, totalCount)
            }
          }
          return filteredDocument;
        });
    
        const filteredArray = filteredDocuments.filter(
          (doc) => Object.keys(doc).length > 2,
        );
        //filters out all the entries that have no posts or comments because they have no date fields because they only have id and author fields
    
        topUsers = top_users_algo(filteredArray, beginDate, endDate);
        await cacheCollectionUsers.insertOne({
          collectionDate: collectionDate,
          thresholdDaysPrior: thresholdDaysPrior,
          role: userRole,
          topUsers: topUsers,
        });
        return topUsers;
      } else {
        // If the entry does exist, then just pull the keywords from the database
       return cacheUsers.topUsers;
      }
}
