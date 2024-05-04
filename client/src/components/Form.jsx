import React from 'react'
import { useFormik } from 'formik'
import { ValidationSchemaForm } from '../Validation/formValidation'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// MUI components
import { Button, TextField, Alert, AlertTitle } from '@mui/material'
import { FileUpload, Cancel } from '@mui/icons-material'
//initial values
const initialValues = {
    productName: '',
    category: '',
    material: '',
    description: '',
    price: '',
    stock: '',
    height: '',
    length: '',
    width: '',
    dimenstionUnit: '',
    weight: '',
    weightUnit: '',
    productImg: [],
    ownerImg: []
}

const Form = () => {
    const [user, setUserData] = useState([])
    const navigate = useNavigate()
    const [alert, setAlert] = useState('')
    const fetchUser = async () => {
        try {
            const id = localStorage.getItem('id')

            const response = await axios.get(`${import.meta.env.VITE_FRONTEND_URL}/login/success`, (id) ? {
                headers: {
                    'Authorization': `Bearer ${id}`,
                }
            } : { withCredentials: true })
            console.log("response", response);
            setUserData(response.data.user)
        } catch (error) {
            console.log(error);
            navigate('/error')
        }
    }
    console.log(user);
    useEffect(() => {
        fetchUser()
    }, [])
    const { values, handleSubmit, errors, touched, handleChange, setFieldValue } = useFormik({
        initialValues,
        validationSchema: ValidationSchemaForm,
        onSubmit: async (values) => {
            console.log(values);
            const formData = new FormData()
            formData.append('productName', values.productName)
            formData.append('category', values.category)
            formData.append('material', values.material)
            formData.append('description', values.description)
            formData.append('price', values.price)
            formData.append('stock', values.stock)
            formData.append('dimensions', `${values.length} x ${values.width} x ${values.height} (in ${values.dimenstionUnit})`)
            formData.append('weight', `${values.weight} ${values.weightUnit}`)
            formData.append('email', user.username)
            values.productImg.forEach((img, index) => {
                formData.append(`productImg`, img)
            })
            values.ownerImg.forEach((img, index) => {
                formData.append(`ownerImg`, img)
            })


            try {
                console.log(formData);
                formData.forEach((value, key) => {
                    console.log(`${key}: ${value}`);
                });
                const respose = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/product/insert`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                setAlert("Data added successfully")
                // navigate('/profile')
                console.log(respose);
            } catch (error) {
                console.log(error);
            }
        }
    })
    // console.log(errors);
    const handelFileChange = (event) => {
        const files = event.currentTarget.files
        const fileData = Array.from(files)
        console.log(fileData[0]);
        setFieldValue(event.target.name, [...values[event.target.name], ...fileData])
    }


    if (alert) {
        setTimeout(() => {
            setAlert('')
            navigate('/profile')

        }, 1000)

    }
    // console.log(values);
    return (
        <div className='bg-form sm:h-[100vh] sm:w-[100vw] sm:bg-cover h-screen	w-screen sm:pt-[6vh] sm:pl-16' >
            {alert && <Alert severity="success" style={{ fontSize: "3vh", position: 'absolute', textAlign: 'center', top: '0', left: '35vw', borderRadius: '20px' }}>
                <AlertTitle style={{ fontWeight: '900' }}>success</AlertTitle>
                {alert}
            </Alert>
            }
            <div className='border bg-teal-950 shadow-[1px_1px_5px_3px]  sm:w-[40vw] sm:h-[90vh] sm:flex flex-col p-[2vh] text-center text-lg sm:overflow-y-auto scrollbar-thin scrollbar-webkit'>
                <h1 className='text-5xl font-serif text-[white] mb-6'>Insert product</h1>
                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                    <div className='flex items-center justify-between my-2 w-full' >
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="productName" >Product name:- </label>
                        <TextField
                            type="text"
                            id='productName'
                            name='productName'
                            placeholder='Enter product name'
                            label='Product name'
                            variant="outlined"
                            size='small'
                            InputLabelProps={{
                                style: { color: '#1976D2' },
                            }}
                            InputProps={{
                                style: { color: 'white' },
                            }}
                            className='outlined-input'
                            value={values.productName}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.productName && touched.productName ? <p className='text-[red]'>{errors.productName}</p> : null}
                    <div className='flex items-center justify-between my-2'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="category">Product category:- </label>
                        <select name="category" id="category" value={values.category} onChange={handleChange} className='sm:w-[15.2vw] w-[50vw] h-[5vh] rounded-lg'>
                            <option value="">Choose category</option>
                            <option value="jewellery">Jewellery</option>
                            <option value="miniature">Miniature</option>
                            <option value="textile">Textiles</option>
                            <option value="homedecore">Home Decore</option>
                            <option value="art">Art & Illustion</option>
                            <option value="pottery">Pottery</option>
                        </select>
                    </div>
                    {errors.category && touched.category ? <p className='text-[red]'>{errors.category}</p> : null}
                    <div className='flex items-center justify-between my-2'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="material">Product material:- </label>
                        <select name="material" id="material" value={values.material} onChange={handleChange} className='sm:w-[15.2vw] w-[50vw] h-[5vh] rounded-lg'>
                            <option value="">Choose material</option>
                            <option value="glass">Glass</option>
                            <option value="stones">Stones</option>
                            <option value="wooden">Wooden</option>
                            <option value="cotton">Cotton</option>
                            <option value="wool">Wool</option>
                            <option value="metal">Metal</option>
                            <option value="leather">Leather</option>
                            <option value="paper">Paper</option>
                            <option value="clay">Clay</option>
                            <option value="cardboard">Cardboard</option>
                        </select>
                    </div>
                    {errors.material && touched.material ? <p className='text-[red]'>{errors.material}</p> : null}
                    <div className='flex items-center justify-between my-2'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="description">Product description:- </label>
                        <TextField
                            type="text"
                            id='description'
                            name='description'
                            placeholder='Enter product description'
                            label='Product description'
                            variant="outlined"
                            size='small'
                            // color='primary'
                            InputLabelProps={{
                                style: { color: '#1976D2', borderColor: 'white' },
                            }}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                            value={values.description}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.description && touched.description ? <p className='text-[red]'>{errors.description}</p> : null}
                    <div className='flex items-center justify-between my-2'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="price">Price (in Rs):- </label>
                        <TextField
                            type="number"
                            id='price'
                            name='price'
                            placeholder='Enter Price'
                            label='Price'
                            variant="outlined"
                            size='small'
                            // color='primary'
                            InputLabelProps={{
                                style: { color: '#1976D2', borderColor: 'white' },
                            }}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                            value={values.price}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.price && touched.price ? <p className='text-[red]'>{errors.price}</p> : null}
                    <div className='flex items-center justify-between my-2'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="stock">Available Stock:- </label>
                        <TextField
                            type="number"
                            id='stock'
                            name='stock'
                            placeholder='Available stock'
                            label='Stock'
                            variant="outlined"
                            size='small'
                            // color='primary'
                            InputLabelProps={{
                                style: { color: '#1976D2', borderColor: 'white' },
                            }}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                            value={values.stock}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.stock && touched.stock ? <p className='text-[red]'>{errors.stock}</p> : null}
                    <div className='flex items-center sm:justify-between my-2'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="height">Dimensions:- </label>
                        <div>
                            <TextField
                                type="number"
                                id='stock'
                                // className={form.input}
                                name='height'
                                placeholder='Height'
                                label='Height'
                                variant="outlined"
                                size='small'
                                // color='primary'
                                InputLabelProps={{
                                    style: { color: '#1976D2', borderColor: 'white' },
                                }}
                                InputProps={{
                                    style: { color: 'white', borderColor: 'white' },
                                }}
                                value={values.height}
                                onChange={handleChange}
                                className='sm:w-20 '
                            />
                            {/* <br /> */}
                            <TextField
                                type="number"
                                id='stock'
                                // className={form.input}
                                name='length'
                                placeholder='Length'
                                label='Length'
                                variant="outlined"
                                size='small'
                                // color='primary'
                                InputLabelProps={{
                                    style: { color: '#1976D2', borderColor: 'white' },
                                }}
                                InputProps={{
                                    style: { color: 'white', borderColor: 'white' },
                                }}
                                value={values.length}
                                onChange={handleChange}
                                className='sm:w-20'

                            />
                            {/* <br /> */}
                            <TextField
                                type="number"
                                id='stock'
                                // className={form.input}
                                name='width'
                                placeholder='Width'
                                label='Width'
                                variant="outlined"
                                size='small'
                                // color='primary'
                                InputLabelProps={{
                                    style: { color: '#1976D2', borderColor: 'white' },
                                }}
                                InputProps={{
                                    style: { color: 'white', borderColor: 'white' },
                                }}
                                value={values.width}
                                onChange={handleChange}
                                className='sm:w-20 '
                            />
                            {/* <br /> */}
                            <select name="dimenstionUnit" id="stock" value={values.dimenstionUnit} onChange={handleChange} className='sm:w-[6.5vw] w-[50vw] h-[5vh] rounded-lg text-sm'>
                                <option value="">Choose unit</option>
                                <option value="cm">centimeter</option>
                                <option value="m">meter</option>
                                <option value="mm">millimeter</option>
                                <option value="inch">inch</option>
                                <option value="foot">foot</option>
                            </select>
                        </div>
                    </div>
                    {(errors.height || errors.length || errors.width || errors.dimenstionUnit)
                        && (touched.height || touched.length || touched.width || touched.dimenstionUnit)
                        ? <p className='text-[red]'>{errors.height || errors.length || errors.width || errors.dimenstionUnit}</p> : null}
                    <div className='flex items-center justify-between my-2'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="weight">Weight:- </label>
                        <div>
                            <TextField
                                type="number"
                                id='weight'
                                name='weight'
                                className='sm:w-[7vw] w-[25vw]'
                                placeholder='weight'
                                label='Weight'
                                variant="outlined"
                                size='small'
                                // color='primary'
                                InputLabelProps={{
                                    style: { color: '#1976D2', borderColor: 'white' },
                                }}
                                InputProps={{
                                    style: { color: 'white', borderColor: 'white' },
                                }}
                                value={values.weight}
                                onChange={handleChange}
                            />
                            {/* <br /> */}
                            <select name="weightUnit" id="weight" value={values.weightUnit} onChange={handleChange} className='sm:w-[8vw] w-[25vw] h-[5vh] rounded-lg text-sm'>
                                <option value="">Choose weight unit</option>
                                <option value="gm">gm</option>
                                <option value="Kg">Kg</option>
                            </select>
                        </div>
                    </div>
                    {(errors.weight || errors.weightUnit) && (touched.weight || touched.weightUnit) ? <p className='text-[red]'>{errors.weight || errors.weightUnit}</p> : null}
                    <div className='flex items-center justify-between my-2'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="productImg">Product image ({values.productImg.length}/4):- </label>
                        <input
                            type="file"
                            id='productImg'
                            name='productImg'
                            multiple
                            onChange={handelFileChange}
                            className='sm:w-[15vw] w-[50vw] text-[white]'
                            disabled={values.productImg.length == 4}
                        />
                    </div>
                    {errors.productImg && touched.productImg ? <p className='text-[red]'>{errors.productImg}</p> : null}
                    <div className='flex items-center justify-between my-2'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="ownerImg">Owner Image:- </label>
                        <input
                            type="file"
                            id='ownerImg'
                            name='ownerImg'
                            onChange={handelFileChange}
                            className='sm:w-[15vw] w-[50vw] text-[white]'
                        />
                    </div>
                    {errors.ownerImg && touched.ownerImg ? <p className='text-[red]'>{errors.ownerImg}</p> : null}
                    <br />
                    <div className='flex justify-evenly'>
                        <Button variant='contained' endIcon={<FileUpload />} size='large' type='submit'>Submit</Button >
                        <Button variant='contained' endIcon={<Cancel />} size='large' onClick={() => navigate('/profile')}>Cancel</Button >
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form
