import React, { useEffect, useState, forwardRef } from 'react'
import logo from '../assets/CraftersHubLogo.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material'
import {Category,Chat, AccountCircle,Logout, Login,LockOpen} from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu' 
// import useConversation from '../Zustand/getConversation'

const Navbar = forwardRef(({option}, ref) => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)
  const isMobile = useMediaQuery('(max-width:600px)')
  
  //Menu open and close
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }
  console.log("option",option);
  //fetch User
  const fetchUser = async () => {
    const id = localStorage.getItem('id')

    try {
      const response = await axios.get(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/login/success`, {
        headers: id ? { 'Authorization': `Bearer ${id}` } : {},
        withCredentials: true
      });
      setUserData(response.data.user)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  //Handle logout
  const logout = () => {
    localStorage.clear()
    window.open(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/logout`, "_self")
  }

  // console.log(navbarOption);
  return (
    <div className='flex justify-between items-center p-3 shadow-[1px_1px_5px_3px] shadow-[#1976D2] w-full text-center' ref={ref} tabIndex={0}>
      <div className='flex items-center gap-x-7 cursor-pointer' onClick={() => navigate('/')}>
        <img src={logo} alt="logo" className='h-16' />
        <h1 className='text-3xl font-serif font-bold text-[#001F2B]'>Crafters Hub</h1>
      </div>
      <div className='flex items-center'>
        {isMobile ? (
          <div>
            <IconButton
              aria-label="menu"
              color="primary"
              onClick={openMenu}
              sx={{ ml: 2 }}
            >
              <MenuIcon style={{ fontSize: "7vh" }} />
            </IconButton>
          </div>
        ) : (
          <div className='flex gap-x-5 items-center'>
            {Object.keys(userData)?.length > 0 ? (
              <>
                <span className='text-2xl font-serif text-[#001F2B]'>Welcome <span className='font-extrabold text-3xl'>{userData.name}</span></span>

                <Button
                  variant= {option == 'product'? 'outlined': 'contained'}
                  color='primary'
                  endIcon={<Category/>}
                  onClick={() => {
                    // setNavbarOption('product')
                    navigate('/product')
                  }}>Products</Button>
                <Button
                  variant={option == 'profile'? 'outlined': 'contained'}
                  color='primary'
                  endIcon={<AccountCircle/>}
                  onClick={() => {
                    // setNavbarOption('profile')
                    navigate('/profile')
                  }}>Profile</Button>
                <Button
                  variant={option == 'chat'? 'outlined': 'contained'}
                  color='primary'
                  endIcon={<Chat/>}
                  onClick={() => {
                    // setNavbarOption('chat')
                    navigate('/chat')
                  }}>Chats</Button>
                <Button
                endIcon={<Logout/>} 
                variant='contained' 
                color='primary' 
                onClick={logout}>Logout</Button>
              </>
            ) : (
              <div>
                <Button 
                 style={{marginRight:'2vw'}}
                 variant='contained' 
                 color='primary' 
                 size='large'
                 endIcon={<Login/>}
                 onClick={() => navigate('/login')}>Login</Button>
                <Button
                 style={{marginRight:'2vw'}}
                variant='contained' 
                color='primary'
                size='large' 
                endIcon={<LockOpen/>}
                onClick={() => navigate('/signup')}>Signup</Button>
              </div>
            )}
          </div>
        )}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
        >
          <span className='font-serif text-[#001F2B] m-3'>Welcome <span className='font-extrabold'>{userData.name}</span></span>
          {Object.keys(userData)?.length > 0 ? (
            <div>
              <MenuItem onClick={() => navigate('/product')}>Products</MenuItem>
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => navigate('/chat')}>Chats</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </div>
          ) : (
            <div>
              <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
              <MenuItem onClick={() => navigate('/signup')}>Signup</MenuItem>
            </div>
          )}
        </Menu>
      </div>
    </div>
  )
})

export default Navbar
