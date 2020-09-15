import React,{useEffect, useState} from 'react'
import { Link,useHistory } from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'
import Loading from './Loading'
import { API } from '../../config'

const Signup = () => {

const history=useHistory()
const [name, setName] = useState('')
const [password, setpassword] = useState('')
const [email, setEmail] = useState('')
const [image,setImage]=useState('')
const [url,setUrl]=useState('')
const [loading, setLoading] = useState(false)


useEffect(()=>{
  if(url){
    postFields()
    setUrl('')
  }

},[url])

const uploadPic=()=>{
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

const postFields=()=>{
  const data={
    name,
    email,
    password,
    pic:url
  }

  if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
    M.toast({html:"Invalid email",classes:'#ef5350 red lighten-1'})
  }else{
    axios.post(`${API}/signup`,data)
  .then(res=>{
    setLoading(false)
    M.toast({html:res.data.message,classes:'#558b2f light-green darken-3'})
    history.push('/login')
  })
  .catch(err=>{
    M.toast({html: err.response.data.error,classes:'#ef5350 red lighten-1'})
  })
  }

}

const postData=()=>{
  setLoading(true)
  if(image){
    uploadPic()
    setImage('')
  }else{
    postFields()
  }
  
}

  return (
    <>
    {
      loading? 
      <Loading />
      :
      <div className='mycard input-field'>
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input type='text'
        placeholder='name' value={name} onChange={e=>setName(e.target.value)}/>
        <input type='email'
        placeholder='email' value={email} onChange={e=>setEmail(e.target.value)}/>
        <input type='password'
        placeholder='password'value={password} onChange={e=>setpassword(e.target.value)}/>
         
         <div className="file-field input-field">
      <div className="btn #64b5f6 blue darken-1">
        <span>Upload Image</span>
        <input type="file" onChange={e=>setImage(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
    </div>
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit" onClick={postData}>
         Signup
       </button>
    
    <h5>
        <Link to='/login'>Already have an account?</Link>
    </h5>

      </div>
    </div>
    }
    
    </>
  )
}

export default Signup
