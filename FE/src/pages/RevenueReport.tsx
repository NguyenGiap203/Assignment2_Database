// pages/RevenueReport.tsx

import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Table, { Column } from '../components/ui/Table';
import { useFetch } from '../hooks/useFetch';
import { formatCurrency } from '../utils/format';
import { BarChart3 } from 'lucide-react';

interface RevenueData {
    Month: number;
    Year: number;
    TotalRevenue: number;
}

const RevenueReport: React.FC = () => {
    // Giả định gọi API tương đương với Stored Procedure: EXEC GetMonthlyRevenue 2024
    const { data: reportData, isLoading, error } = useFetch<RevenueData[]>('/api/reports/monthly-revenue?year=2024'); 

    const reportColumns: Column<RevenueData>[] = [
        { key: 'Month', header: 'Tháng' },
        { key: 'Year', header: 'Năm' },
        { 
            key: 'TotalRevenue', 
            header: 'Doanh thu (VNĐ)',
            render: (item) => <span className="font-semibold text-green-700">{formatCurrency(item.TotalRevenue)}</span>,
            sortable: true
        },
        // Thêm cột khác nếu Stored Procedure trả về
    ];

    const totalRevenue = reportData?.reduce((sum, item) => sum + item.TotalRevenue, 0) || 0;

    return (
        <MainLayout>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <BarChart3 className="w-7 h-7" />
                <span>Báo cáo Doanh thu hàng tháng (2024)</span>
            </h2>
            
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
                <p className="text-lg font-medium text-blue-800">
                    Tổng Doanh thu năm 2024: <span className="text-2xl font-bold">{formatCurrency(totalRevenue)}</span>
                </p>
            </div>

            {isLoading && <div className="p-6 text-center text-blue-600">Đang gọi Stored Procedure...</div>}
            {error && <div className="p-6 text-center text-red-600">Lỗi: {error}</div>}

            {!isLoading && reportData && (
                <Table<RevenueData> 
                    data={reportData}
                    columns={reportColumns as Column<RevenueData>[]}
                />
            )}
        </MainLayout>
    );
};

export default RevenueReport;