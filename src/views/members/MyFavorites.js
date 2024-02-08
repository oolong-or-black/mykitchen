import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function MyFavorites() {
  const navigate = useNavigate() 
  const [ recipeList, setRecipeList ] = useState([]) 
  const [ categoryList, setCategoryList ] = useState([])
  const [ groupList, setGroupList ] = useState([])
  const { loggedUser } = useSelector(state=>state.logOnStatus)

  useEffect(()=>{
    axios.get('/recipes').then(res=>{
        let list = res.data.filter(item=>item.favoredBy.includes(loggedUser.username))
        setRecipeList(list)
    })
  },[loggedUser])

  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setCategoryList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get('/groups').then(res=>{
      setGroupList(res.data)
    })
  },[])

  const columns = [
    {
      title: 'Title',
      key: 'title',
      width: 650,
      render: data=>
        <span style={{cursor:'pointer'}} onClick={()=>navigate(`/mykitchen/members/myfavorites/view/${data.id}`)} >
            {data.title}
        </span>
    },
    {
      title:'Author',
      width:200,
      render: data=><span>{data.author}</span>
    },
    {
        title:'Category',
        dataIndex:'category',
        width: 200,
        filters: categoryList.map(data=>({
          text: data.title,
          value: data.title
        })),
        onFilter:(value,item)=>item.category===value
      },
      {
        title:'Group',
        dataIndex:'group',
        width:200,
        filters: groupList.map(data=>({
          text:data.title,
          value:data.title
        })),
        onFilter:(value,item)=>item.group===value
      },
      {
        title:''
      }
  ]  

  return (
    <div>
    <h3 style={{margin:15}}> List of my favorite recipes</h3>

    <Table
      columns={columns}
      dataSource={recipeList}
      rowKey={item=>item.id}
      pagination={10}
    />      
  </div>
  )
}
