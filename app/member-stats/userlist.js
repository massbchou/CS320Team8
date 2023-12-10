import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Young_Serif } from 'next/font/google';
const youngSerif = Young_Serif({
    subsets: ['latin'],
    weight: '400',
  });
// Returns a component for a list of users in alphabetical order
export default function UserList(props){
    return (
        <div style={{backgroundImage: 'linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))', borderRadius: '10px', padding: '20px', margin: '20px', width: '18%', height: '70vh'}}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <div style={{textAlign:'center', fontFamily: youngSerif, fontSize:'20px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', width:'100%', padding:'6px', marginBottom:'9px', marginRight:'9px'}}>Forum Users</div>
                <div style={{textAlign:'center', fontFamily:'Young Serif', fontSize:'20px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', width:'20%', padding:'6px', marginBottom:'9px'}}>{props.userList.length}</div>
            </div>
            <div style={{display:'flex', justifyContent:'center', maxHeight:'90%', overflow:'auto',}}>
                <List component="nav" sx={{display:'flex', flexDirection:'column', width:'85%'}}>
                    {props.userList.map((user) => (
                        <ListItemButton style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, .9)', opacity:'0.6', borderRadius:'7px'}} href={"/member-stats?userID=" + user.id} key={user.id}>
                            <ListItemText primary={user.name}/>
                        </ListItemButton>
                    ))}
                </List>
            </div>
        </div>
    )
}

/*
<div key={i + 'a'} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
    <span key={i + 'b'} style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'90%'}}>{x}</span>
</div>
*/