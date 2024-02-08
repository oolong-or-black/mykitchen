import React from 'react'
import { UserOutlined, DatabaseOutlined, HeartOutlined } from '@ant-design/icons'
import { closeModal, showModal } from '../../redux/modalSwitchSlice'
import { userLogOff } from '../../redux/logOnStatusSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, List } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'

export default function LoggedUser() {
  const dispatch = useDispatch()
  const { isUserModalOpen } = useSelector(state=>state.modalSwitch)
  const { loggedUser, isAvatarUpdated} = useSelector(state=>state.logOnStatus)
  const navigate = useNavigate()
  const [avatarURL, setAvatarUrl] = useState(loggedUser.image)

  useEffect(()=>{
    setAvatarUrl(JSON.parse(localStorage.getItem('token')).image)
  },[isAvatarUpdated])

  const data = [
    {
      icon: <UserOutlined />,
      description: 'MY PROFILE',
      path:'/mykitchen/members/myprofile'
    },
    {
      icon: <DatabaseOutlined /> ,
      description: 'MY CONTRIBUTION',
      path:'/mykitchen/members/mycontribution/shared'
    },
    {
      icon: <HeartOutlined />,
      description: 'MY FAVORITES',
      path:'/mykitchen/members/myfavorites'
    }
  ]

  const logOut = ()=>{
    dispatch(closeModal())
    localStorage.removeItem('token')
    dispatch(userLogOff())
    navigate('/mykitchen/home')
  }

  const UserImage = (
   <img src={avatarURL} style={{width:30, height:30, borderRadius:'50%'}} alt='user'/>
  )

  return (
    <div className='loggedUser'>
      <div>
      <span className='username' onClick={()=>dispatch(showModal())}> Hi, {loggedUser.username}</span>
      { avatarURL? UserImage : <UserOutlined style={{background:'white'}}/> }
      </div>
      <div>
      <Modal 
        open={isUserModalOpen}
        footer= {null}
        className='userModal'
        onCancel={()=>dispatch(closeModal())}
      >
        <List
          size="small"          
          footer={<div style={{cursor: 'pointer'}} onClick={()=>logOut()}>LOG OUT</div>}
          bordered
          dataSource={data}
          split={null}
          renderItem={(item) => <List.Item>          
            <span style={{marginRight:20}}>{item.icon}</span><a href={item.path}>{item.description}</a>
          </List.Item>}
        />
      </Modal></div>
    </div>
  )
}
