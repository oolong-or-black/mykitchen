import { Layout, Menu } from 'antd'
import React from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import MyProfile from '../members/MyProfile'
import CreateRecipe from '../members/CreateRecipe'
import Drafts from '../members/Drafts'
import SharedRecipe from '../members/SharedRecipe'
import RecipeEdit from '../members/RecipeEdit'
import RecipeView from '../../components/displays/RecipeView'
import MyFavorites from '../members/MyFavorites'
import { useSelector } from 'react-redux';

const { Sider, Content } = Layout
export default function Member() {
  const navigate = useNavigate()
  const { loggedUser } = useSelector(state=>state.logOnStatus)

  const items =[
    {
      key: '/mykitchen/members/myprofile',
      label: 'MY PROFILE'
    },
    {
      key: '/mykitchen/members/mycontribution',
      label: 'MY CONTRIBUTION',
      children:[
        {
          key: '/mykitchen/members/mycontribution/create',
          label: 'Create new recipe'
        },
        {
          key: '/mykitchen/members/mycontribution/draft',
          label: 'Drafts of my recipes'
        },
        {
          key: '/mykitchen/members/mycontribution/shared',
          label: 'Shared of my recipes'
        }
      ]
    },
    {
      key: '/mykitchen/members/myfavorites',
      label: 'MY FAVORITES'
    }
  ]
  
  return (
    <div>
      <div style={{display: loggedUser? 'none':'', font:'24px bold'}}>
        Please log on or sign up first to access member service !
      </div>

      <section style={{display:loggedUser? '':'none'}}>
        <Layout>
          <Sider>
            <Menu 
              items={items} 
              defaultSelectedKeys={ loggedUser? '/mykitchen/members/myprofile':''}
              onClick={(item)=>navigate(item.key)} 
              openKeys={'/mykitchen/members/mycontribution'}
              mode='inline'
            />
          </Sider>
          <Content style={{margin:20}}>
            <Routes>
              { loggedUser? <Route path='/' element={<MyProfile/>} />:''}
              <Route path='/myprofile' element={<MyProfile/>} />
              <Route path='/mycontribution/create' element={<CreateRecipe/>} />
              <Route path='/mycontribution/draft' element={<Drafts/>} />
              <Route path='/mycontribution/shared' element={<SharedRecipe/>} />
              <Route path='/mycontribution/view/:id' element={<RecipeView/>} />
              <Route path='/mycontribution/edit/:id' element={<RecipeEdit/>} />
              <Route path='/myfavorites' element={<MyFavorites/>} />
              <Route path='/myfavorites/view/:id' element={<RecipeView/>} />
            </Routes>
          </Content>
        </Layout>
      </section>
    </div>
  )
}
