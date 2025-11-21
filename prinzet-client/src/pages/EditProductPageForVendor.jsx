import Sidebar from '../components/Vendor-Dashboard/Sidebar'
import UpdateProduct from '../components/Vendor-Dashboard/UpdateProduct'
import React from 'react'

const EditProductPageForVendor = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 overflow-scroll"><UpdateProduct/></div>
    </div>
  )
}

export default EditProductPageForVendor