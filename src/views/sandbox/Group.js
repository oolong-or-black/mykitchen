import React, {useEffect, useState} from 'react'
import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import DisplayView from '../../components/displays/DisplayView'

const { Sider, Content } = Layout
export default function Group() {
  const {pathname} = useLocation()
  const [ recipeList, setRecipeList ] = useState([])
  const navigate = useNavigate()
  const items = [
    {
        key:'/groups/Fast%20Food',
        label:'Fast Food',
    },
    {
        key:'/groups/Fat%20Control',
        label:'Fat Control'
    },
    {
        key:'/groups/Spicy%20Food',
        label: 'Spicy Food'
    },
    {
        key:'/groups/Noddles',
        label: 'Noddles'
    },
    {
        key:'/groups/Grilled',
        label: 'The Grilled'
    },
    {
        key:'/groups/Sweeties',
        label:'Sweeties'
    }
  ]  

  useEffect(()=>{
    let pos = pathname.lastIndexOf('/')
    let group = pathname.slice(pos+1)
    axios.get(`/recipes?group=${group}`).then(res=>{
        setRecipeList(res.data) 
    })
  },[pathname])

  const handleClick=(text)=>{
    navigate(text.key)
  }

  return (
    <Layout>
        <Sider>
            <Menu items={items} onClick={handleClick} defaultSelectedKeys={pathname}/>
        </Sider>
        <Content style={{margin:20}}>
            <DisplayView recipeList={recipeList}/>            
        </Content>
    </Layout>
  )
}
