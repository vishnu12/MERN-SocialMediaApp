import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import { UserContext } from '../userContext'
const Navbar = () => {

const {state,dispatch}=useContext(UserContext)
const history=useHistory()
const logout=()=>{
  localStorage.clear()
  dispatch({
    type:'CLEAR'
  })

 history.push('/login')
}

const renderList=()=>{
  if(state){
    return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create Post</Link></li>,
        <li><Link to="/myfollowing">Following</Link></li>,
        <li>
          <button className="btn waves-effect waves-light #ef5350 red lighten-1" type="submit" onClick={logout}>
              Logout
          </button>
        </li>
    ]
  }else{
      return [
       <li><Link to="/login">Login</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]
  }
}
  return (
    <nav style={{background:'white'}}>
    <div className="nav-wrapper">
      <Link to={`${state ?'/':'/login'}`} className="brand-logo left">Logo</Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        
        {renderList()}
      </ul>
    </div>
  </nav>
  )
}

export default Navbar
