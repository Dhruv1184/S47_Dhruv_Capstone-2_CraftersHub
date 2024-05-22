import axios from 'axios'
import React, { useEffect, useState,useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
// import useConversation from '../Zustand/getConversation'
import Footer from './footer'
//MUI component
import { Button } from '@mui/material'
import { ArrowForwardIos,ArrowBackIos, ArrowCircleUp } from '@mui/icons-material'
const Product = () => {
    const [Data, setData] = useState([])
    const [imageIndexes, setImageIndexes] = useState([]);
    const [error, setError] = useState('')
    const [userData, setUserData] = useState([])
    const navigate = useNavigate()
    const reference = useRef(null)
    // const {setNavbarOption} = useConversation()

    //fetch user
    const fetchUser = async () => {
        try {
            const id = localStorage.getItem('id')

            const response = await axios.get(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/login/success`, (id) ? {
                headers: {
                    'Authorization': `Bearer ${id}`,
                }
            } : { withCredentials: true })
            console.log("response", response);
            setUserData(response)
        } catch (error) {
            console.log(error);
            navigate('/error')
        }
    }
    console.log(userData);

    //fetch Data
    // setNavbarOption('product')
    useEffect(() => {
        const fetchData = async () => {
            setError('')
            try {
                const res = await axios.get(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/product`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem('email')
                    }
                })
                setData(res.data)
                setImageIndexes(res.data.map(() => 0));
            } catch (error) {
                setError(error.response.data);
            }
        }
        fetchUser()
        fetchData()
    }, [])
    console.log(Data);
    console.log(error);

    //handle image index 
    const countIncrease = (productIndex) => {
        const newIndexes = [...imageIndexes];
        if (newIndexes[productIndex] === Data[productIndex].productImg.length - 1) {
            newIndexes[productIndex] = 0;
        } else {
            newIndexes[productIndex]++;
        }
        setImageIndexes(newIndexes);
    };

    const countDecrease = (productIndex) => {
        const newIndexes = [...imageIndexes];
        if (newIndexes[productIndex] === 0) {
            newIndexes[productIndex] = Data[productIndex].productImg.length - 1;
        } else {
            newIndexes[productIndex]--;
        }
        setImageIndexes(newIndexes);
    };

    //put focus on navbar
    const putFocus = () => {
        console.log("focus");
        if (reference.current) {
            reference.current.scrollIntoView({ behavior: 'smooth', block: 'start' });        }
      };
    return (
        <div >
            {error ?
                <div>
                    <h1 className='text-xl text-center text-[#001F2B]'>{error}</h1>
                </div> :
                <div className='overflow-scroll scrollbar-thin scrollbar-webkit'>
                    <div >
                        <Navbar ref={reference} option='product'/>
                    </div>
                    <div className='fixed bottom-10 right-10 cursor-pointer' onClick={putFocus}>
                        <ArrowCircleUp style={{fontSize:'7vh', color:'#1870CB'}}/>
                    </div>
                    <h1 className=' text-4xl sm:text-5xl text-[#001F2B] font-serif font-medium m-[2vh] text-center'>Product</h1>
                    {Data.map((item, index) => {
                        return (
                            <div key={item._id} className='sm:flex py-[3vh] mx-auto px-[5vw] justify-evenly sm:m-[2vh] border shadow-[#1976D2] shadow-[1px_1px_5px_3px] sm:w-[75vw] w-[90vw] sm:mx-auto  sm:my-6 '>
                                <div className='flex items-center'>
                                    <Button
                                    onClick={() => countDecrease(index)}><ArrowBackIos/></Button>
                                    <img src={item.productImg[imageIndexes[index]]} alt="Product image" className='sm:h-[300px] sm:w-[350px] h-[200px] w-[200px] ' />
                                    <Button
                                    onClick={() => countIncrease(index)}><ArrowForwardIos/></Button>
                                </div>
                                <div className='sm:flex sm:items-center my-10 mx-auto'>
                                    <div className='sm:text-xl'>
                                        <span>Product name:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{item.productName}</span></span>
                                        <br />
                                        <span>Price:- Rs. <span className=' sm:text-2xl text-xl font-serif text-[#001F2B] font-semibold'>{item.price}</span></span>
                                        <br />
                                        <span>Description:- <span className=' sm:text-2xl text-xl font-serif text-[#001F2B] font-semibold'>{item.description}</span></span>
                                        <br />
                                        <span>Material:- <span className=' sm:text-2xl text-xl font-serif text-[#001F2B] font-semibold'>{item.material}</span></span>
                                        <br />
                                        <span>Dimensions:- <span className=' sm:text-2xl text-xl font-serif text-[#001F2B] font-semibold'>{item.dimensions}</span></span>
                                        <br />
                                        <span>Weight:- <span className=' sm:text-2xl text-xl font-serif text-[#001F2B] font-semibold'>{item.weight}</span></span>
                                        <br />
                                        {item.stock > 0 ?
                                            <h1 className='text-2xl sm:text-3xl font-serif font-semibold mt-6 text-center'>{item.stock > 10 ? <span className='text-[#270]'>In stock</span> :
                                                <span className='text-[#FFCC00]'>Limited stock available</span>}</h1>
                                            // {item.stock > 10 ? <h1></h1> : <h1></h1>}
                                            : <h1 className='text-3xl text-center text-[#D8000C] font-serif font-semibold mt-6'> Out of stock</h1>}
                                        <br />
                                        {item.stock > 0 &&
                                            <div className='flex justify-center'>
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    size='large'
                                                    onClick={() => navigate(`/book/${item._id}`)}>Buy Now</Button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            <Footer/>
        </div>
    )
}

export default Product
