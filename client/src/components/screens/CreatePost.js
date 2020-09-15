import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'
import Loading from './Loading'
import { API } from '../../config'

const CreatePost = () => {

  const history=useHistory()
  const token=JSON.parse(localStorage.getItem('jwt'))
 

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState('')
  const [url,setUrl]=useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(url){
      mongoPost()
    }
  },[url])
  
  const postDetails=()=>{
    setLoading(true)
    const data=new FormData()
    data.append('file',image)
    data.append('upload_preset','instagram-clone')
    data.append('cloud_name','vishnuj')
    axios.post(`https://api.cloudinary.com/v1_1/vishnuj/image/upload`,data)
    .then(res=>{
      setUrl(res.data.url)
    })
    .catch(err=>console.log(err))
     
  }

  const mongoPost=()=>{
    const postData={
      title,
      body,
      pic:url
    }
    
    const config={
      headers:{
        authorization:`Bearer ${token}`
      }
    }
   axios.post(`${API}/createpost`,postData,config)
   .then(res=>{
     M.toast({html:'Post created successfully',classes:'#558b2f light-green darken-3'})
     setLoading(false)
     history.push('/')
   })
   .catch(err=>{
     M.toast({html: err.response.data.error,classes:'#ef5350 red lighten-1'})
   })
  }


  return (
    <>
    {loading?
    <Loading />:
    <div className='card input-field'
    style={{margin:'40px auto',
    maxWidth:'500px',
    padding:'20px',
    textAlign:'center'}}>
        <input type='text' placeholder='title' 
        onChange={e=>setTitle(e.target.value)} value={title}/>

        <input type='text' placeholder='body'
        onChange={e=>setBody(e.target.value)} value={body}/>

        <div className="file-field input-field">
      <div className="btn #64b5f6 blue darken-1">
        <span>Upload Image</span>
        <input type="file" onChange={e=>setImage(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
    </div>
    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit"
    onClick={postDetails}>
         Submit
       </button>
    </div>
    }
    
    </>
  )
}

export default CreatePost
