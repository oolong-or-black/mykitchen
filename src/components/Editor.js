import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import Compressor from 'compressorjs'
import { storage } from '../config/firebase'

// define image compression method
function fileCompress (file) {
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

// define uploading image methods in react-quill
function imageHandler () {    
    const input = document.createElement('input');        
    input.setAttribute('type', 'file');  
    input.setAttribute('accept', 'image/*');  
    let cursorPosition = this.quill.getSelection().index 
    input.click(); 
    input.onchange = async () => {  
        var file = input.files[0] 
        var imageUrl          
        const compressSate = await fileCompress(file)
        if(compressSate.success){
            var uploadImage = compressSate.file
            const storageRef = ref(storage,`/Images/${uploadImage.name}`)
            const uploadTask = uploadBytesResumable(storageRef, uploadImage)   
            uploadTask.on(
                'state_changed',  
                async() => {
                    await getDownloadURL(uploadTask.snapshot.ref).then( (url) => {
                       imageUrl=url
                    })                  
                    this.quill.insertEmbed(cursorPosition, 'image', imageUrl)
                    this.quill.getSelection(cursorPosition+1) 
                }                
            )             
        }        
    }   
}


export default class Editor extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (html){
        this.props.onChange(html)
    }     


  render() {
    return (
      <div className="text-editor">
        <ReactQuill
          onChange={this.handleChange}         
          modules={Editor.modules}
          theme={"snow"}
          value={this.props.content}
        />
      </div>
    )
  }
}

Editor.modules = {
    toolbar: {
        container:[
            [{ header: [1,2,3,4,5,6,false] }],
            [{ font: [],size:['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline','strike','clean'],
            // ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}, { align: [] }],
            [{ color:[] }, { background: []}],
            [{ script:  "sub" }, { script:  "super" }],
            ['link', 'image']
        ],
        handlers: {
            'image':imageHandler
        }   
    }
}
