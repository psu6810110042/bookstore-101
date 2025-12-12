import {Form, Modal, Select, Input, InputNumber, Image} from "antd"
import { useEffect, useRef } from "react"

export default function EditBook(props) {
  const formRef = useRef(null)

  useEffect(() => {
    if(props.book) {
      formRef.current.setFieldsValue(props.book)
    }
  }, [props.book])
  
  return(
    <Modal 
      title="Edit Book" 
      okText="Save" 
      cancelText="Cancel"
      open={props.open} 
      onCancel={props.onCancel} 
      onOk={() => {
        formRef.current.validateFields().then(values => {
          props.onSave({...props.book, ...values})
        })
      }}>
      <Form 
        ref={formRef}>
        <Form.Item>
          <Image src={`${import.meta.env.VITE_APP_IMAGE_URL}/${props.book?.coverUrl}`} height={100} />
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder={props.book?.title} />
        </Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input placeholder={props.book?.author}/>
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber placeholder={props.book?.price}/>
        </Form.Item>
        <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
          <InputNumber placeholder={props.book?.stock}/>
        </Form.Item>
        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
          <Select allowClear style={{width:"150px"}} options={props.categories}/>
        </Form.Item>
      </Form>
    </Modal>
  )
}