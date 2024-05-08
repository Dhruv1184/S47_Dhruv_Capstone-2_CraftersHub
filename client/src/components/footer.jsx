import React from 'react'
import logo from '../assets/CraftersHubLogo.png'

import { Instagram, Facebook, LinkedIn, Twitter, GitHub } from '@mui/icons-material'
const Footer = () => {
  return (
    <div className='text-[white] bg-black p-4'>
      <div>
        <div className='flex text-center items-center justify-center pt-[1vh]'>
            <img src={logo} className='h-[100px]' alt="logo" />
            <h1 className='text-2xl font-serif font-semibold'>Crafters Hub</h1>
        </div>
        <div className='flex flex-col items-center justify-center text-[1.3vh]'>
            <h1 className='text-base'>Developed by <span className='text-[3vh] ml-[0.4vw] font-serif font-semibold'>Dhruv Khandelwal</span></h1>
            <h1 className='text-base font-serif font-semibold'>dhruvkhandelwal1184@gmail.com</h1>
            <h1 className='text-base'>Connect with me</h1>
            <div className='flex items-center justify-center text-[2.5vh]'>
                <h1 className='m-[2vh_0.5vw]'><a href="https://www.linkedin.com/in/dhruv-khandelwal-76121a291/"><LinkedIn style={{fontSize:'5vh'}}/></a></h1>
                <h1 className='m-[2vh_0.5vw]'><a href="https://www.facebook.com/profile.php?id=100069932894124 "><Facebook style={{fontSize:'5vh'}}/></a></h1>
                <h1 className='m-[2vh_0.5vw]'><a href="https://www.instagram.com/dhruvkhandelwal1184/?igsh=MTN3aGs2am1paDU2Yw%3D%3D"><Instagram style={{fontSize:'5vh'}}/></a></h1>
                <h1 className='m-[2vh_0.5vw]'><a href="https://twitter.com/dkhandelwal1184?t=WdEvalcoRWvDvA-eRrom9A&s=09"><Twitter style={{fontSize:'5vh'}}/></a></h1>
                <h1 className='m-[2vh_0.5vw]'><a href="https://github.com/Dhruv1184"><GitHub style={{fontSize:'5vh'}}/></a></h1>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
