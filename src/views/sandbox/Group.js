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
        key:'/mykitchen/groups/Fast%20Food',
        label:'Fast Food',
    },
    {
        key:'/mykitchen/groups/Fat%20Control',
        label:'Fat Control'
    },
    {
        key:'/mykitchen/groups/Spicy%20Food',
        label: 'Spicy Food'
    },
    {
        key:'/mykitchen/groups/Noddles',
        label: 'Noddles'
    },
    {
        key:'/mykitchen/groups/Grilled',
        label: 'The Grilled'
    },
    {
        key:'/mykitchen/groups/Sweeties',
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
