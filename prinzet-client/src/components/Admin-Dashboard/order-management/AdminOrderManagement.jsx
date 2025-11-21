import React from 'react'
import AdminDocumentDashboard from './DocumentOrders'
import AdminAccessoryDashboard from './AccessoryOrders'

const AdminOrderManagement = () => {
  return (
    <div>
        <AdminDocumentDashboard />
        <AdminAccessoryDashboard />
    </div>
  )
}

export default AdminOrderManagement