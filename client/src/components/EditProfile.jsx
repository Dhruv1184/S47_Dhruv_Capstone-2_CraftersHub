import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

// MUI component
import { Button,TextField, Alert, AlertTitle } from '@mui/material'
import { Cancel, FileUpload } from '@mui/icons-material'
const EditProfile = () => {
    const [name, setName] = useState('')
    const [Email, setEmail] = useState('')
    const [contact, setContact] = useState('')
    const [address, setAddress] = useState('')
    const [ownerImg, setOwnerImg] = useState(null)
    const [ownerImgPreview, setOwnerImgPreview] = useState(null);
    const navgate = useNavigate()
    const { id } = useParams()
    const [alert,setAlert] = useState('')
    const [success,setSuccess] = useState('')
    useEffect(() => {
        const getData = async () => {
            try {
                console.log(id);
                const profile = await axios.get(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/update/${id}`)
                console.log(profile);
                setName(profile.data.name)
                setEmail(profile.data.username)
                setContact(profile.data.contact ? profile.data.contact : '')
                setAddress(profile.data.address ? profile.data.address : '')
                setOwnerImg(profile.data.ownerImg[0] ? profile.data.ownerImg[0] : null)
            } catch (error) {
                console.log(error);
            }

        }
        getData()
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setOwnerImg(file)
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            console.log("image", imageUrl);
            setOwnerImgPreview(imageUrl);
        };
        reader.readAsDataURL(file);
    }

    const handelUpdate = (e) => {
        e.preventDefault()

        if (contact.length == 10 || contact.length == 0) {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('username', Email)
            formData.append('contact', contact)
            formData.append('address', address)
            if (ownerImg) {
                formData.append('ownerImg', ownerImg)
            }

            axios.put(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/update/${id}`, formData)
                .then((res) => {
                    console.log(res);
                    setSuccess("profile update Successfully")
                    // navgate('/profile')
                }).catch((err) => {
                    console.log(err);
                })
        } else {
            setAlert("Contact no. must be valid")
        }
    }
    
    if(alert){
        setTimeout(()=>{
            setAlert('')
        },3000)
    }
    
    if(success){
        setTimeout(()=>{
            setSuccess('')
            navgate('/profile')
        },1000)
    }
    return (
        <div className='bg-form sm:h-[100vh] sm:w-[100vw] sm:bg-cover h-screen	w-screen sm:pt-[6vh] sm:pl-16'>
             {alert && <Alert severity="error" style={{ fontSize: "3vh", position: 'absolute', textAlign: 'center',top:'0', left: '35vw', borderRadius: '20px' }}>
                <AlertTitle style={{ fontWeight: '900' }}>error</AlertTitle>
                {alert}
            </Alert>}

             {success && <Alert severity="success" style={{ fontSize: "3vh", position: 'absolute', textAlign: 'center',top:'0', left: '35vw', borderRadius: '20px' }}>
                <AlertTitle style={{ fontWeight: '900' }}>success</AlertTitle>
                {success}
            </Alert>
            }
            <div className='border bg-teal-950 shadow-[1px_1px_5px_3px]  sm:w-[40vw] sm:h-[90vh] sm:flex flex-col p-[2vh] text-center text-lg '>
                <h1 className='text-5xl font-serif text-[white] mb-6'>Update profile</h1>
                <form encType="multipart/form-data">
                    <div className='flex items-center justify-between my-2 w-full'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="name">Name:-</label>
                        <TextField 
                        type="text" 
                        value={name} 
                        label='Name'
                        variant="outlined"
                        size='large'
                        InputLabelProps={{
                            style: { color:  '#1976D2'  },
                        }}
                        InputProps={{
                            style: { color: 'white' },
                        }}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter your name' />
                    </div>
                    <div className='flex items-center justify-between my-2 w-full'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="email">Email:-</label>
                        <TextField 
                        type="text" 
                        name='email'
                        label='Email'
                        variant="outlined"
                        size='large'
                        InputLabelProps={{
                            style: { color:  '#1976D2' },
                        }}
                        InputProps={{
                            style: { color: 'white' },
                        }} 
                        value={Email} readOnly />
                    </div>
                    <div className='flex items-center justify-between my-2 w-full'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="contact">Contact:-</label>
                        <TextField 
                        type="number" 
                        name='contact' 
                        label='Contact no.'
                        variant="outlined"
                        size='large'
                        InputLabelProps={{
                            style: { color: '#1976D2' },
                        }}
                        InputProps={{
                            style: { color: 'white' },
                        }}
                        value={contact} 
                        placeholder='Enter your contact no.' onChange={(e) => setContact(e.target.value)} />
                    </div>
                    <div className='flex items-center justify-between my-2 w-full'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="address">Addess:-</label>
                        <TextField 
                        type="text" 
                        name='address' 
                        value={address} 
                        label='Address'
                        variant="outlined"
                        size='large'
                        InputLabelProps={{
                            style: { color: '#1976D2' },
                        }}
                        InputProps={{
                            style: { color: 'white' },
                        }}
                        onChange={(e) => setAddress(e.target.value)} placeholder='Enter your address' />
                    </div>
                    <div className='flex items-center justify-between my-2 w-full'>
                        <label className='sm:text-2xl font-serif text-[white]' htmlFor="ownerImg">Your image</label>
                        <div>
                        {ownerImg && 
                        <img
                        className='sm:h-[25vh] sm:w-[20vw] h-[35vh] w-[50vw] mx-auto'
                        src={ownerImgPreview ? ownerImgPreview : ownerImg} 
                        alt="ownerImg" />
                        }
                        <input 
                        type="file" 
                        name="ownerImg" 
                        className='sm:w-[20vw] w-[50vw] text-[white]'
                        onChange={handleFileChange} />
                        </div>
                    </div>
                    <div className='flex justify-around mt-4'>
                    <Button
                    variant='contained' 
                    size='large'
                    endIcon={<FileUpload />}
                    onClick={handelUpdate}
                    >Update</Button>
                    <Button 
                    variant='contained'
                    size='latge'
                    endIcon={<Cancel />}
                    onClick={() => navgate('/profile')}
                    >Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfile
