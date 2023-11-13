export default handlingHotTopicsCaching;

async function handlingHotTopicsCaching(cache, cacheCollection){
    if (cache === null) {
        // If the entry does not exist, generate it
        const MAX_DAYS_OLD = 20;
        let comparisonDate = new Date(
          new Date(collectionDate).getTime() - 1000 * 60 * 60 * 24 * MAX_DAYS_OLD,
        ).toISOString();
        // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date
  
        let cursor = client
          .db("posts")
          .collection(collectionDate)
          .find({ publishedAt: { $gt: comparisonDate } });
        // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date
  
        let arr = await cursor.toArray();
        // Turn cursor into an array of post objects
  
        arr = arr.filter((x) => !(x.body.substring(0, 3) === "zzz"));
        // Filter out all fake entries that start with 'zzz'
  
        arr.forEach(function (x) {
          if (x.body.indexOf("![") >= 0) {
            let start =
              Math.max(x.body.lastIndexOf(".png)"), x.body.lastIndexOf(".jpg)")) +
              5;
            x.body =
              x.body.substring(0, x.body.indexOf("![")) + x.body.substring(start);
          }
        });
        // Remove all embedded images
  
        for (let i = 0; i < arr.length; i++) {
          inputText += arr[i].title + " " + arr[i].body + " ";
        }
        // Generate concatenation of all remaining title and body texts
  
        inputText = inputText.replaceAll("\n", " ");
        // Remove all newlines
  
        const { PythonShell } = require("python-shell");
  
        await PythonShell.run("./app/keyword_extractor.py", {
          mode: "json",
          pythonPath: "py",
          args: [inputText],
        }).then((msg) => {
          topPhrases = msg[0];
        });
        // Spawn Python process, pass it the text
        // When the output from the script is receieved, capture it
  
        await cacheCollection.insertOne({
          collectionDate: collectionDate,
          topPhrases: topPhrases,
        });
        // Insert the generated keywords into the cache database
        return topPhrases;
      } else {
        // If the entry does exist, then just pull the keywords from the database
        return cache.topPhrases;
      }  
}