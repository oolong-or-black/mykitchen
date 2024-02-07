import React, { useRef, useState, useEffect} from 'react'
import { Modal, Tabs, Form, Button, Input, message } from 'antd'
import { UserOutlined, FacebookOutlined, GoogleOutlined } from '@ant-design/icons'
import axios  from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {closeModal, showModal} from '../../redux/modalSwitchSlice'
import { userLogOn, avatarUrlUpdate } from '../../redux/logOnStatusSlice'
import './loginRequest.css'

export default function LoginRequest() {
  const logOnForm = useRef()
  const signUpForm = useRef()
  const [userList, setUserList] = useState([])
  const { isModalOpen } = useSelector(state=>state.modalSwitch) //state.+slice文件里的name，说白了就是到该slice文件里去找里面设置的state，不管state里面有几个对象，都可以用同名解构的方式来找到目标的状态值
  const dispatch = useDispatch()

  // get the users data from json-server when the component is mounted
  useEffect(()=>{
    axios.get('/users').then(res=>{
      setUserList(res.data)
    })
  },[])

  // logIn is the API of logOnForm's onFinish   
  const logIn = (values)=>{
    axios.get(`/users?email=${values.email}&password=${values.password}`).then(res=>{
      if(res.data.length === 0){
        message.info({
          content:'email address or password does not matched',
          style:{marginTop: '250px'}
        })
      } else {
        localStorage.setItem('token',JSON.stringify(res.data[0]))
        dispatch(closeModal())
        dispatch(userLogOn())
        dispatch(avatarUrlUpdate())
      }
    })
    logOnForm.current.resetFields()
  }

  // the child component of "LOG IN" in the Tabs 
  const LogOnTab = function(){    
    return (
      <Form name='LOG IN' className='logOrSign' ref={logOnForm} onFinish={logIn}>
        <Button htmlType="submit" style={{backgroundColor:'#4483d5', color:'white'}} block={true} onClick={()=>dispatch(closeModal())} icon={<FacebookOutlined />}>Continue with Facebook</Button>
        <Button htmlType="submit" style={{backgroundColor:'#e0412f', color:'white', margin:'12px 0'}} block={true} onClick={()=>dispatch(closeModal())} icon={<GoogleOutlined />}>Continue with Google</Button>
        <div className='or-with-line'><b>OR</b><div className='or-line'></div></div>
        <Form.Item name='email'>
            <Input placeholder='Email Address' type='email'/>
        </Form.Item>
        <Form.Item name='password'>
            <Input placeholder='Password' type='password'/>
        </Form.Item>
        <Button type='primary' htmlType="submit" block={true} >LOG IN</Button>
        <p style={{color:'#1677ff', marginTop:'12px', textAlign:'center' }}> Forgot your password?</p>
      </Form>   
    )  
  }

  // when a new user is signed up, check if the intended username has been occupied or not
  const checkUsername= (_, value)=>{
    if (userList.map(item=>item.username).includes(value)){
      return Promise.reject(new Error('This username has already existed!'))
    }
    return Promise.resolve()
  }

  // when a new user is signed up, check if the email address has been registered or not
  const checkEmailAddress= (_, value)=>{
    if (userList.map(item=>item.email).includes(value)){
      return Promise.reject(new Error('This email address has already been registered!'))
    }
    return Promise.resolve()
  }

  // signUp is the API of signUpForm's onFinish 
  const signUp = ()=>{
    signUpForm.current.validateFields().then(value=>{
      dispatch(closeModal())  
      localStorage.setItem('token', JSON.stringify(value))
      axios.post('/users', {
        ...value
      }).then(res=>{
          setUserList([
            ...userList, 
            {...res.data}
          ])
        }) 
      dispatch(userLogOn())  
      })   
    }

  // the child component of 'SIGN UP' in the Tabs
  const SignUpTab = function(){
    return <div>
    <h4> Sign up to save or create recipes!</h4>
    <Form name='SIGN UP' className='logOrSign' ref={signUpForm} onFinish={signUp}>      
      <Form.Item name='username' rules={[{required: true},{validator: checkUsername}]}>
          <Input placeholder='Username *' />
      </Form.Item>
      <Form.Item name='email' rules={[{required: true},{validator: checkEmailAddress}]}>
          <Input placeholder='Email Address *' />
      </Form.Item>
      <Form.Item name='password' rules={[{required: true}]}>
          <Input placeholder='Password *' type='password'/>
      </Form.Item>
      {/* <Form.Item name='password'>
          <Input placeholder='Retype Password *' />
      </Form.Item> */}
      <Button type='primary' htmlType="submit" block={true}>Sign UP</Button>
    </Form>   
  </div>
  }  

  const tabsItems = [
    {
      key: '1',
      label: 'LOG IN',      
      children: <LogOnTab/>
    },
    {
      key: '2',
      label: 'SIGN UP',
      children: <SignUpTab/>
    }
  ]  

  return (
    <>
      <div className='loginRequest'>
        <span className='clickSpan' onClick={()=>dispatch(showModal())}>Log In</span>
        <span>|</span>
        <span className='clickSpan' onClick={()=>dispatch(showModal())}>Sign Up</span>
        <span><UserOutlined className='user' /></span>
      </div>
      <Modal title="MyKitchen" footer={null} open={isModalOpen} onCancel={()=>dispatch(closeModal())}>
        <Tabs
          centered
          items={tabsItems}
        />
      </Modal>    
    </>
  )
}