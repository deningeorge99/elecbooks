import React, { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage, FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import Card from '../ui/Card';
import { getDashboardStats } from '../../services/adminService';

const UsersIcon = FiUsers as React.ComponentType<{ className?: string, size?: number }>;
const ShoppingBagIcon = FiShoppingBag as React.ComponentType<{ className?: string, size?: number }>;
const DollarSignIcon = FiDollarSign as React.ComponentType<{ className?: string, size?: number }>;
const PackageIcon = FiPackage as React.ComponentType<{ className?: string, size?: number }>;
const TrendingUpIcon = FiTrendingUp as React.ComponentType<{ className?: string, size?: number }>;
const TrendingDownIcon = FiTrendingDown as React.ComponentType<{ className?: string, size?: number }>;
const ActivityIcon = FiActivity as React.ComponentType<{ className?: string, size?: number }>;

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  newOrdersThisMonth: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  topProducts: Array<{
    id: number;
    name: string;
    total_sold: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: number;
    user_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
}

const DashboardStatsComponent: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
    newOrdersThisMonth: 0,
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    topProducts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueChange = stats.revenueLastMonth > 0 
    ? ((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100 
    : 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard stats...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <UsersIcon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{stats.newUsersThisMonth} this month</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <PackageIcon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <ShoppingBagIcon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{stats.newOrdersThisMonth} this month</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <DollarSignIcon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center">
                {revenueChange >= 0 ? (
                  <>
                    <TrendingUpIcon className="text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{revenueChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDownIcon className="text-red-600 mr-1" />
                    <span className="text-sm text-red-600">{revenueChange.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-medium">${stats.revenueThisMonth.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#d7773e] h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (stats.revenueThisMonth / 50000) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Last Month</span>
                <span className="font-medium">${stats.revenueLastMonth.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-400 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (stats.revenueLastMonth / 50000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Top Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="space-y-3">
            {stats.topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-400 mr-3">#{index + 1}</span>
                  <span>{product.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${product.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{product.total_sold} sold</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Recent Orders */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Order #{order.id}</div>
                  <div className="text-sm text-gray-600">{order.user_name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${order.total_amount}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                <UsersIcon />
              </div>
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-gray-600">Add, edit, or remove users</p>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3">
                <PackageIcon />
              </div>
              <div>
                <p className="font-medium">Manage Products</p>
                <p className="text-sm text-gray-600">Add, edit, or remove products</p>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                <ShoppingBagIcon />
              </div>
              <div>
                <p className="font-medium">Manage Orders</p>
                <p className="text-sm text-gray-600">View and update order status</p>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg mr-3">
                <ActivityIcon />
              </div>
              <div>
                <p className="font-medium">View Reports</p>
                <p className="text-sm text-gray-600">Generate sales and revenue reports</p>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStatsComponent;