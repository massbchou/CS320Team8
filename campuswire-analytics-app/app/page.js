// mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/
import {MongoClient} from "mongodb";
import Image from "next/image";
// import goldstar_nobackground from '../public/goldstar_nobackground.png';
// import silverstar_nobackground from '../public/silverstar_nobackground.png';
// import bronzestar_nobackground from '../public/bronzestar_nobackground.png';
import Feature from './feature.js';
import background from './images/background.png'
import top_posts_algo from './top_posts.js';
import prolific_users_algo from './prolific_users.js';

export default async function Mongo() {
  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let topPosts;
  let prolificUsers;
  let topPhrases;
  let inputText = '';
  // Create initially empty input text variable

  try {
    await client.connect();
    // Connect to cluster

    let collectionDate = '2022-11-19';
    // Set collection date

    let cacheCollection = client.db('caching').collection('trending topics');
    let cache = await cacheCollection.findOne({collectionDate: collectionDate});
    // Try to find the cache entry with the corresponding collectionDate
    
    if(cache === null){ // If the entry does not exist, generate it
      const MAX_DAYS_OLD = 20;
      let comparisonDate = new Date(new Date(collectionDate).getTime() - (1000 * 60 * 60 * 24 * MAX_DAYS_OLD)).toISOString();
      // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

      let cursor = client.db('posts').collection(collectionDate).find({publishedAt: {$gt: comparisonDate}});
      // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

      let arr = await cursor.toArray();
      // Turn cursor into an array of post objects

      arr = arr.filter((x) => !(x.body.substring(0, 3) === 'zzz'));
      // Filter out all fake entries that start with 'zzz'

      arr.forEach(function(x){
        if(x.body.indexOf('![') >= 0){
          let start = Math.max(x.body.lastIndexOf('.png)'), x.body.lastIndexOf('.jpg)')) + 5;
          x.body = x.body.substring(0, x.body.indexOf('![')) + x.body.substring(start);
        }
      });
      // Remove all embedded images
      
      for(let i = 0; i < arr.length; i++){
        inputText += arr[i].title + ' ' + arr[i].body + ' ';
      }
      // Generate concatenation of all remaining title and body texts
    
      inputText = inputText.replaceAll('\n', ' ');
      // Remove all newlines

      const { PythonShell } = require('python-shell');

      await PythonShell.run('./app/keyword_extractor.py', {mode: 'json', pythonPath: 'py', args: [inputText]}).then(msg => {
        topPhrases = msg[0];
      });
      // Spawn Python process, pass it the text
      // When the output from the script is receieved, capture it

      await cacheCollection.insertOne({collectionDate: collectionDate, topPhrases: topPhrases});
      // Insert the generated keywords into the cache database
    }else{ // If the entry does exist, then just pull the keywords from the database
      topPhrases = cache.topPhrases;
    }
    
    let cacheCollectionPosts = client.db('caching').collection('top posts');
    let cachePosts = await cacheCollectionPosts.findOne({collectionDate: collectionDate});

    if(cachePosts === null){//if the entry does not exist generate it
      const MAX_DAYS_OLD = 20;
      let compDate = new Date(new Date(collectionDate).getTime() - (1000 * 60 * 60 * 24 * MAX_DAYS_OLD)).toISOString();
      // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

      let entry_data = client.db('posts').collection(collectionDate).find({publishedAt: {$gt: compDate}});
      // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

      topPosts = top_posts_algo(await entry_data.toArray().then((arr) => arr.filter((x) => !(x.body.substring(0, 3) === 'zzz'))), collectionDate);
      await cacheCollectionPosts.insertOne({collectionDate: collectionDate, topPosts: topPosts});
    }
    else{// If the entry does exist, then just pull the keywords from the database
      topPosts = cachePosts.topPosts;
    }

    let cacheCollectionUsers = client.db('caching').collection('prolific users');
    let cacheUsers = await cacheCollectionUsers.findOne({collectionDate: collectionDate});

    if(cacheUsers === null){//if the entry does not exist generate it
      const endDate = new Date(collectionDate);
      const MAX_DAYS_OLD = 20;
      let beginDate = new Date(new Date(collectionDate).getTime() - (1000 * 60 * 60 * 24 * MAX_DAYS_OLD));

      let user_data = client.db('users').collection('users').find({'author.role':'member'});
      // Finds all posts made by non-moderators
     
      let user_arr = await user_data.toArray();
      // Gets the data as an array
      
      const filteredDocuments = user_arr.map(entry =>{ //for every post within the collection
        const filteredDocument = {_id: entry._id, author: entry.author};

        for(const key in entry){//for every field in the entry find the ones that are dates (so exclude id and author)
          const date = new Date(key);
          
          if(!isNaN(date) && date < endDate && date > beginDate){//find what dates come before the end threshold (collectionDate), and after the begin threshold (20 days prior to collectionDate)
            filteredDocument[key] = entry[key]; //adds the date field if its within the date range (the field that stores the values postIds, commentIds, postCount, commentCount, totalCount)
          }
        }
        return filteredDocument;
      });

      const filteredArray = filteredDocuments.filter(doc => Object.keys(doc).length > 2);
      //filters out all the entries that have no posts or comments because they have no date fields because they only have id and author fields

      prolificUsers = prolific_users_algo(filteredArray);
      await cacheCollectionUsers.insertOne({collectionDate: collectionDate, prolificUsers: prolificUsers});
    }
    else{// If the entry does exist, then just pull the keywords from the database
      prolificUsers = cacheUsers.prolificUsers;
    }
  } catch (e) {
    console.log("There was an error in connecting to mongo")
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main style={{backgroundImage: `url(${background.src})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat', height:'100vh'}}>
      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Image src='/images/icon.png' width={90} height={90} quality={100} style={{margin:'10px'}} unoptimized></Image>
        <span style={{fontFamily:'Roboto', textAlign:'center', fontSize:'30px'}}>Campuswire Analytics</span>
      </div>
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin: '10px'}}>
        <Feature linkTo= 'trending-topics' title='Trending Topics' content={topPhrases}></Feature>
        <Feature linkTo= 'top-posts' title='Top Posts' content={topPosts}></Feature>
        <Feature linkTo= 'most-active-users' title='Most Active Users' content={prolificUsers}></Feature>
      </div>
    </main>
  );
}
