import React, { useState, useRef, useEffect } from 'react'
import { Button, Form, Input, List, Avatar } from 'antd'
import { Comment } from '@ant-design/compatible'
import moment from 'moment'
import { useSelector } from 'react-redux'
import axios from 'axios'

const { TextArea } = Input;
export default function Comments(props) {
    const [comments, setComments] = useState([])
    const { loggedUser} = useSelector(state=>state.logOnStatus)
    const commentsForm = useRef()

    useEffect(()=>{
        axios.get(`/recipes/${props.id}`).then(res=>{
            setComments(res.data.comments)
        })
    },[props])

    const CommentList = ({ comments }) => (
        <List
          dataSource={comments}
          header={`${comments.length} ${comments.length > 1 ? 'comments' : 'comment'}`}
          itemLayout="horizontal"
          renderItem={(props) => <Comment {...props} />}
        />
      )
 

    const onSubmit = () => {
        let newComment 
        commentsForm.current.validateFields().then(res=>{
            newComment = {
                author: loggedUser.username,
                avatar: loggedUser.image,
                content: res.content,
                datetime: moment().format('DD-MM-YYYY')
            }            
            axios.patch(`/recipes/${props.id}`, {
                "comments": [...comments,newComment]
            })
            commentsForm.current.resetFields()
            setComments([ ...comments, newComment])
        })        
    }
    
    return (
    <>
        { comments.length > 0 && <CommentList comments={comments} />}
        { loggedUser && 
            <Form ref={commentsForm}>
                <Form.Item label={<Avatar src={loggedUser.image} alt={loggedUser.username} />} name='content'>                
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" onClick={onSubmit} type="primary">
                        Add Comment
                    </Button>
                </Form.Item>            
            </Form>
        }
    </>
    )
}