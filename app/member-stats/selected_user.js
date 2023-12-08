// Returns a component for a list of users in alphabetical order
import { Young_Serif } from 'next/font/google';
const youngSerif = Young_Serif({
    subsets: ['latin'],
    weight: '400',
  });
export default function SelectedUser(props) {
    return (
        <div style={{backgroundImage: 'linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))', borderRadius: '10px', padding: '20px', margin: '20px', width: '25%', height: '70vh'}}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <div style={{textAlign:'center', fontFamily: youngSerif, fontSize:'20px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', width:'100%', padding:'6px', marginBottom:'9px', marginRight:'9px'}}>{props.userDataset.userName}</div>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', fontFamily: youngSerif, fontSize:'17px'}}>
                <div style={{textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.55', borderRadius:'7px', width:'80%'}}>{'Number of posts:' }</div>
                <div style={{textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.55', borderRadius:'7px', width:'80%'}}>{'Number of trending posts: '}</div>
                <div style={{textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.55', borderRadius:'7px', width:'80%'}}>{'Number of unanswered questions: '}</div>
                <div style={{textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.55', borderRadius:'7px', width:'80%'}}>{'Average reply time: '}</div>
            </div>
        </div>
    )
}