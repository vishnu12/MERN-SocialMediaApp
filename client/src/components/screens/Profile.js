import React,{useEffect,useState,useContext} from 'react'
import axios from 'axios'
import {useHistory} from  'react-router-dom'
import { UserContext } from '../../userContext'
import Loading from './Loading'
import { API } from '../../config'


const Profile = () => {

const token=JSON.parse(localStorage.getItem('jwt'))
const {state,dispatch}=useContext(UserContext)
const [pics, setPics] = useState([])
const [image,setImage]=useState('')
const [view, setView] = useState(true)
const [loading, setLoading] = useState(false)

const history=useHistory()

useEffect(()=>{
preload()
},[])

useEffect(()=>{

},[image])

const preload=()=>{
  const config={
    headers:{
      authorization:`Bearer ${token}`
    }
  }
  axios.get(`${API}/myposts`,config)
  .then(res=>setPics(res.data.posts))
  .catch(err=>console.log(err))
}

const uploadPic=()=>{
  const data=new FormData()
  data.append('file',image)
  data.append('upload_preset','instagram-clone')
  data.append('cloud_name','vishnuj')
  return axios.post(`https://api.cloudinary.com/v1_1/vishnuj/image/upload`,data)
 
   
}

const uploadPicToDb=(url)=>{
  const sendData={
    pic:url
  }

  const config={
    headers:{
      authorization:`Bearer ${token}`
    }
  }

  axios.put(`${API}/updatepic`,sendData,config)
  .then(res=>{
    localStorage.setItem('user',JSON.stringify({...state,pic:res.data.pic}))
    dispatch({
      type:'UPDATE_PIC',
      payload:res.data.pic
    })
    setLoading(false)
    setView(true)
  })
  .catch(err=>console.log(err))

}


const updatePhoto=()=>{
  setLoading(true)
   uploadPic()
   .then(res=>{
    uploadPicToDb(res.data.url)
  
    })
   .catch(err=>console.log(err))

}

const deleteProfile=(id)=>{
  setLoading(true)
  const config={
    headers:{
      authorization:`Bearer ${token}`
    }
  }

  axios.delete(`${API}/user/${id}`,config)
  .then(res=>{
    setLoading(false)
    localStorage.clear()
    dispatch({
      type:'CLEAR'
    })
    history.push('/login')
  })
  .catch(err=>console.log(err))
  

}



  return (

    <>

    {
      loading? <Loading />:
      (
        <div style={{maxWidth:'850px',margin:'0px auto'}}>
        <div style={{display:'flex',
        justifyContent:'space-around',
        margin:'18px 0px',
        borderBottom:'1px solid grey'}}>
          
          <div style={{display:'flex',flexDirection:'column'}}>
  <img style={{width:'160px',height:'160px',borderRadius:'80px',margin:'5px'}}
  src={state && state.pic} alt=''/>
          {
            view? 
            (<button className="btn waves-effect waves-light #64b5f6 blue darken-1" style={{margin:'5px'}} type="submit" 
        onClick={()=>setView(false)}>
         Update Pic
         </button>)
            :
            (<><div className="file-field input-field">
           <div className="btn #64b5f6 blue darken-1">
             <span>Upload Image</span>
             <input type="file" onChange={e=>setImage(e.target.files[0])}/>
           </div>
           <div className="file-path-wrapper">
             <input className="file-path validate" type="text"/>
           </div>
         </div>
             <button className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit" onClick={updatePhoto}>
              UPdate
            </button></>)
          }
          <button style={{margin:'5px'}} className="btn waves-effect waves-light #b71c1c red darken-4" type="submit"
          onClick={()=>deleteProfile(state._id)}>
            Delete Profile
          </button>
          </div>
          <div>
          <h4>{state?state.name:'Loading...'}</h4>
          <h5>{state?state.email:'Loading...'}</h5>
          <div style={{display:'flex',justifyContent:'space-between',width:'108%'}}>
            <h5>{pics.length} Posts</h5>
            <h5>{state?state.followers.length:''} Followers</h5>
            <h5>{state?state.following.length:''} Following</h5>
          </div>
          </div>
        </div>
      
      <div className='gallery'>
        {pics.map((item,k)=>{
          return <img className='item' src={item.photo} alt='' key={item._id}/>
        })}
      </div>
      </div>
      )
    }
    
    </>
  )
}

export default Profile
