import { Young_Serif } from 'next/font/google';
const youngSerif = Young_Serif({
    subsets: ['latin'],
    weight: '400',
  });
// returns a component showcasing the overall statistics for some selected user
export default function SelectedUser(props) {
    return (
        <div style={{backgroundImage: 'linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))', borderRadius: '10px', padding: '20px', margin: '20px', width: '25%', height: '70vh'}}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <div style={{textAlign:'center', fontFamily: youngSerif, fontSize:'20px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', width:'100%', padding:'6px', marginBottom:'9px', marginRight:'9px'}}>{props.userDataset.userName}</div>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'7px'}}>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'85%'}}>Number of posts: </span>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'15%'}}>{props.userDataset.dataArr.reduce((acc, postData) => acc + postData.numPosts, 0)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'7px'}}>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'85%'}}>Number of top posts: </span>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'15%'}}>{props.userDataset.dataArr.reduce((acc, postData) => acc + postData.numTopPosts, 0)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'7px'}}>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'85%'}}>Number of comments: </span>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'15%'}}>{props.userDataset.dataArr.reduce((acc, postData) => acc + postData.numComments, 0)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'7px'}}>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'85%'}}>Number of post views: </span>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'15%'}}>{props.userDataset.dataArr.reduce((acc, postData) => acc + postData.numPostViews, 0)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'7px'}}>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'85%'}}>Number of unanswered questions: </span>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'15%'}}>{props.userDataset.dataArr.reduce((acc, postData) => acc + postData.numUnansweredQuestions, 0)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'7px'}}>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'85%'}}>Average response time (in minutes): </span>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'15%'}}>{0}</span>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'7px'}}>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'85%'}}>Number of first respondent incidents: </span>
                <span style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'15%'}}>{0}</span>
            </div>
        </div>
    )
}