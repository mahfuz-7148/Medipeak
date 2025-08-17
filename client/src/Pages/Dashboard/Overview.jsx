import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { 
  TeamOutlined, 
  MedicineBoxOutlined, 
  CalendarOutlined,
  FileDoneOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth.jsx';
import useAxios from '../../Hooks/useAxios.jsx';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const { Title: AntTitle, Text } = Typography;

const StatCard = ({ title, value, icon, color, change }) => (
  <Card style={{ 
    borderRadius: '12px', 
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    height: '100%'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Text type="secondary" style={{ fontSize: '14px' }}>{title}</Text>
        <AntTitle level={3} style={{ margin: '8px 0 0 0' }}>{value}</AntTitle>
        {change && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <ArrowUpOutlined style={{ color: '#52c41a', marginRight: '4px' }} />
            <Text type="success">{change}% from last month</Text>
          </div>
        )}
      </div>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: `${color}10`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: color
      }}>
        {icon}
      </div>
    </div>
  </Card>
);

const Overview = () => {
  const { saveUser } = useAuth();
  const axios = useAxios();

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await axios.get('/dashboard/stats');
      return res.data;
    }
  });

  // Sample data for charts (will be replaced with real data)
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Participants',
        data: [65, 59, 80, 81, 56, 55, 40, 75],
        backgroundColor: 'rgba(24, 144, 255, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const categoryData = {
    labels: ['General Health', 'Dental', 'Eye Care', 'Pediatric', 'Women\'s Health'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#1890ff',  // Blue
          '#36cfc9',  // Teal
          '#722ed1',  // Purple
          '#faad14',  // Gold
          '#ff4d4f'   // Red
        ],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Patient Registrations',
        data: [15, 22, 18, 30],
        borderColor: '#722ed1',
        backgroundColor: 'rgba(114, 46, 209, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };


  return (
    <div style={{ padding: '24px' }}>
      <div className="mb-6">
        <AntTitle level={3} style={{ margin: 0 }}>Welcome back, {saveUser?.displayName || 'User'}</AntTitle>
        <Text type="secondary">Here's what's happening with your medical camps today</Text>
      </div>
      
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Total Patients" 
            value={dashboardData?.totalPatients || '1,245'} 
            icon={<UserOutlined />} 
            color="#1890ff"
            change={12.5}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Upcoming Camps" 
            value={dashboardData?.upcomingCamps || '8'} 
            icon={<CalendarOutlined />} 
            color="#36cfc9"
            change={5.2}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Medical Staff" 
            value={dashboardData?.medicalStaff || '42'} 
            icon={<TeamOutlined />} 
            color="#722ed1"
            change={8.3}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Completed Camps" 
            value={dashboardData?.completedCamps || '36'} 
            icon={<FileDoneOutlined />} 
            color="#52c41a"
            change={15.7}
          />
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title="Monthly Patient Registration" 
            style={{ borderRadius: '12px', height: '100%' }}
            bodyStyle={{ padding: '16px' }}
          >
            <Bar options={options} data={monthlyData} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="Service Categories" 
            style={{ borderRadius: '12px', height: '100%' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ height: '300px' }}>
              <Pie data={categoryData} options={pieOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            title="Weekly Patient Registration Trend" 
            style={{ borderRadius: '12px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <Line options={options} data={lineData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
