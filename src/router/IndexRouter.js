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
        <Route path='/collections/*' element={<Collection/>} />
        <Route path='/planner/*' element={<Planner/>}/>
        <Route path='/members/*' element={<Member/>}/>
        <Route path='/groups/*' element={<Group/>} />
        <Route path='/home/*' element={<Home/>}/>
        <Route path='/search' element={<Search />} />
        <Route path='/' element={<Navigate to='/home'/>} /> 
    </Routes>
  )
}

