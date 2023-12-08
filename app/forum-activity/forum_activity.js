import mp from "../missingParameter";

// return {numPosts: int, numComments: int} for each day
export function getForumActivity(allPosts = mp(), start = mp(), end = mp()) {
  let currentDate = new Date(3000, 0, 1); // init with arbitrary maximum date 3000-01-01
  let prevIdx = 0;
  // filter posts within start and end publishedAt time
  const relPosts = allPosts.filter((post) => {
    const postDate = new Date(post.publishedAt.slice(0, 10)); // yyyy-mm-dd
    // get date of first post
    if (postDate < currentDate) currentDate = postDate;
    return start < postDate && postDate < end;
  });

  return (
    relPosts
      // sort posts by increasing publishedAt time
      .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))

      // split posts into days
      .reduce((curDate, post, i, dates) => {
        const postDate = new Date(post.publishedAt.slice(0, 10));
        const ifNextDate = postDate > currentDate;
        // current post is after current date, get next date
        // or is last post
        if (ifNextDate || i === dates.length) {
          curDate.push({
            posts: dates.slice(prevIdx, i + 1),
            numPosts: 0,
            numComments: 0,
          });
          // update current date
          currentDate = postDate;
          prevIdx = i;
        }
        return curDate;
      }, [])

      // get number of posts/comments for each date
      .map((date) => {
        date.posts.forEach((post) => {
          // posts always have comments field with at least empty array
          date.numComments += post.comments.length;
        });
        date.numPosts = date.posts.length;
        delete date.posts; // dont need posts anymore
        return date;
      })
  );
}
