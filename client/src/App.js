import React,{useContext, useEffect} from 'react';
import Navbar from './components/Navbar';
import './App.css'
import {BrowserRouter as Router,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import {UserContext} from './userContext'
import UserProfile from './components/screens/UserProfile';
import FollowingPosts from './components/screens/FollowingPosts';


const Routing=()=>{
  
  const history=useHistory()
  const {dispatch}=useContext(UserContext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    if(user){
      dispatch({
        type:'USER',
        payload:user
      })
      
    }else{
      history.push('/login')
    }
 },[])

  return (
<Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/profile' component={Profile}/>
        <Route path='/login' component={Login}/>
        <Route path='/signup' component={Signup}/>
        <Route path='/create' component={CreatePost}/>
        <Route path='/profile/:userId' component={UserProfile}/>
        <Route path='/myfollowing' component={FollowingPosts}/>
      </Switch>
  )
}

function App() {
 
  
  return (
    <>
  
    <Router>
    <Navbar />
      <Routing />
    </Router>
    </>
  );
}

export default App;
