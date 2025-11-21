import Sidebar from '../components/Vendor-Dashboard/Sidebar'
import AddProduct from '../components/Vendor-Dashboard/AddProduct'
import React from 'react'

const AddProductPageForVendor = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 overflow-scroll"><AddProduct/></div>
    </div>
  )
}

export default AddProductPageForVendor