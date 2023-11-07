import Link from 'next/link';
// Returns a formatted Statistic component for the Overview tab given a title and some data
export default function Statistic(props){
    return (
        <div style={{backgroundImage: 'linear-gradient(rgba(0, 242, 255, 0.65), rgba(255, 0, 242, 0.65))', borderRadius: '10px', padding: '20px', margin: '20px', width: '350px'}}>
            <div style={{textAlign:'center', fontFamily:'Young Serif', fontSize:'25px', backgroundColor:'rgba(255, 255, 255, 0.70)', borderRadius:'10px', padding:'3px', marginBottom:'9px'}}>{props.title + ': ' + props.data}</div>
            <Link href={"/" + props.linkTo}>...</Link>
        </div>
    )
}