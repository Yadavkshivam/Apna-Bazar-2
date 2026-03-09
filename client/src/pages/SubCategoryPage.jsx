import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi";
import { FaCubes, FaPlus } from "react-icons/fa";
import EditSubCategory from '../components/EditSubCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'


const SubCategoryPage = () => {

  const [openAddSubCategory,setOpenAddSubCategory] = useState(false)
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL,setImageURL] = useState("")
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    _id : ""
  })
  const [deleteSubCategory,setDeleteSubCategory] = useState({
      _id : ""
  })
  const [openDeleteConfirmBox,setOpenDeleteConfirmBox] = useState(false)


  const fetchSubCategory = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
          ...SummaryApi.getSubCategory
        })
        const { data : responseData } = response

        if(responseData.success){
          setData(responseData.data)
        }
    } catch (error) {
       AxiosToastError(error)
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchSubCategory()
  },[])

  const column = [
    columnHelper.accessor('name',{
      header : () => <span className="text-gray-700 font-semibold">Name</span>
    }),
    columnHelper.accessor('image',{
      header : () => <span className="text-gray-700 font-semibold">Image</span>,
      cell : ({row})=>{
        return <div className='flex justify-center items-center'>
            <img 
                src={row.original.image}
                alt={row.original.name}
                className='w-10 h-10 rounded-lg object-cover cursor-pointer border-2 border-gray-100 hover:border-green-400 transition-all hover:scale-110'
                onClick={()=>{
                  setImageURL(row.original.image)
                }}      
            />
        </div>
      }
    }),
    columnHelper.accessor("category",{
       header : () => <span className="text-gray-700 font-semibold">Category</span>,
       cell : ({row})=>{
        return(
          <div className='flex flex-wrap gap-1 justify-center'>
            {
              row.original.category.map((c,index)=>{
                return(
                  <span key={c._id+"table"} className='bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium'>{c.name}</span>
                )
              })
            }
          </div>
        )
       }
    }),
    columnHelper.accessor("_id",{
      header : () => <span className="text-gray-700 font-semibold">Action</span>,
      cell : ({row})=>{
        return(
          <div className='flex items-center justify-center gap-2'>
              <button onClick={()=>{
                  setOpenEdit(true)
                  setEditData(row.original)
              }} className='p-2 bg-green-100 rounded-lg hover:bg-green-200 text-green-600 transition-colors'>
                  <HiPencil size={18}/>
              </button>
              <button onClick={()=>{
                setOpenDeleteConfirmBox(true)
                setDeleteSubCategory(row.original)
              }} className='p-2 bg-red-100 rounded-lg hover:bg-red-200 text-red-500 transition-colors'>
                  <MdDelete size={18}/>
              </button>
          </div>
        )
      }
    })
  ]

  const handleDeleteSubCategory = async()=>{
      try {
          const response = await Axios({
              ...SummaryApi.deleteSubCategory,
              data : deleteSubCategory
          })

          const { data : responseData } = response

          if(responseData.success){
             toast.success(responseData.message)
             fetchSubCategory()
             setOpenDeleteConfirmBox(false)
             setDeleteSubCategory({_id : ""})
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
                    <div className='w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
                        <FaCubes className='text-white text-xl' />
                    </div>
                    <div>
                        <h2 className='text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2'>
                            Sub Categories
                            <HiSparkles className='text-yellow-500 animate-pulse' />
                        </h2>
                        <p className='text-gray-500 text-sm'>Manage your product sub categories</p>
                    </div>
                </div>
                <button 
                    onClick={()=>setOpenAddSubCategory(true)} 
                    className='flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-300/50 hover:scale-105 active:scale-95 transition-all duration-300'
                >
                    <FaPlus /> Add Sub Category
                </button>
            </div>
        </div>

        {/* Table Card */}
        <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden'>
            <div className='overflow-x-auto'>
                <DisplayTable
                    data={data}
                    column={column}
                />
            </div>
        </div>

        {/* Modals */}
        {openAddSubCategory && (
            <UploadSubCategoryModel 
              close={()=>setOpenAddSubCategory(false)}
              fetchData={fetchSubCategory}
            />
        )}

        {ImageURL && (
            <ViewImage url={ImageURL} close={()=>setImageURL("")}/>
        )}

        {openEdit && (
            <EditSubCategory 
              data={editData} 
              close={()=>setOpenEdit(false)}
              fetchData={fetchSubCategory}
            />
        )}

        {openDeleteConfirmBox && (
            <CofirmBox 
              cancel={()=>setOpenDeleteConfirmBox(false)}
              close={()=>setOpenDeleteConfirmBox(false)}
              confirm={handleDeleteSubCategory}
            />
        )}
    </section>
  )
}

export default SubCategoryPage
