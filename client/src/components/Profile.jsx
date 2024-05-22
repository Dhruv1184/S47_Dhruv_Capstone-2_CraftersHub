import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Alert, AlertTitle } from '@mui/material'
import { AccountCircle, Add, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import Footer from './footer'
const Profile = () => {
  const [userData, setUserData] = useState([])
  const navigate = useNavigate()
  const [product, setProduct] = useState([])
  const [imageIndexes, setImageIndexes] = useState([]);
  const [alert, setAlert] = useState(false)

  useEffect(() => {
    // setNavbarOption('profile')
    const fetchUser = async () => {
      try {
        //Get User
        const id = localStorage.getItem('id')

        const userResponse = await axios.get(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/login/success`, (id) ? {
          headers: {
            'Authorization': `Bearer ${id}`,
          }
        } : { withCredentials: true })

        //Get product
        const productResponse = await axios.get(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/product`)
        const [userDataResponse, productDataResponse] = await Promise.all([userResponse, productResponse]);

        // Extract data from responses
        const userData = userDataResponse.data.user;
        const productData = productDataResponse.data;
        setUserData(userData);
        // Filter product data based on user's username
        const filteredData = productData.filter(item => item.email === userData.username);

        setProduct(filteredData)
        setImageIndexes(filteredData.map(() => 0));
      } catch (error) {
        console.log(error);
        navigate('/error')
      }
    }
    fetchUser()
  }, [])

  console.log("user", userData)
  console.log("filtered", product);

  const countIncrease = (productIndex) => {
    const newIndexes = [...imageIndexes];
    if (newIndexes[productIndex] === product[productIndex].productImg.length - 1) {
      newIndexes[productIndex] = 0;
    } else {
      newIndexes[productIndex]++;
    }
    setImageIndexes(newIndexes);
  };

  const countDecrease = (productIndex) => {
    const newIndexes = [...imageIndexes];
    if (newIndexes[productIndex] === 0) {
      newIndexes[productIndex] = product[productIndex].productImg.length - 1;
    } else {
      newIndexes[productIndex]--;
    }
    setImageIndexes(newIndexes);
  };

  const DeleteProduct = async (id) => {
    try {
      await axios.delete(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/product/${id}`)
      window.location.reload()
    } catch (error) {
      console.log(error);
    }
  }
  
  const addValidation = async () => {
    try {
      if (userData.name && userData.contact && userData.address) {
        navigate('/form');
      } else {
        await setAlert(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  console.log(alert);
if(alert){
  setTimeout(()=>{
    setAlert(false)
  },3000)
}

  return (
    <div>
      <Navbar option='profile' />
      {alert && <Alert severity="error" style={{ fontSize: "3vh", position: 'absolute', textAlign:'center',left:'35vw', borderRadius: '20px' }}>
        <AlertTitle style={{ fontWeight: '900' }}>Error</AlertTitle>
        Please complete your profile
      </Alert>
      }
      <div className='sm:flex border shadow-[#1976D2] shadow-[1px_1px_5px_3px] my-10 items-center mx-4'>
        {userData.ownerImg && userData.ownerImg.length > 0 ?
          <img
            className='sm:h-[40vh] sm:w-[20vw] rounded-[100%] sm:ml-30 h-[35vh] w-[50vw] mx-auto my-[5vh]'
            src={userData.ownerImg} alt="owner Image"
          />
          :
          <div className='sm:ml-[10vw] text-center '>
            <AccountCircle
              color='inherit'
              style={{ fontSize: "40vh", color: 'gray', }}
            />
          </div>}
        <div className='flex flex-col my-10 mx-auto justify-center'>
          <span className='sm:text-xl text-xl font-medium text-[#001F2B]'>Name:- <span className='sm:text-2xl text-xl text-[#001F2B] font-serif font-semibold'>{userData.name}</span></span>
          <br />
          <span className='sm:text-xl text-xl font-medium text-[#001F2B]'>Email:- <span className='sm:text-2xl text-xl text-[#001F2B] font-serif font-semibold'>{userData.username}</span></span>
          <br />
          <span className='sm:text-xl text-xl font-medium text-[#001F2B]'>Contact:- <span className='sm:text-2xl text-xl text-[#001F2B] font-serif font-semibold'>{userData.contact ? userData.contact : "-----"}</span></span>
          <br />
          <span className='sm:text-xl text-xl font-medium text-[#001F2B]'>Address:- <span className='sm:text-2xl text-xl text-[#001F2B] font-serif font-semibold'>{userData.address ? userData.address : "-----"}</span></span>
          <br />
          <div className='mx-auto'>
            <Button
              variant='contained'
              // color=''
              size='large'
              style={{ fontSize: "2vh" }}
              onClick={() => navigate(`/updateProfile/${userData._id}`)}>Edit</Button>
          </div>
        </div>
      </div>
      <br />
      <hr className='h-1 m-4 shadow-[1px_1px_4px_3px] shadow-[#001F2B] rounded-full' />
      {/* History */}
      <h1 className='text-center sm:text-6xl text-4xl font-serif font-semibold text-[#001F2B]'>History</h1>
      <Button
        variant='contained'
        color='primary'
        size='large'
        style={{ marginLeft: '8vw' }}
        className='mb-5'
        endIcon={<Add />}
        onClick={addValidation}>Add</Button>

      {product.length > 0 ?
        <div className='my-3'>
          {product.map((item, index) => {
            return (
              <div key={item._id} className='sm:flex py-[1vh] mx-auto my-3 px-[2vw] justify-evenly sm:m-[2vh] border shadow-[#1976D2] shadow-[1px_1px_5px_3px] sm:w-[70vw] w-[90vw] sm:mx-auto  sm:my-6 '>
                <div className='flex items-center justify-center mt-2'>
                  <Button onClick={() => countDecrease(index)}><ArrowBackIos /></Button>
                  <img src={item.productImg[imageIndexes[index]]} alt="ProductImg" className='sm:h-[250px] sm:w-[300px] h-[200px] w-[200px] ' />
                  <Button onClick={() => countIncrease(index)}><ArrowForwardIos /></Button>
                </div>
                <div className='sm:flex sm:items-center my-10 mx-auto'>
                  <div className='sm:text-lg'>
                    <span>Product name:- <span className='sm:text-xl text-xl font-serif font-semibold'>{item.productName}</span></span>
                    <br />
                    <span>Price:- <span className='sm:text-xl text-xl font-serif font-semibold'>{item.price}</span></span>
                    <br />
                    <span>Description:- <span className='sm:text-xl text-xl font-serif font-semibold'>{item.description}</span></span>
                    <br />
                    <span>Material:- <span className='sm:text-xl text-xl font-serif font-semibold'>{item.material}</span></span>
                    <br />
                    <span>Dimensions:- <span className='sm:text-xl text-xl font-serif font-semibold'>{item.dimensions}</span></span>
                    <br />
                    <span>Weight:- <span className='sm:text-xl text-xl font-serif font-semibold'>{item.weight}</span></span>
                    <br />
                    {item.stock > 0 ?
                      <h1 className='text-2xl sm:text-3xl font-serif font-semibold mt-6 text-center' >{item.stock > 10 ? <span className='text-[#270]'> In stock </span>:
                       <span className='text-[#FFCC00]'>Limited stock available</span>}</h1>
                      // {item.stock > 10 ? <h1></h1> : <h1></h1>}
                      : <h1 className='text-3xl text-center text-[#D8000C] font-serif font-semibold mt-6'> Out of stock</h1>}
                    <br />
                    <div className='flex justify-around'>
                    <Button variant='contained' size='medium' onClick={() => navigate(`/updateProduct/${item._id}`)}>Update</Button>
                    <Button variant='contained' size='medium' onClick={() => DeleteProduct(item._id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        : <p className='text-center font-serif text-[#001F2B] text-5xl m-12'>Data not found</p>}
        <Footer/>
    </div>

  )
}

export default Profile
