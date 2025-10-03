
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AsideContainer from './components/AsideContainer'
import DashboardContainer from './components/DashboardContainer'
import ContactContainer from './components/ContactContainer'
import RegisteredUserContainer from './components/RegisteredUserContainer'
import NavContainer from './components/NavContainer'
import CallBookingContainer from './components/CallBookingContainer'
import QuotationsContainer from './components/QuotationsContainer'
import QuotOrdersContainer from './components/QuotOrdersContainer'
import Calendar from './pages/Calendar'
import Categery from './pages/Categery'
import SubCategoriesPage from './pages/SubCategoriesPage'
import ShippingPage from './pages/ShippingPage'
import Discount from './pages/Discount'
import Enquiries from './pages/Enquiries'
import OrdersList from './pages/OrderList'
import OrderDetails from './pages/OrderDetails'
import EditCategoryPage from './components/EditCategoryPage'
import EditSubCategoryPage from './components/EditSubCategoryPage'
import Products from './pages/Products'
import CreateProduct from './components/CreateProduct'

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Categories state
  const [categories, setCategories] = useState([
    { id: 1, name: "Flats", slug: "flats", status: true },
    { id: 2, name: "Custom Home Cleaning", slug: "custom-cleaning", status: true },
    { id: 3, name: "Luxury Villas", slug: "luxury-villas", status: false },
  ]);

  // Subcategories state
  const [subCategories, setSubCategories] = useState([
    { id: 1, name: "Unfurnished Flats", slug: "unfurnished-flats", categoryId: 1, status: true },
    { id: 2, name: "Furnished Flats", slug: "furnished-flats", categoryId: 1, status: true },
    { id: 3, name: "Luxury Villas", slug: "luxury-villas", categoryId: 3, status: false },
  ]);

  // Update category
  const updateCategory = (id, updatedCategory) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === id ? { ...cat, ...updatedCategory } : cat
    );
    setCategories(updatedCategories);
  };

  // Update subcategory
  const updateSubCategory = (id, updatedSubCategory) => {
    const updated = subCategories.map((sub) =>
      sub.id === id ? { ...sub, ...updatedSubCategory } : sub
    );
    setSubCategories(updated);
  };

  return (

    <BrowserRouter>
      <div className="d-flex">

        <div style={{ width: "260px", height: "180vh"}}>
          <AsideContainer isOpen={isSidebarOpen}/>
        </div>

        <div className="flex-grow-1">
          <div className="position-sticky top-0 z-3">
            <NavContainer toggleSidebar={toggleSidebar}/>
          </div>
          <div className="p-4">
            <Routes>
              <Route path="/" element={<DashboardContainer/>} />
              <Route path="/contact" element={<ContactContainer/>} />
              <Route path="/registered-users" element={<RegisteredUserContainer/>} />
              <Route path="/callbooking" element={<CallBookingContainer/>}/>
              <Route path="/quotations" element={<QuotationsContainer/>}/>
              <Route path="/quot-orders" element={<QuotOrdersContainer/>}/>
              <Route path="/calender" element={<Calendar/>}/>
              <Route path="/categories" element={<Categery categories={categories}/>}/>
              <Route path="/sub-categories" element={<SubCategoriesPage subCategories={subCategories} categories={categories}/>}/>
              <Route path="/shipping" element={<ShippingPage/>}/>
              <Route path="/ordersList" element={<OrdersList/>}/>
              <Route path="/orders/:id" element={<OrderDetails/>}/>
              <Route path="/discounts" element={<Discount/>}/>  
              <Route path="/enquiries" element={<Enquiries/>}/>
              <Route path="/editcategory" element={<EditCategoryPage categories={categories} updateCategory={updateCategory}/>}/>
              <Route path="/editsubcategory/:id" element={<EditSubCategoryPage subCategories={subCategories} categories={categories} updateSubCategory={updateSubCategory}/>}/>
              <Route path="/product" element={<Products/>}/>
              <Route path="/create" element={<CreateProduct/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
