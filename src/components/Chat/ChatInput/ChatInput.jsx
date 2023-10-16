import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext.jsx';
import styles from './ChatInput.module.css';
import InteractionTab from './InteractionTab/InteractionTab.jsx';

const ChatInput = ({ isInteractionTabVisible, 
                     setIsInteractionTabVisible,
                     embeddedMessage,
                     messageInputRef, 
                     setMessages, 
                     messages, 
                     currentChat, 
                     setPendingMessage, 
                     socket}) => {
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && message !== null) {
      sendMessage();
    }
  }

  const sendMessage = async () => {
    if (message !== '') {
      const newMessages = [...messages];

      if(socket !== null) {
        const recipientId = currentChat.participants.find((participant) => participant.id !== user.id).id;
        socket.emit("sendMessage", {
            author: {
              name: user.name,
              id: user.id
            },
            content: message,
            time: new Date().toISOString(),
            recipientId: recipientId,
            chatId: currentChat.id
        })
      }
      
      newMessages.push(
        {
          author: {
            name: user.name,
            id: user.id
          },
          content: message,
          time: new Date().toISOString()
        }
      )

      setMessages(newMessages);
      setPendingMessage(message);
      messageInputRef.current.value = '';
      setMessage('');
    }
  }


  return (
    <div className={styles.container}>
      <InteractionTab isInteractionTabVisible={isInteractionTabVisible}
                      setIsInteractionTabVisible={setIsInteractionTabVisible}
                      embeddedMessage={embeddedMessage}/>
      <div className={styles.chat_input}>
        <input ref={messageInputRef}
          placeholder='Message...'
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={message ? `${styles.send_button} ${styles.__active}` : `${styles.send_button} ${styles.__inactive}`}
          onClick={sendMessage}
        >
          <div className={message ? `${styles.send_img} ${styles.__active}` : `${styles.send_img} ${styles.__inactive}`} />
        </button>
      </div>
    </div>
  )
}

export default ChatInput;
