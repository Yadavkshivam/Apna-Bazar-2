import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'

const UserMenu = ({close}) => {
   const user = useSelector((state)=> state.user)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

   const handleClose = ()=>{
      if(close){
        close()
      }
   }
  return (
    <div>
        <div className='font-semibold'>My Account</div>
        <div className='text-sm flex items-center gap-2'>
          <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : user.role ==="EXPERT" ?"(Expert)": "" }</span></span>
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
            <HiOutlineExternalLink size={15}/>
          </Link>
        </div>

        <Divider/>

        <div className='text-sm grid gap-1'>
      <div className='text-sm grid gap-1'>
  
  {/* ADMIN MENUS */}
  {user.role === "ADMIN" && (
    <>
      <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-orange-200 py-1'>Category</Link>
      <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
      <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
      <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-orange-200 py-1'>Product</Link>
       <Link onClick={handleClose} to={"/dashboard/myorders"} className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>
      <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-orange-200 py-1'>Save Address</Link>
    </>
  )}

  {/* EXPERT MENUS */}
  {user.role === "EXPERT" && (
    <>
      <Link
        onClick={handleClose}
        to={"/dashboard/expert-dashboard"}
        className='px-2 hover:bg-green-100 py-1 rounded flex items-center gap-2'
      >
        🌿 Expert Dashboard
      </Link>
      <Link
        onClick={handleClose}
        to={"/my-consultations"}
        className='px-2 hover:bg-green-100 py-1 rounded flex items-center gap-2'
      >
        📋 My Sessions
      </Link>
    </>
  )}

  {/* USER MENUS - My Consultations for all users */}
  {user.role !== "EXPERT" && user._id && (
    <Link
      onClick={handleClose}
      to={"/my-consultations"}
      className='px-2 hover:bg-orange-200 py-1 rounded flex items-center gap-2'
    >
      📅 My Consultations
    </Link>
  )}

  {/* LOGOUT BUTTON (common for all) */}
  <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>Log Out</button>

</div>

        </div>
    </div>
  )
}

export default UserMenu
