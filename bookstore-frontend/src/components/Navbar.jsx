import { Button, Space, Popconfirm } from "antd";
import { BookOutlined } from '@ant-design/icons';
import Clock from "./Clock";

export default function HeaderBar({ onLogout }) {

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            marginBottom: '20px',
            borderBottom: '1px solid #eee'
        }}>
            <Space>
                <BookOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <h2 style={{ margin: 0, color: '#1890ff' }}>Book Inventory Dashboard</h2>
            </Space>
            
            <Space size="large">
                <Clock />
                <Popconfirm 
                    title="Are you sure you want to logout?" 
                    onConfirm={onLogout}
                >
                    <Button type="primary" danger>
                        Logout
                    </Button>
                </Popconfirm>
            </Space>
        </div>
    );
}