import React, { useEffect, useState } from 'react'
import { Layout, Menu, Input } from 'antd'
import LoginRequest from './login/LoginRequest'
import LoggedUser from './login/LoggedUser'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getRecipeSearch, getSearchName } from '../redux/recipeListSlice'

const { Header } = Layout
const { Search } = Input
export default function PageHeader() {
  const { loggedUser } = useSelector(state=>state.logOnStatus)
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const [ selectedKey, setSelectedKey]=useState('')
  const dispatch = useDispatch()

  const clickMenu = (item)=>{
    navigate(item.key) 
  }

  const [recipeList, setRecipeList] = useState([]) 
  useEffect(()=>{
    axios.get('/recipes').then(res=>{
      setRecipeList(res.data)
    })
  },[])  
  
  const onSearch = (text)=>{
    let list = []
    recipeList.map(item=>{    
      let regExp = new RegExp(text,'i')
      if( regExp.test(item.keywords) || regExp.test(item.title) ){
        list.push(item)
      }     
      return list
    })
    dispatch(getRecipeSearch(list))
    dispatch(getSearchName(text))
    navigate(`/mykitchen/search?${text}`) 
  }

  const menuItems = [
    {
      key: '/mykitchen/home',
      label: 'Home'      
    },
    {
      key: '/mykitchen/collections',
      label: 'Collections'
    },
    {
      key: '/mykitchen/planner',
      label:'Planner'
    },
    {
      key: '/mykitchen/members',
      label: 'Members'
    }
  ] 

  useEffect(()=>{
    setSelectedKey(pathname.match(/\/(\w)*/)[0])
  },[pathname])

  return (
    <Header>
      <div className="logo" >
        MyKitchen
      </div>
      <Menu 
        mode="horizontal"
        items={menuItems}
        theme='dark'
        selectedKeys={selectedKey}
        onClick={clickMenu}
      />  
      <div  className='searchwrap'>
        <Search
            placeholder="search by recipe or keyword" 
            onSearch={(e)=>onSearch(e)} 
            enterButton 
        />
      </div>
      {
        loggedUser? <LoggedUser/> : <LoginRequest/>
      }      
    </Header>
  )
}
