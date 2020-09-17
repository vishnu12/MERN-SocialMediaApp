import React,{useState,useEffect,useContext} from 'react'
import axios from 'axios'
import { UserContext } from '../../userContext'
import { Link } from 'react-router-dom'
import { API } from '../../config'



const Home = () => {

  const {state,dispatch}=useContext(UserContext)

  const [data, setData] = useState([])
  const [comments, setCommets] = useState('')
  const token=JSON.parse(localStorage.getItem('jwt'))
  

  useEffect(()=>{
   preload()
  },[])

 const preload=()=>{
   const config={
     headers:{
       authorization:`Bearer ${token}`
     }
   }
   axios.get(`${API}/allposts`,config)
   .then(res=>setData(res.data.posts))
   .catch(err=>console.log(err))
 }

const likePosts=(id)=>{
  const config={
    headers:{
      authorization:`Bearer ${token}`
    }
  }

  const sendData={
    postId:id
  }
  axios.put(`${API}/like`,sendData,config)
  .then(res=>{
    const newData=data.map(item=>{
      if(item._id===res.data._id){
          return res.data
      }else{
         return item
      }
    })

    setData(newData)
  })
  .catch(err=>console.log(err))
}

const unLikePosts=(id)=>{
  const config={
    headers:{
      authorization:`Bearer ${token}`
    }
  }

  const sendData={
    postId:id
  }
  axios.put(`${API}/unlike`,sendData,config)
  .then(res=>{
    const newData=data.map(item=>{
      if(item._id===res.data._id){
          return res.data
      }else{
         return item
      }
    })

    setData(newData)
  })
  .catch(err=>console.log(err))
}


const makeComment=(text,postId)=>{
  const config={
    headers:{
      authorization:`Bearer ${token}`
    }
  }

  const postData={
    text,
    postId
  }
  axios.put(`${API}/comment`,postData,config)
  .then(res=>{
    const newData=data.map(item=>{
      if(item._id===res.data._id){
          return res.data
      }else{
         return item
      }
    })

    setData(newData)
  })
  .catch(err=>console.log(err))

}

const deletePost=(postId)=>{

  const config={
    headers:{
      authorization:`Bearer ${token}`
    }
  }

  axios.delete(`${API}/deletepost/${postId}`,config)
  .then(res=>{
    const newData=data.filter(item=>item._id!==res.data._id)

    setData(newData)
  })
  .catch(err=>console.log(err))

}

const deleteComment=(postId,commentId)=>{

  const configData={
    headers:{
      authorization:`Bearer ${token}`
    }
  }
  axios.put(`${API}/deletecomment/${postId}/${commentId}`,{},configData)
  .then(res=>{
    preload()
  })
  .catch(err=>console.log(err.response.data))

}
console.log(data)

  return (
    <div className='home'>
  {
    data.map((item,k)=>{
    return (<div className='card home-card' key={k}>
      <div style={{display:'flex',justifyContent:'space-between'}}>
       <img src={state && state.pic} alt='' style={{height:'30px',width:'45px',marginTop: '16px'}}/> 
      <h5 style={{display:'flex',justifyContent:'space-between',padding:'5px'}}>
      {
         item.postedBy._id===state._id? <Link to='/profile'>{item.postedBy.name}</Link>:
          <Link to={`/profile/${item.postedBy._id}`}>{item.postedBy.name}</Link>
        }
      {
        item.postedBy._id===state._id?
        <i className="material-icons" style={{cursor:'pointer'}}
        onClick={()=>deletePost(item._id)}>
          delete</i>
        :''
      }
  
    </h5>
      </div>
    <div className='card-image'>
<img src={item.photo} alt=''/>
    </div>
    <div className='card-content'>
    <i className="material-icons" style={{color:'red'}}>favorite</i>

    {
      item.likes.includes(state._id)?
      <i className="material-icons" style={{cursor:'pointer'}} onClick={()=>unLikePosts(item._id)}>thumb_down</i>
      :
      <i className="material-icons" style={{cursor:'pointer'}} onClick={()=>likePosts(item._id)}>thumb_up</i>
    }

    
    
   <h6>{item.likes.length} Likes</h6>
   <h6>{item.title}</h6>
   <p>{item.body}</p>
   {
     item.comments.map((record,k)=>{
       return(
        record.postedBy && <h6 key={k} style={{display:'flex',padding:'5px',marginLeft:'5px'}}>
           <span style={{fontWeight:'500'}}>{record.postedBy.name}</span>
           {record.text}
           {
             record.postedBy._id===state._id?
             <i className="material-icons" style={{cursor:'pointer'}}
             onClick={()=>deleteComment(item._id,record._id)}>
           delete</i>
           :''
           }
         </h6>
       )
     })
   }

   <form onSubmit={e=>{
     e.preventDefault()
     makeComment(comments,item._id)
     setCommets('')
   }}>
   <input type='text' value={comments} placeholder='add comment' onChange={e=>setCommets(e.target.value)}/>
   </form>
    </div>
      </div>)
      
    })
  }
     
    </div>
  )
}

export default Home
