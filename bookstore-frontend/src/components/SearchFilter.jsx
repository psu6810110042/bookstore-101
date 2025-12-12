import { Button, Space, Input, Select } from "antd";

export default function SearchFilter({
    filterTitle,
    onTitleChange,
    filterCategory,
    onCategoryChange,
    filterStock,
    onStockChange,
    onClearFilters,
    categories,
}) {
    const stockOptions = [
        { label: 'All Stock', value: null },
        { label: 'Low Stock (< 50)', value: 50 },
        { label: 'Critical Stock (< 10)', value: 10 },
    ];

    return (
        <div style={{ padding: "0 20px 20px 20px", borderBottom: '1px solid #eee' }}>
            <Space size="middle" style={{ width: '100%', justifyContent: 'flex-start' }}>

                <Input
                    placeholder="Filter by Title"
                    style={{ width: 250 }}
                    value={filterTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                />

                <Select
                    placeholder="Filter by Category"
                    style={{ width: 200 }}
                    allowClear
                    value={filterCategory}
                    onChange={onCategoryChange}
                    options={categories}
                />

                <Select
                    placeholder="Stock Status"
                    style={{ width: 150 }}
                    allowClear
                    value={filterStock}
                    onChange={onStockChange}
                    options={stockOptions}
                />

                <Button onClick={onClearFilters}>
                    Clear Filters
                </Button>

            </Space>
        </div>
    );
}