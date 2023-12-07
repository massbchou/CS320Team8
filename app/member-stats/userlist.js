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

    let selectedUser = 0;

    return (
        <div style={{backgroundImage: 'linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))', borderRadius: '10px', padding: '20px', margin: '20px', width: '18%', height: '70vh'}}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <div style={{textAlign:'center', fontFamily: youngSerif, fontSize:'20px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', width:'100%', padding:'6px', marginBottom:'9px', marginRight:'9px'}}>{props.title}</div>
                {(props.totalCount === undefined) ? '' : <div style={{textAlign:'center', fontFamily:'Young Serif', fontSize:'20px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', width:'20%', padding:'6px', marginBottom:'9px'}}>{props.totalCount}</div>}
            </div>
            <div style={{display:'flex', justifyContent:'center', maxHeight:'90%', overflow:'auto',}}>
                <List component="nav" sx={{display:'flex', flexDirection:'column', width:'85%'}}>
                    {props.users.map((x, i) => (
                        <ListItemButton key={i} style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', padding:'2px', margin:'7px 0px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.55', borderRadius:'7px', width:'100%'}}
                            //selected={selectedIndex === 0}
                            //onClick={(event) => handleListItemClick(event, 0)}
                        >
                            <ListItemText style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center'}} primary={x}/>
                        </ListItemButton>
                    ))}
                </List>
            </div>
        </div>
    )
}