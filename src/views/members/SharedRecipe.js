import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Button, Modal, Table, Space} from 'antd'
import axios from 'axios'
import { ExclamationCircleOutlined }from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const {confirm} = Modal
export default function SharedRecipe() {
  const [recipeList, setRecipeList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [groupList, setGroupList] = useState([])
  const {loggedUser:{username}} = useSelector(state=>state.logOnStatus)
  const navigate=useNavigate()
  
  useEffect(()=>{
    axios.get(`/recipes?author=${username}&publishState=1`).then(res=>{
      setRecipeList(res.data)
    })
  },[username])

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
  
  const handleDel = (id)=>{
    confirm({
      title:'Do you really want to delete this recipe?',
      icon:<ExclamationCircleOutlined/>,
      onCancel(){},
      onOk(){
        axios.delete(`/recipes/${id}`)
        setRecipeList(recipeList.filter(item=>item.id!==id))
      }
    })
  }

  const columns = [
    {
      title:'Title',
      key:'title',
      render: data=>
        <span style={{cursor:'pointer'}} onClick={()=>navigate(`/members/mycontribution/view/${data.id}`)} >
          {data.title}
        </span>
    },
    {
      title:'Category',
      dataIndex:'category',
      filters: categoryList.map(data=>({
        text: data.title,
        value: data.title
      })),
      onFilter:(value,item)=>item.category===value
    },
    {
      title:'Group',
      dataIndex:'group',
      filters: groupList.map(data=>({
        text:data.title,
        value:data.title
      })),
      onFilter:(value,item)=>item.group===value
    },
    {
      title:'Action',
      key:'action',
      render: item=><Space>
        <Button type='primary' onClick={()=>navigate(`/members/mycontribution/edit/${item.id}`)}>Edit</Button>
        <Button danger onClick={()=>handleDel(item.id)}>Delete</Button>
      </Space>
    }
  ]
  return (
    <div>
      <h3 style={{margin:15}}> List of my published recipes</h3>

      <Table
        columns={columns}
        dataSource={recipeList}
        rowKey={item=>item.id}
        pagination={10}
      />      
    </div>
  )
}
