import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, InputAdornment,Alert, AlertTitle } from '@mui/material/'
import { Email, Password } from '@mui/icons-material'
import loginimg from '../assets/login.jpg'
const ForgetPassword = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const [info, setInfo] = useState('')


    const onSendbtn = (e) => {
        e.preventDefault()
        axios.post(`https://s47-dhruv-capstone-2-craftershub-1.onrender.com/forgotPassword`, { username: email })
            .then((res) => {
                console.log(res)
                setInfo('Please check your mail')
                // navigate('/login')
            })
            .catch(err => console.log(err))
    }
    console.log(email);
  window.addEventListener('click', () => {
    if (info) {
        setInfo('')
        navigate('/login')
    }
  })
    return (
        <div className='flex'>
            <div className=' hidden sm:block'>
                <img src={loginimg} alt="login image"
                    className='h-imageHeight w-imageWidth'
                />
            </div>
        {info &&
        <Alert severity="info" style={{ fontSize: "3vh", position: 'absolute', right: '11vw', borderRadius: '20px' }}>
          <AlertTitle style={{ fontWeight: '900' }}>Info</AlertTitle>
          {info}
        </Alert>}
            <div className="flex flex-col w-40vw items-center justify-center text-center mx-auto max-[640px]:my-10">
                <Password color='primary' sx={{ fontSize: 80 }}/>
                <h1 className='text-5xl font-thin mt-1 mb-10 font-serif '>Forget Password</h1>
                <form onSubmit={(e) => onSendbtn(e)}>
                    <div>
                        <TextField
                            type="email"
                            required
                            placeholder='Enter your email'
                            label="Email Address"
                            variant="outlined"
                            size='medium'
                            color='primary'
                            className='h-20'
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Email color='primary' />
                                    </InputAdornment>
                                )
                            }}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <Button 
                    color='primary'
                    variant='contained'
                    size='large'
                    onClick={(e)=>onSendbtn(e)}
                    >Send</Button>
                </form>
            </div>
        </div>
    )
}

export default ForgetPassword
