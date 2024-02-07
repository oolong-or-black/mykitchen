import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal } from 'antd'
import { ExclamationCircleOutlined }from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const { confirm }=Modal
export default function Drafts() {
  const { loggedUser:{username} } =useSelector(state=>state.logOnStatus)
  const navigate = useNavigate()
  const [ recipeList, setRecipeList ] = useState([])

  useEffect(()=>{
    axios.get(`/recipes?author=${username}&publishState=0`).then(res=>{
      setRecipeList(res.data)
    })
  },[username])

  const handleDel = (id)=>{
    confirm({
      title: 'Do you really want to delete this recipe?',
      icon:<ExclamationCircleOutlined/>,
      onCancel(){},
      onOk(){
        axios.delete(`/recipes/${id}`)
        setRecipeList(recipeList.filter(item=>item.id!==id))
      }
    })
  }
  const handlePublish = (id)=>{
    axios.patch(`/recipes/${id}`,{
      publishState:1,
      publishTime:Date.now()
    })
    navigate('/members/mycontribution/shared')
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
      key:'category',
      render:item=><span>{item.title}</span>
    },
    {
      title:'Key Words',
      dataIndex:'keywords',
      key:'keywords'
    },
    {
      title:'Actions',
      key:'action',
      render:(item)=>(<Space size='middle'>
        <Button type='default' onClick={()=>navigate(`/members/mycontribution/edit/${item.id}`)}>Edit</Button>
        <Button danger onClick={()=>handleDel(item.id)}>Delete</Button>
        <Button type='primary' onClick={()=>handlePublish(item.id)}>Publish</Button>
      </Space>)
    }
  ]

 
  return (<>
    <h3 style={{margin:15}}> Drafts of my recipes</h3>
    <Table  
      columns={columns} 
      dataSource={recipeList}
      rowKey={item=>item.id}
    />
  </>)
}
