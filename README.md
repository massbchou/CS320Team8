## Campuswire Analytics Dashboard

### Description
This is an analytics dashboard built for a popular class forum website called Campuswire with the aim of giving course staff the data analytics they need to efficiently monitor and manage their forum.

### Tech stack
The dashboard is a web application built with [Next.js](https://nextjs.org/docs), a [React](https://react.dev/) frontend framework.  The team utilized [MongoDB](https://www.mongodb.com/) for the databases that store the forum post data as well as for the cache for our various features.

### Features
#### Overview Page
The app includes a completed 'At-a-glance' Overview page that shows all of the relevant information that a member of the course staff might want to see immediately as they enter:
- **Unanswered Questions**: a list of questions that don't either have a mod answer or an answer that has been endorsed.  This can easily be modified to also display the number of unanswered questions.
- **Top Posts**: a list of posts sorted by their 'score', which is determined by the following metrics: unique views, repeated views, number of comments, number of likes, and the number of days it has been since the post was made
- **Trending Topics**: a ranked list of keywords generated by a Python NLP keyword extraction library ([YAKE!](https://pypi.org/project/yake/)) based on the title and body texts of recent posts
- **Most Active Users**: a list of users sorted by their engagement on the forum

All of these features are implemented on the frontend through a React `<Feature>` component that allows for a scalable, flexible, and standardized design.

**Screenshot**

<img width="70%" alt="Overview Page Screenshot" src="https://github.com/massbchou/CS320Team8/assets/110953303/cc92eb61-898f-40b6-8c42-0542475b06a6">

#### Member Statistics Page
The app also includes a page for course staff to use to view activity statistics for individual members in aggregate and over time
- **User List**: a component that displays a list of forum users that are clickable to update the entire page to view stats for that user.  Moderators are marked with a tag to differentiate them from students.
- **Selected User Window**: a window to display aggregate statistics for the currently selected user.  Tracked metrics include their number of posts, top posts, comments, post views, and unanswered quesitons, and for moderators, it also includes their average response time and the number of first respondent incidents.
- **Stats Graph**: a Chart.js graph component to display the selected user's activity over time.  The graph tracks all of the non-moderator specific metrics in the selected user window on a daily basis.  Graph controls include the ability to toggle each metric's visibility within the graph, time denomination switching (Weekly, Monthly, and All Time), and interval switching (switching to the previous or next interval, ex. previous/next week on weekly view)

**Screenshot**

<img width="70%" alt="Member Statistics Page Screenshot" src="https://github.com/massbchou/CS320Team8/assets/110953303/44338dcd-95fa-420a-a79f-bc3804d80718">

#### Caching

The team has implemented caching functionality for our features such that when a list of values has to be generated for a specific post collection date, it first checks the caching database to see if that value is already in cache.  If it is, it simply returns the cached values for display, and if it isn't, it generates and caches them for next time.  This has given our app a noticable performance increase.

### Local Setup
- Clone the repository into a local folder
- Run `npm i` in the project directory to install necessary dependencies
- See `requirements.txt` for other necessary dependencies on your local machine
- Run `npm run dev` to start the development server
- Head to `http://localhost:3000/` to test the app
