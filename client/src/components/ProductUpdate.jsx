import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
//MUi component
import { Button, TextField, Alert, AlertTitle } from '@mui/material'
import { FileUpload, Cancel } from '@mui/icons-material'
const ProductUpdate = () => {
    const { id } = useParams()
    const [user, setuser] = useState([])
    const navigate = useNavigate()
    const [productName, setProductName] = useState("")
    const [category, setCategory] = useState("")
    const [material, setMaterial] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [height, setHeight] = useState("")
    const [length, setLength] = useState("")
    const [width, setWidth] = useState("")
    const [dimenstionUnit, setDimenstionUnit] = useState("")
    const [weight, setWeigth] = useState("")
    const [weightUnit, setWeightUnit] = useState("")

    const [success,setSuccess] = useState('')
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const id = localStorage.getItem('id')

                const response = await axios.get(`https://s47-dhruv-capstone-2-craftershub-1.onrender.com/login/success` ,(id)?  {
                    headers:{
                      'Authorization': `Bearer ${id}`,
                    }}:{ withCredentials: true })
                setuser(response.data.user)
            } catch (error) {
                console.log(error);
                navigate('/error')
            }
        }
        const productData = async () => {
            try {
                const productData = await axios.get(`https://s47-dhruv-capstone-2-craftershub-1.onrender.com/product/${id}`)
                console.log(productData.data);
                setProductName(productData.data.productName)
                setCategory(productData.data.category)
                setMaterial(productData.data.material)
                setDescription(productData.data.description)
                setPrice(productData.data.price)
                setStock(productData.data.stock)
                setHeight(productData.data.dimensions.split(' x ')[0])
                setLength(productData.data.dimensions.split(' x ')[1])
                setWidth(productData.data.dimensions.split(' x ')[2].split(' ')[0])
                setDimenstionUnit(productData.data.dimensions.split(' x ')[2].split(' ')[2].split(')')[0])
                setWeigth(productData.data.weight.split(' ')[0])
                setWeightUnit(productData.data.weight.split(' ')[1])

            } catch (error) {
                console.log(error);
            }
        }
        fetchUser()
        productData()

    }, [])
    const onSubmtBtn = (e) => {
        e.preventDefault()

        axios.put(`https://s47-dhruv-capstone-2-craftershub-1.onrender.com/product/update/${id}`, {
            productName,
            category,
            material,
            description,
            price,
            stock,
            dimensions: `${height} x ${length} x ${width} (in ${dimenstionUnit})`,
            weight: `${weight} ${weightUnit}`,
            email: user.username
        }).then((res) => {
            console.log("put resonse", res.data);
            setSuccess("Data updated")
            // navigate('/profile')
        }).catch((err) => {
            console.log(err);
        })
    }
    if(success){
        setTimeout(()=>{
            setSuccess('')
            navigate('/profile')
        },1000)
    }
    return (
        <div className='bg-form sm:h-[100vh] sm:w-[100vw] sm:bg-cover h-screen	w-screen sm:pt-[6vh] sm:pl-16'>
            {success && <Alert severity="success" style={{ fontSize: "3vh", position: 'absolute', textAlign: 'center',top:'0', left: '35vw', borderRadius: '20px' }}>
                <AlertTitle style={{ fontWeight: '900' }}>success</AlertTitle>
                {success}
            </Alert>
            }
            <div className='border bg-teal-950 shadow-[1px_1px_5px_3px]  sm:w-[40vw] sm:h-[90vh] sm:flex flex-col p-[2vh] text-center text-lg sm:overflow-y-auto scrollbar-thin scrollbar-webkit'>
                <h1 className='text-5xl font-serif text-[white] mb-6'>Update data</h1>
                <form onSubmit={(e) => onSubmtBtn(e)} method="post" encType="multipart/form-data">
                    <div className='flex items-center justify-between my-4 w-full'>
                        <label  className='sm:text-2xl font-serif text-[white]' htmlFor="productName">Product name:- </label>
                        <TextField                            
                        type="text"
                            id='productName'
                            name='productName'
                            placeholder='Enter product name'
                            value={productName}
                            required
                            label='Product name'
                            variant="outlined"
                            size='small'
                            InputLabelProps={{
                                style: { color: '#1976D2' },
                            }}
                            InputProps={{
                                style: { color: 'white' },
                            }}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                    <div className='flex items-center justify-between my-4'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="category">Product category:- </label>
                        <select name="category" id="category" className='sm:w-[15.2vw] w-[50vw] h-[5vh] rounded-lg' value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Choose category</option>
                            <option value="jewellery">Jewellery</option>
                            <option value="miniature">Miniature</option>
                            <option value="textile">Textiles</option>
                            <option value="homedecore">Home Decore</option>
                            <option value="art">Art & Illustion</option>
                            <option value="pottery">Pottery</option>
                        </select>
                    </div>
                    <div className='flex items-center justify-between my-4'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="material">Product material:- </label>
                        <select name="material" id="material" className='sm:w-[15.2vw] w-[50vw] h-[5vh] rounded-lg' value={material} onChange={(e) => setMaterial(e.target.value)} required>
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
                    <div className='flex items-center justify-between my-4'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="description">Product description:- </label>
                        <TextField                            
                            type="text"
                            id='description'
                            name='description'
                            placeholder='Enter product description'
                            value={description}
                            label='Product description'
                            variant="outlined"
                            size='small'
                            InputLabelProps={{
                                style: { color: '#1976D2', borderColor: 'white' },
                            }}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex items-center justify-between my-4'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="price">Price (in Rs):- </label>
                        <TextField                            
                            type="number"
                            id='price'
                            name='price'
                            placeholder='Enter Price'
                            value={price}
                            label='Price'
                            variant="outlined"
                            size='small'
                            InputLabelProps={{
                                style: { color: '#1976D2', borderColor: 'white' },
                            }}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex items-center justify-between my-4'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="stock">Available Stock:- </label>
                        <TextField                            
                            type="number"
                            id='stock'
                            name='stock'
                            placeholder='Available stock'
                            value={stock}
                            label='Price'
                            variant="outlined"
                            size='small'
                            InputLabelProps={{
                                style: { color: '#1976D2', borderColor: 'white' },
                            }}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex items-center justify-between my-4'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="height">Dimensions:- </label>
                        <div>
                            <TextField                                
                                type="number"
                                id='height'
                                name='height'
                                placeholder='Height'
                                value={height}
                                label='Price'
                            variant="outlined"
                            size='small'
                            className='sm:w-20 '
                            InputLabelProps={{
                                style: { color: '#1976D2', borderColor: 'white' },
                            }}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                            />
                            <TextField                                
                            type="number"
                                id='length'
                                name='length'
                                placeholder='Length'
                                value={length}
                                label='Price'
                            variant="outlined"
                            size='small'
                            InputLabelProps={{
                                style: { color: '#1976D2', borderColor: 'white' },
                            }}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                                onChange={(e) => setLength(e.target.value)}
                                required
                                className='sm:w-20 '
                            />
                            <TextField                                type="number"
                                id='weidth'
                                name='width'
                                placeholder='Width'
                                value={width}
                                label='Price'
                            variant="outlined"
                            size='small'
                            InputLabelProps={{
                                style: { color: '#1976D2', borderColor: 'white' },
                            }}
                            InputProps={{
                                style: { color: 'white', borderColor: 'white' },
                            }}
                                onChange={(e) => setWidth(e.target.value)}
                                required
                                className='sm:w-20 '
                            />
                            <select name="dimenstionUnit" id="stock" className='sm:w-[6.5vw] w-[50vw] h-[5vh] rounded-lg text-sm' value={dimenstionUnit} onChange={(e) => setDimenstionUnit(e.target.value)} required>
                                <option value="">Choose unit</option>
                                <option value="cm">centimeter</option>
                                <option value="m">meter</option>
                                <option value="mm">millimeter</option>
                                <option value="inch">inch</option>
                                <option value="foot">foot</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex items-center justify-between my-4'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="weight">Weight:- </label>
                        <div>
                            <TextField                                type="number"
                                id='weight'
                                name='weight'
                                placeholder='weight'
                                value={weight}
                                label='weight'
                                variant="outlined"
                                size='small'
                                // color='primary'
                                InputLabelProps={{
                                    style: { color: '#1976D2', borderColor: 'white' },
                                }}
                                InputProps={{
                                    style: { color: 'white', borderColor: 'white' },
                                }}
                                onChange={(e) => setWeigth(e.target.value)}
                                required
                            />
                            {/* <br /> */}
                            <select name="weightUnit" id="weight"  className='sm:w-[8vw] w-[25vw] h-[5vh] rounded-lg text-sm' value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} required>
                                <option value="">Choose weight unit</option>
                                <option value="gm">gm</option>
                                <option value="Kg">Kg</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex justify-evenly mt-10'>
                    <Button
                    variant='contained' 
                    endIcon={<FileUpload />} 
                    size='large'  
                    type='submit' 
                    >Update</Button>
                    <Button 
                    variant='contained' endIcon={<Cancel />} size='large' 
                    onClick={() => navigate('/profile')}
                    >Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductUpdate
