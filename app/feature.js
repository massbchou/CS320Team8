'use client'
import Link from 'next/link';
import Button from '@mui/material/Button';
import { Young_Serif } from 'next/font/google';
const youngSerif = Young_Serif({
    subsets: ['latin'],
    weight: '400',
  });
// Returns a formatted Feature component for the Overview tab given a title and some data
export default function Feature(props){
    if(props.hasButton){
        return (
            <div style={{backgroundImage: 'linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))', borderRadius: '10px', padding: '20px', margin: '20px', width: '18%'}}>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <div style={{textAlign:'center', fontFamily: youngSerif, fontSize:'20px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', width:'100%', padding:'6px', marginBottom:'9px', marginRight:'9px'}}>{props.title}</div>
                </div>
                {props.content.map((x, i) => (
                    <div key={i + 'a'} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <span key={i + 'b'} style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'10%'}}>{i + 1}</span>
                        <span key={i + 'c'} style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'70%'}}>{x}</span>
                    </div>
                ))}
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'6px', color:'rgba(255, 255, 255, 1)', opacity:'0.6'}}>
                    <Link href={"/" + props.linkTo}>
                        <Button size="small" variant="contained">...</Button>
                    </Link>
                </div>
            </div>
        )
    }
    else{
        return (
            <div style={{backgroundImage: 'linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))', borderRadius: '10px', padding: '20px', margin: '20px', width: '18%'}}>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <div style={{textAlign:'center', fontFamily: youngSerif, fontSize:'20px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', width:'100%', padding:'6px', marginBottom:'9px', marginRight:'9px'}}>{props.title}</div>
                </div>
                {props.content.map((x, i) => (
                    <div key={i + 'a'} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <span key={i + 'b'} style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'10%'}}>{i + 1}</span>
                        <span key={i + 'c'} style={{fontFamily: youngSerif, fontSize:'17px', textAlign:'center', margin:'6px', padding:'2px', backgroundColor:'rgba(255, 255, 255, 1)', opacity:'0.6', borderRadius:'7px', width:'70%'}}>{x}</span>
                    </div>
                ))}
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'6px', color:'rgba(255, 255, 255, 1)', opacity:'0.6'}}>
                </div>
            </div>
        )
    }
}


// Unanswered questions total count consideration: {(props.totalCount === undefined) ? '' : <div style={{textAlign:'center', fontFamily:'Young Serif', fontSize:'20px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', width:'15%', padding:'6px', marginBottom:'9px'}}>{props.totalCount}</div>}
// Our definition of what constitutes an unanswered question might need to be reworked