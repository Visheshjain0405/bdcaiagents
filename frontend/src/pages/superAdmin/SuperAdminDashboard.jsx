import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Building2, 
  Users, 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Phone,
  MessageSquare,
  Calendar,
  Zap
} from 'lucide-react';

// Dummy data
const statsData = {
  totalOrganizations: 1247,
  activeOrganizations: 892,
  totalAgents: 45,
  activeSubscriptions: 2156,
  monthlyRevenue: 125600,
  growthRate: 23.5
};

const pieChartData = [
  { name: 'WhatsApp Agents', value: 35, color: '#4f46e5' },
  { name: 'AI Calling Agents', value: 28, color: '#6366f1' },
  { name: 'Scheduling Agents', value: 22, color: '#8b5cf6' },
  { name: 'Other Agents', value: 15, color: '#a855f7' }
];

const lineChartData = [
  { month: 'Jan', organizations: 800, subscriptions: 1200 },
  { month: 'Feb', organizations: 850, subscriptions: 1350 },
  { month: 'Mar', organizations: 920, subscriptions: 1500 },
  { month: 'Apr', organizations: 980, subscriptions: 1650 },
  { month: 'May', organizations: 1100, subscriptions: 1800 },
  { month: 'Jun', organizations: 1247, subscriptions: 2156 }
];

const barChartData = [
  { category: 'WhatsApp Auto', subscriptions: 456, revenue: 34200 },
  { category: 'AI Calling', subscriptions: 389, revenue: 29175 },
  { category: 'Scheduling', subscriptions: 298, revenue: 22350 },
  { category: 'Email Automation', subscriptions: 234, revenue: 17550 },
  { category: 'Lead Generation', subscriptions: 189, revenue: 14175 }
];

const topAgents = [
  { name: 'WhatsApp Auto Scheduler Pro', subscribers: 456, revenue: '$34,200', growth: '+15%' },
  { name: 'AI Voice Assistant Elite', subscribers: 389, revenue: '$29,175', growth: '+22%' },
  { name: 'Smart Calendar Agent', subscribers: 298, revenue: '$22,350', growth: '+8%' },
  { name: 'Lead Qualifier Bot', subscribers: 234, revenue: '$17,550', growth: '+12%' },
  { name: 'Customer Support AI', subscribers: 189, revenue: '$14,175', growth: '+18%' }
];

const recentOrganizations = [
  { name: 'TechCorp Solutions', agents: 5, joined: '2 hours ago', status: 'Active' },
  { name: 'Digital Marketing Hub', agents: 3, joined: '5 hours ago', status: 'Active' },
  { name: 'StartupBoost Inc', agents: 2, joined: '1 day ago', status: 'Pending' },
  { name: 'Enterprise Systems', agents: 8, joined: '2 days ago', status: 'Active' },
  { name: 'Growth Catalyst', agents: 4, joined: '3 days ago', status: 'Active' }
];

function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage organizations and AI agents marketplace</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                <span className="text-indigo-700 font-medium">Live Status: Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Organizations</p>
                <p className="text-2xl font-bold text-indigo-600">{statsData.totalOrganizations.toLocaleString()}</p>
              </div>
              <Building2 className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Organizations</p>
                <p className="text-2xl font-bold text-green-600">{statsData.activeOrganizations.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total AI Agents</p>
                <p className="text-2xl font-bold text-purple-600">{statsData.totalAgents}</p>
              </div>
              <Bot className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
                <p className="text-2xl font-bold text-blue-600">{statsData.activeSubscriptions.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">${statsData.monthlyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                <p className="text-2xl font-bold text-orange-600">{statsData.growthRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart - Agent Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart - Growth Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="organizations" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    name="Organizations"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="subscriptions" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    name="Subscriptions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar Chart - Revenue by Category */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Agent Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Subscriptions'
                ]} />
                <Bar dataKey="subscriptions" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Agents */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Agents</h3>
              <span className="text-sm text-indigo-600 font-medium">View All</span>
            </div>
            <div className="space-y-4">
              {topAgents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      {index === 0 && <MessageSquare className="w-5 h-5 text-indigo-600" />}
                      {index === 1 && <Phone className="w-5 h-5 text-indigo-600" />}
                      {index === 2 && <Calendar className="w-5 h-5 text-indigo-600" />}
                      {index === 3 && <Bot className="w-5 h-5 text-indigo-600" />}
                      {index === 4 && <Zap className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.subscribers} subscribers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{agent.revenue}</p>
                    <p className="text-sm text-green-600">{agent.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Organizations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Organizations</h3>
              <span className="text-sm text-indigo-600 font-medium">View All</span>
            </div>
            <div className="space-y-4">
              {recentOrganizations.map((org, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{org.name}</p>
                      <p className="text-sm text-gray-600">{org.agents} agents • {org.joined}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      org.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {org.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-3 px-4 rounded-lg transition-colors">
              Add New Agent
            </button>
            <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-3 px-4 rounded-lg transition-colors">
              Manage Organizations
            </button>
            <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-3 px-4 rounded-lg transition-colors">
              View Analytics
            </button>
            <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-3 px-4 rounded-lg transition-colors">
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;