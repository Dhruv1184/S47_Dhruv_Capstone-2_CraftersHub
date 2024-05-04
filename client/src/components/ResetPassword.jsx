import React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import { Button, TextField, InputAdornment, IconButton, Alert, AlertTitle } from '@mui/material/'
import { Visibility, VisibilityOff, LockReset, PublishedWithChanges } from '@mui/icons-material';

import loginimg from '../assets/login.jpg'

const ResetPassword = () => {
  const { id, token } = useParams()
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const OnSubmitBtn = (e) => {
    e.preventDefault()
    if (password != rePassword) {
      return setError("password not match")
    }

    axios.post(`${import.meta.env.VITE_FRONTEND_URL}/resetPassword/${id}/${token}`, { password })
      .then((res) => {
        console.log(res);
        navigate('/login')
      }).catch(err => console.log(err))
  }

  window.addEventListener('click', () => {
    setError('')
  })
  return (
    <div className='flex'>

      <div className=' hidden sm:block'>
        <img src={loginimg} alt="login image"
          className='h-imageHeight w-imageWidth'
        />
      </div>
      {error &&
        <Alert severity="error" style={{ fontSize: "3vh", position: 'absolute', right: '11vw', borderRadius: '20px' }}>
          <AlertTitle style={{ fontWeight: '900' }}>Error</AlertTitle>
          {error}
        </Alert>}
    
      <div className='w-signup_Width flex flex-col w-40vw items-center justify-center text-center  mx-auto max-[640px]:my-10 '>
        <LockReset
          color='primary'
          sx={{ fontSize: 80 }}
          variant='contained'
          className="mx-auto mb-8" />
        <h1 className='text-5xl font-light mt-1 mb-10 font-serif'>Reset Password</h1>
        <form onSubmit={(e) => OnSubmitBtn(e)}>
          <div>
            {/* <label htmlFor="Newpassword">New password:- </label> */}
            <TextField
              type={showPassword ? 'text' : 'password'}
              name="Newpassword"
              required
              label="New Password"
              variant="outlined"
              size="medium"
              color="primary"
              className='h-20 w-80'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility color='primary' /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder='Enter a new password'

              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            {/* <label htmlFor="RePassword">Confirm password:- </label> */}
            <TextField
              type={showConfirmPassword ? 'text' : 'password'}
              name="RePassword"
              required
              placeholder='Enter a confirm password'
              label="Confirm Password"
              variant="outlined"
              size="medium"
              color="primary"
              className='h-20 w-80'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                      {showConfirmPassword ? <Visibility color='primary' /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setRePassword(e.target.value)} />
          </div>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            size='large'
            className='w-full'
            endIcon={<PublishedWithChanges />}
          >Change</Button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
