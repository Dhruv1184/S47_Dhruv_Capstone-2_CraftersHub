import { useEffect } from "react"
import useConversation from "../Zustand/getConversation"
import axios from "axios"
const getMessages = (user) => {
    const { messages, selectedConversation, setMessages, } = useConversation()
    // useListenMessage()
    useEffect(() => {
        console.log('selectedConversation._id',selectedConversation);
        console.log('user._id',user._id);
        const getMessage = async (user) => {
            try {
                const response = await axios.get(`https://s47-dhruv-capstone-2-craftershub-1.onrender.com/message/${selectedConversation._id}`, {
                    params: {
                        senderId: user._id
                        // conversationId: conversation_Id
                    }
                })
                console.log("getMessage console response",response);
                setMessages(response.data)
            } catch (error) {
                console.log(error);
            }

            
        }
        if (selectedConversation?._id) getMessage(user)
        // return useListenMessage()
    }, [selectedConversation?._id, setMessages,user._id])

    return { messages}

}

export default getMessages
