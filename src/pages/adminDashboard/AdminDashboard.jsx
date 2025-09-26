import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import OrdersTable from './OrdersTable'
import KpiCard from './KpiCard'
import Sparkline from './Sparkline'
import Modal from './Modal'
import OrderEditor from './OrderEditor'
import UserPanel from './UserPanel'

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('Dashboard')
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      title: 'Engine Repair',
      charges: 450,
      status: 'In Progress',
      updatedAt: '2024-01-15'
    },
    {
      id: 'ORD-002',
      title: 'Brake Service',
      charges: 200,
      status: 'Completed',
      updatedAt: '2024-01-14'
    },
    {
      id: 'ORD-003',
      title: 'Oil Change',
      charges: 80,
      status: 'Pending',
      updatedAt: '2024-01-13'
    }
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)

  const handleAddOrder = () => {
    setEditingOrder(null)
    setShowModal(true)
  }

  const handleEditOrder = (order) => {
    setEditingOrder(order)
    setShowModal(true)
  }

  const handleSaveOrder = (orderData) => {
    if (editingOrder) {
      // Update existing order
      setOrders(orders.map(order => 
        order.id === editingOrder.id ? { ...order, ...orderData } : order
      ))
    } else {
      // Add new order
      const newOrder = {
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        ...orderData,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      setOrders([...orders, newOrder])
    }
    setShowModal(false)
    setEditingOrder(null)
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <KpiCard title="Total Orders" value="24" change="+12%" />
              <KpiCard title="Revenue" value="$12,450" change="+8%" />
              <KpiCard title="Active Jobs" value="8" change="-2%" />
              <KpiCard title="Completed" value="16" change="+15%" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                <div className="w-full">
                  <Sparkline />
                </div>
              </div>
              {/* <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-semibold">16</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending</span>
                    <span className="font-semibold">5</span>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <OrdersTable orders={orders} setOrders={setOrders} onEdit={handleEditOrder} />
              </div>
            </div>
          </div>
        )
      case 'User Management':
        return <UserPanel />
      case 'User Roles':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">User Roles Management</h3>
            <p className="text-gray-600">User roles management functionality will be implemented here.</p>
          </div>
        )
      case 'Settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <p className="text-gray-600">Settings functionality will be implemented here.</p>
          </div>
        )
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Dashboard</h3>
            <p className="text-gray-600">Welcome to the admin dashboard.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="flex-1 lg:ml-0">
          <Header onAddOrder={handleAddOrder} />
          <main className="p-3 sm:p-4 lg:p-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Modal for adding/editing orders */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <OrderEditor
            order={editingOrder}
            onSave={handleSaveOrder}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}

export default AdminDashboard
