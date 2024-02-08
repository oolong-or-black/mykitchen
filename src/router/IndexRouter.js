import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../views/sandbox/Home'
import Collection from '../views/sandbox/Collection'
import Planner from '../views/sandbox/Planner'
import Group from '../views/sandbox/Group'
import Member from '../views/sandbox/Member'
import Search from '../views/sandbox/Search'
export default function indexRouter() {
  return (
    <Routes>
        <Route path='/mykitchen/collections' element={<Collection/>} />
        <Route path='/mykitchen/planner' element={<Planner/>}/>
        <Route path='/mykitchen/members/*' element={<Member/>}/>
        <Route path='/mykitchen/groups/*' element={<Group/>} />
        <Route path='/mykitchen/home' element={<Home/>}/>
        <Route path='/mykitchen/search' element={<Search />} />
        <Route path='/mykitchen/' element={<Navigate to='/home'/>}/> 
        <Route path='/mykitchen/*' element={<Navigate to='/home'/>}/> 
    </Routes>
  )
}

