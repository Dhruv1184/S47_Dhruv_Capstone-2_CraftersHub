import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import signupImg from '../assets/signup.jpg'
import logo from '../assets/CraftersHubLogo.png'

//MUI components
import { TextField, Alert, Button, InputAdornment, IconButton, AlertTitle } from '@mui/material/'
import { Visibility, VisibilityOff, Login, PermIdentity, Lock, Google } from '@mui/icons-material';
const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpGenerated, setOtpGenterated] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const [validOtp, setValidOTP] = useState('')
  const [error, setError] = useState('')
  const [warn, setWarn] = useState('')

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const onSignupBtn = (e) => {
    e.preventDefault()
    if (otpGenerated) {
      console.log(name, password, email);
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      if (password == confirmPassword) {
        if(passwordRegex.test(password)){

          axios.post(`${import.meta.env.VITE_FRONTEND_URL}/signup`, {
            name,
          username: email,
          password,
          otp,
          validOtp
        }).then(res => {
          // console.log(res);
          localStorage.setItem("id", res.data._id)
          navigate('/')
        }).catch((error) => {
          console.log("post error", error.response.data);

          setError(error.response.data)
        })
      }else{
        setError('Password must be at least 8 characters long and contain at least one letter, one number, and one special character.')
      }
      } else {
        setError('Password not match ')
      }
    } else {
      setError('Please generate OTP')
    }
  }

  window.addEventListener('click', () => {
    setWarn('')
    setError('')
  })
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = localStorage.getItem('id')

        const response = await axios.get(`${import.meta.env.VITE_FRONTEND_URL}/login/success`, (id) ? {
          headers: {
            'Authorization': `Bearer ${id}`,
          }
        } : { withCredentials: true })
        console.log("response", response);
        navigate('/')
      } catch (error) {
        console.log("error", error);
      }
    }
    fetchUser()
  }, [])

  const generateOtp = () => {
    setValidOTP('')
    if (email) {
      axios.post(`${import.meta.env.VITE_FRONTEND_URL}/otpVerification`, { email })
        .then(res => {
          setValidOTP(res.data.validOTP)
          setOtpGenterated(true)

          // alert('OTP sent to your email')
          setWarn('OTP sent to your email')
        }).catch(err => {
          console.log(err);
        })
    }
  }
  console.log(validOtp);
  console.log(error);
  const googlesignuup = () => {
    window.open(`${import.meta.env.VITE_FRONTEND_URL}/auth/google/callback`, "_self")
  }
  return (
    <div className="flex">
      {/* Error alert */}
      {error &&
        <Alert severity="error" style={{ fontSize: "3vh", position: 'absolute', left: '11vw', borderRadius: '20px' }}>
          <AlertTitle style={{ fontWeight: '900' }}>Error</AlertTitle>
          {error}
        </Alert>}

      {/* Info Alert */}
      {warn &&
        <Alert severity="info" style={{ fontSize: "3vh", position: 'absolute', left: '11vw', borderRadius: '20px' }}>
          <AlertTitle style={{ fontWeight: '900', fontSize: '2vw' }}>Info</AlertTitle>
          {warn}
        </Alert>}

      <div className='w-signup_Width flex flex-col w-40vw items-center justify-center text-center ml-10 max-[640px]:mx-auto'>
        
        <img src={logo} alt="" className='mx-auto h-40' />

        <h1 className='text-5xl font-light mt-2 mb-10 font-serif'>SignUp</h1>
        <form onSubmit={(e) => onSignupBtn(e)}>
          <div>
            <TextField
              type="text"
              name="name"
              id="name"
              placeholder='Enter your name'
              onChange={(e) => setName(e.target.value)}
              label='Name'
              variant="outlined"
              size='small'
              color='primary'
              className='h-12 w-80'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PermIdentity color='primary' />
                  </InputAdornment>
                )
              }} />
          </div>
          {/* <div> */}
          <TextField
            type="email"
            name="username"
            required
            placeholder='Enter your email'
            onChange={(e) => setEmail(e.target.value)}
            label='Email'
            variant="outlined"
            size='small'
            color='primary'
            className='h-12 w-80'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* <Email color='primary' /> */}
                  {/* <div className='mb-3'> */}
                  <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    // className='w-full'
                    onClick={() => generateOtp()}>Generate OTP</Button>
                  {/* </div> */}
                </InputAdornment>
              )
            }}
          />
          <br />
          <div>
            <TextField
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              variant="outlined"
              size="small"
              color="primary"
              className='h-12 w-80'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility color='primary' /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}

            />
          </div>
          <div>
            <TextField
              type={showConfirmPassword ? 'text' : 'password'}
              name="confrmpassword"
              required
              placeholder='Enter confirm password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm Password"
              variant="outlined"
              size="small"
              color="primary"
              className='h-12 w-80'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                      {showConfirmPassword ? <Visibility color='primary' /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {otpGenerated &&
            <div>
              <TextField
                type="text"
                name='otp'
                required
                placeholder='Please Enter a OTP'
                onChange={(e) => setOtp(e.target.value)}
                label='Enter OTP'
                variant="outlined"
                size="small"
                color="primary"
                className='h-[60px] w-80'
              />
            </div>}
          <Button
            type='submit'
            variant="contained"
            size='large'
            endIcon={<Login />}
            className='w-full'
          >SignUp</Button>
        </form>

        <div className="flex text-2xl m-2.5">
          <hr className="h-1 w-44 m-4 bg-slate-300" />
          <span>or</span>
          <hr className="h-1 w-44 m-4 bg-slate-300" />
        </div>

        <Button
          color='primary'
          size='large'
          variant='contained'
          startIcon={<Google />}
          className='w-[324px]'
          onClick={googlesignuup}>Continue wth google</Button>
        <p className='text-1xl mt-2'>Not have an account? <Link to={'/login'} className="text-signup">Login</Link></p>
      </div>
      <div className=' hidden sm:block'>
      <img src={signupImg} alt="SignUP" className="h-imageHeight w-imageWidth " />
      </div>
    </div>
  )
}

export default Signup
