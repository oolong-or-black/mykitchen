import React,{useEffect, useState, useRef} from 'react'
import axios from 'axios'
import Editor from '../../components/Editor'
import { Form, TreeSelect, Select, Input, Button,Space } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import Compressor from 'compressorjs'
import { storage } from '../../config/firebase'

const { TextArea } = Input
export default function CreateRecipe() {
  const [content, setContent] = useState('')
  const [categoryList, setCategoryList]=useState([])
  const [groupList, setGroupList]=useState([])
  const [mainImage, setMainImage]=useState()
  const addRecipe = useRef()
  const {loggedUser} = useSelector(state=>state.logOnStatus)
  const navigate = useNavigate()

  useEffect(()=>{
    axios.get('/collections?_embed=categories').then(res=>{
      setCategoryList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get('/groups').then(res=>{
      setGroupList(res.data)
    })
  },[])

  // about the restriction of uploading images 
  const fileCompress = (file)=> {
    return new Promise((resolve, reject)=>{
      new Compressor(file,{
        file:'File',
        quality: 0.5,
        maxWidth:320,
        maxHeight:320,
        success(file){
            return resolve({
                success:true,
                file: file
            })
        },
        error(err){
            return resolve({
                success:false,
                massage:err.massage
            })
        }
      })
    })
  }

  // upload the images to the defined firebase storage
  const handleImageUpload = ()=>{
    const input = document.createElement('input');        
    input.setAttribute('type', 'file');  
    input.setAttribute('accept', 'image/*');  
    input.click(); 
    input.onchange = async () => {  
      var file = input.files[0] 
      const compressSate = await fileCompress(file)
      if(compressSate.success){
        var uploadImage = compressSate.file
        const storageRef = ref(storage,`/Images/${uploadImage.name}`)
        const uploadTask = uploadBytesResumable(storageRef, uploadImage)   
        uploadTask.on(
          'state_changed',  
          async() => {
            await getDownloadURL(uploadTask.snapshot.ref).then( (url) => {
              setMainImage(url)
            })                  
          }                
        )             
      }        
    }   
  } 

  // save the new-created recipe to draft or publish
  const handleSave = (publishState)=>{
    addRecipe.current.validateFields().then(res=>{
      axios.post('/recipes',{
        'title':res.title,
        'author':loggedUser.username,
        'category':res.category,
        'group':res.group,
        'keywords':res.keywords,
        'ingredients':res.ingredients,
        "mainImage":mainImage,
        'procedure':content,
        'createTime': Date.now(),
        'publishState':publishState,
        'publishTime': publishState===1? Date.now():null,
        "favoredBy":[],
        'rates':null,
        'comments':[]      
      }).then(res=>{
        navigate(publishState? '/members/mycontribution/shared':'/members/mycontribution/draft')
      })
    }).catch(err=>{
      console.log(err)
    })
  }

  // about set up/change a main image for the recipe
  const mainImageExisted = (<Space>
    <img src={mainImage} alt="main"/>
    <Button type='primary' size='small' onClick={handleImageUpload}>Change</Button>
    <Button danger size='small' onClick={()=>setMainImage(null)}>Delete</Button>
  </Space>)

  const mainImageNotExisted = (
    <div>Click here <Button type='primary' size='small' onClick={handleImageUpload}>Add</Button> to add <br/> a main image for your course</div>
  )

  return (
    <div>
      <h3 style={{margin:20}}>CreateRecipe</h3>
      <Form id='newRecipe' ref={addRecipe} labelCol={{span: 4}} style={{margin:20, padding:20}}>
        <Form.Item
          label="Name of recipe:"
          name='title'
          rules={[{required:true, message:'The recipe must have a title'}]}>
          <Input/>
        </Form.Item>
        <Form.Item
          label='Category'
          name='category'
          rules={[{required:true, message:'The recipe must select a category'}]}>
          <TreeSelect style={{width:'40%'}}
            treeDefaultExpandAll='true'
            treeData={categoryList.map(item=>({
              title:item.title, 
              value:item.title, 
              children:item.categories.map(data=>({title:data.title,value:data.title}))
            }))}
          />          
        </Form.Item>
        <Form.Item
          label='Group'
          name='group'>
          <Select style={{width:'40%'}}
            options={groupList.map(item=>({value:item.title, title:item.title}))}/>  
        </Form.Item>
        <Form.Item
          label='Key Words'
          name='keywords'>
          <Input/>
        </Form.Item>     
        <Form.Item
          label='Ingredients:'
          name='ingredients'>
          <TextArea autoSize/>
        </Form.Item>
        <Form.Item
          label='Mainimage:'
          name='image'>
          <div style={{width:520}}>
            {mainImage? mainImageExisted : mainImageNotExisted}
          </div>
        </Form.Item>
        <Form.Item>
          <h4>Procedure:</h4>
          <Editor onChange={(html)=>setContent(html)} content={content}/>
        </Form.Item>
        <Form.Item style={{textAlign:'right'}}>
        <Button type='primary' style={{marginRight:20}} onClick={()=>handleSave(0)}>Save</Button>
        <Button type='primary' onClick={()=>handleSave(1)}>Publish</Button>
        </Form.Item>
      </Form>            
    </div>
  )
}

