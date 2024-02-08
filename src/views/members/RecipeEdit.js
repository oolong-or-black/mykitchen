import React, { useEffect, useState , useRef} from 'react'
import Editor from '../../components/Editor'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Form, Input, Button, TreeSelect, Select,Space } from 'antd'
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import Compressor from 'compressorjs'
import { storage } from '../../config/firebase'

const { TextArea } = Input
export default function RecipeEdit() {
  const {id} = useParams()
  const [categoryList, setCategoryList]= useState([])
  const [groupList, setGroupList]=useState([])
  const [content, setContent] = useState()
  const [mainImage, setMainImage]=useState()
  const editRecipe = useRef()
  const navigate = useNavigate()

  useEffect(()=>{
    axios.get(`/recipes/${id}`).then(res=>{
      console.log(res.data)
      editRecipe.current.setFieldsValue({
        title:res.data.title,
        category:res.data.category,
        group:res.data.group,
        keywords:res.data.keywords,
        ingredients:res.data.ingredients
      })
      setContent(res.data.procedure)
      setMainImage(res.data.mainImage)
    })
  },[id])

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

  // confirm the edition and save to the draft or publish
  const handleSave = (publishState)=>{
    editRecipe.current.validateFields().then(res=>{
      axios.patch(`/recipes/${id}`,{
        title:res.title,
        'categoryId':res.categoryId,
        'group':res.group,
        'keywords':res.keywords,
        'ingredients':res.ingredients,
        'mainImage': mainImage,
        'procedure':content,
        'createTime': Date.now(),
        'publishState':publishState,
        'publishTime': publishState===1? Date.now():null,
        'rates':null,
        'comments':[]   
      }).then(res=>{
        navigate(publishState? '/mykitchen/members/mycontribution/shared':'/members/mycontribution/draft')
      })
    }).catch(err=>{
      console.log(err)
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
    <div>RecipeEdit
      <Form id='editRecipe' ref={editRecipe} labelCol={{span: 4}} style={{margin:20, padding:20}}>
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
            <div style={{width:320}}>
              {mainImage? mainImageExisted : mainImageNotExisted}
            </div>
          </Form.Item>
          <Form.Item>
            <h4>Procedure:</h4>
            <Editor onChange={(html)=>setContent(html)} content={content}/>
          </Form.Item>
          <Form.Item style={{textAlign:'right'}}>
            <Button type='primary' onClick={()=>window.history.back()}>Cancel</Button>
            <Button type='primary' style={{margin:'0 20px'}} onClick={()=>handleSave(0)}>Save</Button>
            <Button type='primary' onClick={()=>handleSave(1)}>Publish</Button>
          </Form.Item>
        </Form>
    </div>
  )
}
