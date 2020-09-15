import React,{useEffect,useState,useContext} from 'react'
import axios from 'axios'
import { UserContext } from '../../userContext'
import {useParams} from 'react-router-dom'
import {API} from '../../config'
const UserProfile = () => {

const token=JSON.parse(localStorage.getItem('jwt'))
const {state,dispatch}=useContext(UserContext)
const [userProfile,setUserProfile] = useState(null)


const {userId}=useParams()

const [follow, setFollow] = useState(state?state.following.includes(userId):false)

useEffect(()=>{
preload()
},[])

const preload=()=>{
  const config={
    headers:{
      authorization:`Bearer ${token}`
    }
  }
  axios.get(`${API}/user/${userId}`,config)
  .then(res=>setUserProfile(res.data))
  .catch(err=>console.log(err))
}

const followUser=()=>{
    const config={
        headers:{
          authorization:`Bearer ${token}`
        }
      }
    
      const data={
        followId:userId
      }

      axios.put(`${API}/follow`,data,config)
      .then(res=>{
          dispatch({
              type:'UPDATE',
              payload:{
                  followers:res.data.followers,
                  following:res.data.following,
                 
              }
          })

          localStorage.setItem('user',JSON.stringify(res.data))
          setFollow(true)
          preload()
      })
      .catch(err=>console.log(err))
}

const unFollowUser=()=>{
    const config={
        headers:{
          authorization:`Bearer ${token}`
        }
      }
    
      const data={
        unfollowId:userId
      }

      axios.put(`${API}/unfollow`,data,config)
      .then(res=>{
          dispatch({
              type:'UPDATE',
              payload:{
                  followers:res.data.followers,
                  following:res.data.following,
                  
              }
          })

          localStorage.setItem('user',JSON.stringify(res.data))
          setFollow(false)
          preload()
      })
      .catch(err=>console.log(err))
}

  return (
    <>
    {
        userProfile?
        <div style={{maxWidth:'850px',margin:'0px auto'}}>
      <div style={{display:'flex',
      justifyContent:'space-around',
      margin:'18px 0px',
      borderBottom:'1px solid grey'}}>
        <div>
<img style={{width:'160px',height:'160px',borderRadius:'80px'}}
src={userProfile.user.pic}/>
        </div>
        <div>
         <h4>{userProfile.user.name}</h4>
        <div style={{display:'flex',justifyContent:'space-between',width:'108%'}}>
          <h5>{userProfile.post.length} Posts</h5>
          <h5>{userProfile.user.followers.length} Followers</h5>
          <h5>{userProfile.user.following.length} Following</h5>
        </div>

      {
          !follow? 
          <button style={{margin:'10px'}} className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit" onClick={followUser}>
          Follow
        </button>
          :

        <button style={{margin:'10px'}} className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit" onClick={unFollowUser}>
         Unfollow
       </button>

      }



       
        </div>
      </div>
    
    <div className='gallery'>
      {userProfile.post.map((item,k)=>{
        return <img className='item' src={item.photo} alt='' key={item._id}/>
      })}
    </div>
    </div>
        :<h2>Loading...!</h2>
    }
    

    </>
  )
}

export default UserProfile
