import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'
import { HiSparkles } from "react-icons/hi"
import { FaLayerGroup, FaPlus } from "react-icons/fa"
import { HiPencil } from "react-icons/hi"
import { MdDelete } from "react-icons/md"

const CategoryPage = () => {
    const [openUploadCategory,setOpenUploadCategory] = useState(false)
    const [loading,setLoading] = useState(false)
    const [categoryData,setCategoryData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const [editData,setEditData] = useState({
        name : "",
        image : "",
    })
    const [openConfimBoxDelete,setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory,setDeleteCategory] = useState({
        _id : ""
    })
    
    const fetchCategory = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory

            })
            const { data : responseData } = response

            if(responseData.success){
    const filteredData = responseData.data.filter(
        item => item.username === username
    );

    setCategoryData(filteredData);
            }
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])

    const handleDeleteCategory = async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6'>
        {/* Header */}
        <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 md:p-6 mb-6 border border-white/50'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg'>
                        <FaLayerGroup className='text-white text-xl' />
                    </div>
                    <div>
                        <h2 className='text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2'>
                            Categories
                            <HiSparkles className='text-yellow-500 animate-pulse' />
                        </h2>
                        <p className='text-gray-500 text-sm'>Manage your product categories</p>
                    </div>
                </div>
                <button 
                    onClick={()=>setOpenUploadCategory(true)} 
                    className='flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-300/50 hover:scale-105 active:scale-95 transition-all duration-300'
                >
                    <FaPlus /> Add Category
                </button>
            </div>
        </div>

        {/* No Data */}
        {!categoryData[0] && !loading && (
            <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/50 text-center'>
                <NoData/>
            </div>
        )}

        {/* Category Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
            {categoryData.map((category,index)=>(
                <div 
                    key={category._id} 
                    className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-white/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group'
                >
                    {/* Image */}
                    <div className='relative h-32 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden'>
                        <img 
                            alt={category.name}
                            src={category.image}
                            className='w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300'
                        />
                        {/* Overlay on hover */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </div>
                    
                    {/* Content */}
                    <div className='p-3'>
                        <h3 className='font-semibold text-gray-800 text-center truncate mb-3'>{category.name}</h3>
                        
                        {/* Action Buttons */}
                        <div className='flex gap-2'>
                            <button 
                                onClick={()=>{
                                    setOpenEdit(true)
                                    setEditData(category)
                                }} 
                                className='flex-1 flex items-center justify-center gap-1 py-2 bg-green-100 hover:bg-green-200 text-green-600 font-medium rounded-lg transition-colors'
                            >
                                <HiPencil size={16}/> Edit
                            </button>
                            <button 
                                onClick={()=>{
                                    setOpenConfirmBoxDelete(true)
                                    setDeleteCategory(category)
                                }} 
                                className='flex-1 flex items-center justify-center gap-1 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded-lg transition-colors'
                            >
                                <MdDelete size={16}/> Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Loading */}
        {loading && (
            <div className='flex justify-center items-center py-12'>
                <Loading/>
            </div>
        )}

        {/* Modals */}
        {openUploadCategory && (
            <UploadCategoryModel fetchData={fetchCategory} close={()=>setOpenUploadCategory(false)}/>
        )}

        {openEdit && (
            <EditCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
        )}

        {openConfimBoxDelete && (
            <CofirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
        )}
    </section>
  )
}

export default CategoryPage
