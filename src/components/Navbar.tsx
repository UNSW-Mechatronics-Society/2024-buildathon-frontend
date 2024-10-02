import { Link } from "react-router-dom";

function Navbar() {
    return <div style={{opacity:0.7, width:"100%"}}><span style={{display:'flex', alignItems:'baseline'}}><h1>Buildathon Shop</h1><Link to='/history'  style={{background: 'green', color:"white", marginLeft:'4rem'}} className="p-2">Purchase History</Link></span></div>;
  }
  
  export default Navbar;
  