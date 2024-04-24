import { useEffect } from "react"
import useConversation from "../Zustand/getConversation"
import axios from "axios"
import useListenMessage from "./useListenMessage"
const getMessages = (user) => {
    const { messages, selectedConversation, setMessages } = useConversation()
    // useListenMessage()
    useEffect(() => {

        const getMessage = async (user) => {
            try {
                const response = await axios.get(`http://localhost:9000/message/${selectedConversation._id}`, {
                    params: {
                        senderId: user._id
                    }
                })
                // console.log(response);
                setMessages(response.data)
            } catch (error) {
                console.log(error);
            }

            
        }
        if (selectedConversation?._id) getMessage(user)

        // return useListenMessage()
    }, [selectedConversation?._id, setMessages,user._id])

    return { messages }

}

export default getMessages