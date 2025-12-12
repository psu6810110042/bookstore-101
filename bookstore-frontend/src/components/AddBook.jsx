import { Button, Form, Select, Input, InputNumber, Modal } from 'antd';
import { useRef, useEffect } from 'react'; // Import useRef and useEffect

export default function AddBook(props) {
    // Use a ref to control the Form instance inside the Modal
    const formRef = useRef(null);

    // Ensure the form fields are reset when the modal opens/closes
    useEffect(() => {
        if (!props.open) {
            formRef.current?.resetFields();
        }
    }, [props.open]);

    const handleOk = () => {
        formRef.current.validateFields().then(values => {
            props.onSave(values); // Calls handleAddBook in parent
            formRef.current.resetFields(); // Reset form fields after successful submission
        }).catch(info => {
            console.log('Validation Failed:', info);
        });
    };

    return (
        <Modal
            title="Add New Book"
            okText="Add Book"
            cancelText="Cancel"
            open={props.open}
            onCancel={props.onCancel}
            onOk={handleOk} // Use the new handler
            destroyOnHidden={true} // Ensures clean state when modal closes
        >
            {/* Reintroduce the Form structure here */}
            <Form 
                ref={formRef} 
                layout="vertical" // Stack labels nicely inside the modal
                initialValues={{ // Set default values if needed
                    stock: 1, 
                    price: 10.00
                }}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Please enter book title" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter price" }]}
                >
                    <InputNumber prefix="$" style={{ width: '100%' }} min={0.01} step={0.01} />
                </Form.Item>

                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[{ required: true, message: "Please enter stock quantity" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label="Category"
                    rules={[{ required: true, message: "Please select a category" }]}
                >
                    <Select allowClear options={props.categories} />
                </Form.Item>
                
                {/* Note: Other fields like author/description can be added here as needed */}

            </Form>
        </Modal>
    )
}