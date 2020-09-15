import React,{useEffect,createContext,useReducer} from 'react'
import {reducer} from '../src/reducers/userReducer'

const UserContext=createContext()


const UserProvider = ({children}) => {

 const initialState=null
    
 const [state,dispatch]=useReducer(reducer,initialState)

  return (
    <UserContext.Provider value={{
        state,
        dispatch
    }}>
      {children}
    </UserContext.Provider>
  )
}

export {UserContext,UserProvider}
