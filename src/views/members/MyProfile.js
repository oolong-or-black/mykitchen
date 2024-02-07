import axios from 'axios'
import React from 'react'
import { useSelector} from 'react-redux'
import Compressor from 'compressorjs'
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import { storage } from '../../config/firebase'
import { useState } from 'react'
import {useDispatch} from 'react-redux'
import { avatarUrlUpdate } from '../../redux/logOnStatusSlice'

export default function MyProfile() {
  const {loggedUser} = useSelector(state=>state.logOnStatus)
  const [ avatarUrl, setAvatarUrl]=useState(loggedUser.image)
  const dispatch = useDispatch()

  const fileCompress = (file)=>{
    return new Promise((resolve, reject)=>{
        new Compressor(file,{
            file:'File',
            quality: 0.5,
            maxWidth:250,
            maxHeight:250,
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

  const AvatarUpload= ()=>{
    const input = document.createElement('input');        
      input.setAttribute('type', 'file');  
      input.setAttribute('accept', 'image/*');  
      input.click(); 
      input.onchange = async () => {  
        var file = input.files[0] 
        const compressSate = await fileCompress(file)
        if(compressSate.success){
          var uploadAvatar = compressSate.file
          const storageRef = ref(storage,`/Avatars/${uploadAvatar.name}`)
          const uploadTask = uploadBytesResumable(storageRef, uploadAvatar)   
          uploadTask.on(
            'state_changed',  
            async() => {
              await getDownloadURL(uploadTask.snapshot.ref).then( (url) => {
                setAvatarUrl(url)
                axios.patch(`/users/${loggedUser.id}`,{
                  "image": url
                }).then(res=>{
                    localStorage.removeItem('token')
                    localStorage.setItem('token', JSON.stringify(res.data))
                    dispatch(avatarUrlUpdate())
                  })
              })
            }    
          )
        }    
      }  
  }
  
  const AvatarExisted = (
    <div style={{width:150, height:150, border:'1px solid white', borderRadius:'50%', overflow:'hidden', display:'inline-block'}}>          
      <img style={{width:'150%', margin:'-10px 0 0 -40px'}} alt='avatar' src={avatarUrl} />
    </div>)

  const AvatarNotExisted = (
    <div style={{display:'inline-block', border:'1px dashed black', width:150, height:150, textAlign:'center', fontSize:40}}>
      <br/>+
    </div>
  )

  return (
    <div>
      <h3 style={{margin:30}}>My Profile</h3>
      <div style={{margin:30}}>
        <span style={{marginRight:30}}>Username:</span>
        <span>{loggedUser.username}</span>
      </div>
      <div style={{margin:30}}>
        <span style={{marginRight:30}}>Email:</span>
        <span>{loggedUser.email}</span>
      </div>
      <div style={{margin:30}}>
        <span style={{marginRight:30}}>Image:</span> 
        { avatarUrl? AvatarExisted: AvatarNotExisted}         
        <button style={{margin:'0 10px 0 50px'}} onClick={AvatarUpload}> Add </button> 
        <button onClick={AvatarUpload}> Edit </button>
      </div>      
    </div>
  )
}
