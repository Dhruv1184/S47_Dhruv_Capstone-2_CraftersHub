import { useEffect } from "react"
import useConversation from "../Zustand/getConversation"
import { useSocketContext } from "../socket/Socket"

const useListenMessage = () => {
  const  {socket}= useSocketContext()
  const {messages, setMessages }= useConversation()
  
  useEffect(()=>{
    if(socket){

        socket.on('newMessage',(newMessage)=>{
            console.log("New message received:", newMessage);
            setMessages([...messages, newMessage])
        })
        
        return ()=> socket.off('newMessage')
    }
},[socket,messages,setMessages])
}


export default useListenMessage
