import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DisplayView from '../../components/displays/DisplayView'
import { Layout, Menu } from 'antd'

const { Sider, Content } = Layout
export default function Courses() {
  const [ categoryList, setCategoryList ] = useState([])
  const [ recipeList, setRecipeList ] = useState([])
   useEffect(()=>{
     axios.get('/collections?_embed=categories').then(res=>{
       setCategoryList(res.data)
      })
    },[])
    
    const items = categoryList.map(item=>
      ({
        key: item.id,
        label: item.title,
        children: item.categories.map(data=>(
          {
            key: data.title,
            label: data.title,
          }
        ))
      })
    )   

    const handleClick = (e)=>{
      axios.get(`/recipes?category=${e.key}`).then(res=>{
        setRecipeList(res.data)
    })
    }
  
  return (
    <Layout>
      <Sider>
        <Menu items={items}   style={{width: 156 }}  mode="inline" onClick={handleClick}/> 
      </Sider>
      <Content>
        <DisplayView recipeList={recipeList}/>
      </Content>
    </Layout>  
  )
}
