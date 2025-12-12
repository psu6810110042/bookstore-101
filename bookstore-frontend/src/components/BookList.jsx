import { Flex, Table, Button, Space, Tag, Image, Popconfirm } from "antd";
const URL = import.meta.env.VITE_APP_URL;

export default function BookList(props) {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <Tag color={stock >= 50 ? "green" : "volcano"}>{stock}</Tag>
      ),
    },
    {
      title: "Cover",
      key: "coverURL",
      dataIndex: "coverUrl",
      render: (text) => (
        <Image src={`${import.meta.env.VITE_APP_IMAGE_URL}/${text}`} height={100} />
      ),
    },
    {
      title: "Category",
      key: "categoryName",
      dataIndex: ["category", "name"],
      render: (text) => (
        <Tag color="blue" key={text}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Likes",
      dataIndex: "likeCount",
      key: "likeCount",
    },
    {
      title: "Action",
      key: "action",
      render: (_, book) => (
        <Space size="middle">
          <Button type="primary" onClick={() => props.onLiked(book.id)}>
            Like
          </Button>
          <Button type="default" onClick={() => props.onEdit(book)}>Edit</Button>
          <Popconfirm title="Are you sure you want to delete this book?" onConfirm={() => props.onDeleted(book.id)}>
            <Button danger type="dashed">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={props.data}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
}
