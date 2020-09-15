import React,{useState,useContext} from 'react'
import { Link,useHistory } from 'react-router-dom'
import M from 'materialize-css'
import axios from 'axios'
import {UserContext} from '../../userContext'
import { API } from '../../config'


const Login = () => {
const {state,dispatch}=useContext(UserContext)
const history=useHistory()

const [password, setPassword] = useState('')
const [email, setEmail] = useState('')

const postData=(e)=>{
  e.preventDefault()
  const data={
    email,
    password
  }

  if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
    M.toast({html:"Invalid email",classes:'#ef5350 red lighten-1'})
  }else{
    axios.post(`${API}/signin`,data)
  .then(res=>{
    localStorage.setItem('jwt',JSON.stringify(res.data.token))
    localStorage.setItem('user',JSON.stringify(res.data.user))
    dispatch({
      type:'USER',
      payload:res.data.user
    })
    M.toast({html:'Signed in successfully',classes:'#558b2f light-green darken-3'})
    history.push('/')
  })
  .catch(err=>{
    M.toast({html: err.response.data.error,classes:'#ef5350 red lighten-1'})
  })
  }
  
}

  return (
    <div className='mycard input-field'>
      <div className="card auth-card">
        <h2>Instagram</h2>
        <form onSubmit={postData}>
        <input type='email'
        placeholder='email' value={email} onChange={e=>setEmail(e.target.value)}/>
        <input type='password'
        placeholder='password' value={password} onChange={e=>setPassword(e.target.value)}/>
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit">
         Login
       </button>
       </form>
        
       <h5>
        <Link to='/signup'>Don't have an account?</Link>
    </h5>
      </div>
    </div>
  )
}

export default Login
