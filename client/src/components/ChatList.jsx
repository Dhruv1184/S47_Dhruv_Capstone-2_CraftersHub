import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import useConversation from '../Zustand/getConversation'
import SendMessage from '../hooks/SendMessage'
import getMessages from '../hooks/getMessages'
import { useSocketContext } from '../socket/Socket'
import useListenMessage from '../hooks/useListenMessage'
// import Footer from './footer'
import { TextField, Button } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
const ChatList = () => {
    const [user, setUser] = useState([])
    const [list, setList] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [fechData, setFetchData] = useState(false)
    const navigate = useNavigate()
    const { selectedConversation, setSelectedConversation } = useConversation()
    const { sendMessage } = SendMessage()
    const { messages } = getMessages(user)
    const lastMessageRef = useRef()
    const { onlineUser } = useSocketContext()

    // console.log("online",onlineUser);
    useListenMessage()
    useEffect(() => {
        // setNavbarOption('chat')
        const fetchUser = async () => {
            try {
                const id = localStorage.getItem('id')

                const response = await axios.get(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/login/success`, (id) ? {
                    headers: {
                        'Authorization': `Bearer ${id}`,
                    }
                } : { withCredentials: true })
                // console.log("response", response);
                setFetchData(true)
                setUser(response.data.user)
            } catch (error) {
                console.log(error);
                navigate('/error')
            }
        }
        console.log(user);

        const fetchList = async () => {
            try {
                const list = await axios.get(`https://s47-dhruv-capstone-2-craftershub-2.onrender.com/getOtherUser`, {
                    params: {
                        senderId: user._id
                    }
                })
                console.log(list);
                setList(list.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchList()

        fetchUser()

        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [fechData, messages])

    const OnsubmitBtn = async (e) => {
        e.preventDefault()
        if (!newMessage) return
        await sendMessage(newMessage, user)
        setNewMessage("")
    }

    function padzero(number) {
        return number.toString().padStart(2, 0)
    }
    const abstractTime = (number) => {
        const date = new Date(number)
        const hour = padzero(date.getHours())
        const min = padzero(date.getMinutes())
        return `${hour}:${min}`
    }
    console.log("onlineUser", onlineUser);
    return (
        <div className='h-[100vh]'>
            <Navbar option='chat' />
            <div className='flex justify-evenly my-3 border ' >
                <div className='h-[100vh] overflow-auto sm:w-[30vw] scrollbar-thin scrollbar-webkit sm:relative'>
                    <div className='flex my-4 sm:items-center sm:text-center'>
                        {user && user.ownerImg && user.ownerImg[0] ?
                            <img src={user.ownerImg[0]} alt="Your Image"
                                className='sm:h-[10vh] sm:w-[10vh] rounded-full'
                            /> :
                            <div>
                                <AccountCircle
                                    color='inherit'
                                    style={{ fontSize: "10vh", color: 'gray' }}
                                />
                            </div>}
                        {user && user.name && <span className='text-5xl font-serif font-semibold ml-[2vw]'>{user.name}</span>}
                    </div>
                    <hr />
                    <div>
                        <h1 className='text-center my-2 font-serif font-semibold text-xl'>Available user</h1>
                        {list && list.map((item) => {
                            return (
                                <>
                                    <div key={item._id}
                                        onClick={() => setSelectedConversation(item)}
                                        style={selectedConversation && selectedConversation._id === item._id ?
                                            { color: 'white', backgroundColor: '#1976D2', borderRadius: '10px' }
                                            :
                                            { color: 'black' }}
                                        className='flex items-center m-3'>
                                        {item.ownerImg[0] ?
                                            <img src={item.ownerImg[0]} alt="persons image"
                                                className='sm:h-[10vh] sm:w-[10vh] rounded-full m-2'
                                            /> :
                                            <div className='m-2'>
                                                <AccountCircle
                                                    color='inherit'
                                                    style={{ fontSize: "10.2vh", color: 'gray' }}
                                                />
                                            </div>}
                                        <div className='mx-4'>
                                            <p>{item.name}</p>
                                            {onlineUser.includes(item._id) ? <p style={{ color: "green" }}>online</p> : null}
                                            <span>{item.username}</span>
                                        </div>

                                    </div>
                                    <hr className='h-1 rounded-full border bg-gray-300 m-2 mx-16' />
                                </>
                            )
                        })}
                    </div>
                </div>
                <hr />
                {!selectedConversation ?
                    <div className='flex text-4xl font-serif items-center'>
                        Please select the person for start a conversation
                    </div> :
                    <div className='w-[60vw] h-[100vh] overflow-auto scrollbar-thin scrollbar-webkit'>
                        <div className='flex items-center sticky top-0 bg-[white]'>
                            {selectedConversation.ownerImg[0] ?
                                <img src={selectedConversation.ownerImg[0]} alt="persons image"
                                    className='sm:h-[10vh] sm:w-[10vh] rounded-full m-2'
                                /> :
                                <div className='m-2'>
                                    <AccountCircle
                                        color='inherit'
                                        style={{ fontSize: "10.2vh", color: 'gray' }}
                                    />
                                </div>
                            }
                            <div>
                                <h1 className='font-serif text-xl'>{selectedConversation.name}</h1>
                                <p className='font-serif text-xl'>{selectedConversation.username}</p>
                            </div>
                        </div>
                        <div>
                            
                            {messages.length < 1 ? 
                            <div className='flex text-4xl font-serif justify-center'>
                                <h2 >{`Start the conversation with ${selectedConversation.name}`}</h2>
                            </div>
                             :
                                <div>
                                    {messages.map((message, index) => {
                                        return (
                                            <div key={index} ref={lastMessageRef}>
                                                <div style={message.senderId == user._id ? {
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    margin: '1vh'
                                                } : {
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    margin: '1vh'
                                                }}>
                                                    <p style={message.senderId == user._id ?
                                                        { backgroundColor: "blue", color: "white", fontSize: '3.5vh', width: 'max-content', padding: '6px 9px', borderRadius: '2vh', textAlign: 'right' }
                                                        :
                                                        {
                                                            backgroundColor: 'grey', color: "white", width: 'max-content', padding: '6px 9px ',
                                                            textAlign: "left", borderRadius: '2vh', fontSize: '3.5vh'
                                                        }}
                                                    >{message.message}
                                                    </p>
                                                </div>
                                                <p style={message.senderId == user._id ?
                                                    { textAlign: 'right', margin: '1vh' } :
                                                    { textAlign: "left", margin: '1vh' }}>{abstractTime(message.createdAt)}</p>
                                                <hr style={{ height: '2px' }} />
                                            </div>
                                        )
                                    })}
                                </div>}
                        </div>
                        <br />
                            <div style={{ position: 'sticky',width:'58vw', bottom: 0, backgroundColor: 'white', }}>
                        <form onSubmit={(e) => OnsubmitBtn(e)}>
                            <div className='flex'>
                                <TextField
                                    type="text"
                                    size='large'
                                    value={newMessage}
                                    placeholder='Enter message'
                                    className='w-full'
                                    onChange={(e) => setNewMessage(e.target.value)} />
                                <Button
                                type='submit'
                                    variant='contained'
                                    color='primary'
                                    style={{ fontSize: '3.3vh' }}
                                >Send</Button>
                                </div>
                        </form>
                            </div>
                    </div>
                }
            </div>
            {/* <Footer/> */}
        </div>
    )
}

export default ChatList
