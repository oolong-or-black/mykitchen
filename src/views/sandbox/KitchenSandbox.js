import React from 'react'
import { Layout } from 'antd'
import PageHeader from '../../components/PageHeader'
import IndexRouter from '../../router/IndexRouter'

const { Content } = Layout
export default function KitchenSandbox() {
  return (
    <Layout>
      <PageHeader/>
      <Content style={{margin:'30px', padding:'10px', width:'100%'}}>
        <IndexRouter/>
      </Content>      
    </Layout>
  )
}
