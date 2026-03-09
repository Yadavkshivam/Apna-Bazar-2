import React, { useState } from 'react'
import { FaCloudUploadAlt, FaBox, FaTag, FaRupeeSign, FaPercent, FaLayerGroup, FaCubes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdDescription, MdInventory } from "react-icons/md";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';
import fetchUserDetails from '../utils/fetchUserDetails';

const UploadProduct = () => {
    const [username, setUsername] = useState("");

  const loadUserDetails = async () => {
    try {
      const result = await fetchUserDetails();
      console.log("Logged in user:", result.data.name);

      setUsername(result.data.name);   
      setData(pre => ({ 
        ...pre, 
        username: result.data.name    
      }));
    } catch (error) {
      console.log("Cannot fetch details", error);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, []);



  const [data,setData] = useState({
      username:"",
      name : "",
      image : [],
      category : [],
      subCategory : [],
      unit : "",
      stock : "",
      price : "",
      discount : "",
      description : "",
      more_details : {},
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")


  const handleChange = (e)=>{
    const { name, value} = e.target 

    setData((preve)=>{
      return{
          ...preve,
          [name]  : value
      }
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data : ImageResponse } = response
    const imageUrl = ImageResponse.data.url 

    setData((preve)=>{
      return{
        ...preve,
        image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>{
        return{
            ...preve
        }
      })
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async(index)=>{
      data.subCategory.splice(index,1)
      setData((preve)=>{
        return{
          ...preve
        }
      })
  }

  const handleAddField = ()=>{
    setData((preve)=>{
      return{
          ...preve,
          more_details : {
            ...preve.more_details,
            [fieldName] : ""
          }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log("data",data)

    try {
      const response = await Axios({
          ...SummaryApi.createProduct,
          data : data
      })
      const { data : responseData} = response

      if(responseData.success){
          successAlert(responseData.message)
          setData({
            username:username,
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })

      }
    } catch (error) {
        AxiosToastError(error)
    }


  }

  return (
    <section className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6'>
        {/* Header */}
        <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 md:p-6 mb-6 border border-white/50'>
            <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg'>
                    <FaCloudUploadAlt className='text-white text-xl' />
                </div>
                <div>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2'>
                        Upload Product
                        <HiSparkles className='text-yellow-500 animate-pulse' />
                    </h2>
                    <p className='text-gray-500 text-sm'>Add new products to your store</p>
                </div>
            </div>
        </div>

        {/* Form Card */}
        <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 md:p-6 border border-white/50'>
            <form className='grid gap-6' onSubmit={handleSubmit}>
                
                {/* Product Name */}
                <div className='group'>
                    <label htmlFor='name' className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                        <FaBox className='text-green-500' /> Product Name
                    </label>
                    <input 
                        id='name'
                        type='text'
                        placeholder='Enter product name'
                        name='name'
                        value={data.name}
                        onChange={handleChange}
                        required
                        className='w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                    />
                </div>

                {/* Description */}
                <div className='group'>
                    <label htmlFor='description' className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                        <MdDescription className='text-green-500' /> Description
                    </label>
                    <textarea 
                        id='description'
                        type='text'
                        placeholder='Enter product description'
                        name='description'
                        value={data.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className='w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300 resize-none'
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <p className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                        📷 Product Images
                    </p>
                    <label htmlFor='productImage' className='bg-gradient-to-br from-green-50 to-emerald-50 h-32 border-2 border-dashed border-green-300 rounded-xl flex justify-center items-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-300'>
                        <div className='text-center flex justify-center items-center flex-col'>
                            {imageLoading ? <Loading/> : (
                                <>
                                    <FaCloudUploadAlt size={40} className='text-green-500 mb-2'/>
                                    <p className='text-gray-600 font-medium'>Click to upload images</p>
                                    <p className='text-gray-400 text-xs'>PNG, JPG up to 5MB</p>
                                </>
                            )}
                        </div>
                        <input 
                            type='file'
                            id='productImage'
                            className='hidden'
                            accept='image/*'
                            onChange={handleUploadImage}
                        />
                    </label>
                    
                    {/* Uploaded Images */}
                    <div className='flex flex-wrap gap-4 mt-4'>
                        {data.image.map((img,index) => (
                            <div key={img+index} className='h-20 w-20 min-w-20 bg-white border-2 border-gray-100 rounded-xl relative group overflow-hidden shadow-sm hover:shadow-md transition-all'>
                                <img
                                    src={img}
                                    alt={img}
                                    className='w-full h-full object-cover cursor-pointer' 
                                    onClick={()=>setViewImageURL(img)}
                                />
                                <div onClick={()=>handleDeleteImage(index)} className='absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                                    <MdDelete className='text-white text-xl'/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category & SubCategory Row */}
                <div className='grid md:grid-cols-2 gap-6'>
                    {/* Category */}
                    <div>
                        <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                            <FaLayerGroup className='text-green-500' /> Category
                        </label>
                        <select
                            className='w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                            value={selectCategory}
                            onChange={(e)=>{
                                const value = e.target.value 
                                const category = allCategory.find(el => el._id === value )
                                setData((preve)=>({
                                    ...preve,
                                    category : [...preve.category,category],
                                }))
                                setSelectCategory("")
                            }}
                        >
                            <option value={""}>Select Category</option>
                            {allCategory.map((c,index)=>(
                                <option key={c?._id} value={c?._id}>{c.name}</option>
                            ))}
                        </select>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {data.category.map((c,index)=>(
                                <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full'>
                                    <p>{c.name}</p>
                                    <IoClose size={16} className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveCategory(index)}/>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sub Category */}
                    <div>
                        <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                            <FaCubes className='text-green-500' /> Sub Category
                        </label>
                        <select
                            className='w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                            value={selectSubCategory}
                            onChange={(e)=>{
                                const value = e.target.value 
                                const subCategory = allSubCategory.find(el => el._id === value )
                                setData((preve)=>({
                                    ...preve,
                                    subCategory : [...preve.subCategory,subCategory]
                                }))
                                setSelectSubCategory("")
                            }}
                        >
                            <option value={""}>Select Sub Category</option>
                            {allSubCategory.map((c,index)=>(
                                <option key={c?._id} value={c?._id}>{c.name}</option>
                            ))}
                        </select>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {data.subCategory.map((c,index)=>(
                                <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full'>
                                    <p>{c.name}</p>
                                    <IoClose size={16} className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveSubCategory(index)}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Unit & Stock Row */}
                <div className='grid md:grid-cols-2 gap-6'>
                    <div className='group'>
                        <label htmlFor='unit' className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                            <FaTag className='text-green-500' /> Unit
                        </label>
                        <input 
                            id='unit'
                            type='text'
                            placeholder='e.g., kg, piece, liter'
                            name='unit'
                            value={data.unit}
                            onChange={handleChange}
                            required
                            className='w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                        />
                    </div>

                    <div className='group'>
                        <label htmlFor='stock' className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                            <MdInventory className='text-green-500' /> Stock Quantity
                        </label>
                        <input 
                            id='stock'
                            type='number'
                            placeholder='Enter stock quantity'
                            name='stock'
                            value={data.stock}
                            onChange={handleChange}
                            required
                            className='w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                        />
                    </div>
                </div>

                {/* Price & Discount Row */}
                <div className='grid md:grid-cols-2 gap-6'>
                    <div className='group'>
                        <label htmlFor='price' className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                            <FaRupeeSign className='text-green-500' /> Price (₹)
                        </label>
                        <input 
                            id='price'
                            type='number'
                            placeholder='Enter price'
                            name='price'
                            value={data.price}
                            onChange={handleChange}
                            required
                            className='w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                        />
                    </div>

                    <div className='group'>
                        <label htmlFor='discount' className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                            <FaPercent className='text-green-500' /> Discount (%)
                        </label>
                        <input 
                            id='discount'
                            type='number'
                            placeholder='Enter discount percentage'
                            name='discount'
                            value={data.discount}
                            onChange={handleChange}
                            required
                            className='w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                        />
                    </div>
                </div>

                {/* More Details */}
                {Object?.keys(data?.more_details)?.map((k,index)=>(
                    <div key={k+index} className='group'>
                        <label htmlFor={k} className='text-sm font-semibold text-gray-700 mb-2 block capitalize'>{k}</label>
                        <input 
                            id={k}
                            type='text'
                            value={data?.more_details[k]}
                            onChange={(e)=>{
                                const value = e.target.value 
                                setData((preve)=>({
                                    ...preve,
                                    more_details : {
                                        ...preve.more_details,
                                        [k] : value
                                    }
                                }))
                            }}
                            required
                            className='w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                        />
                    </div>
                ))}

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                    <button 
                        type="button"
                        onClick={()=>setOpenAddField(true)} 
                        className='px-6 py-3 bg-white border-2 border-green-500 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2'
                    >
                        ➕ Add Custom Field
                    </button>

                    <button
                        type="submit"
                        className='flex-1 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2'
                    >
                        🚀 Upload Product
                    </button>
                </div>
            </form>
        </div>

        {ViewImageURL && (
            <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>
        )}

        {openAddField && (
            <AddFieldComponent 
                value={fieldName}
                onChange={(e)=>setFieldName(e.target.value)}
                submit={handleAddField}
                close={()=>setOpenAddField(false)} 
            />
        )}
    </section>
  )
}

export default UploadProduct
