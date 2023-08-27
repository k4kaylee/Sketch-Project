import React, { useCallback, useContext, useMemo, useState } from 'react';
import '../../../App.css'; //to be restructurised
import '../Messages/Messages.css'
import { AuthContext } from '../../../context/AuthContext';
import { useContextMenu } from '../../hooks/useContextMenu';
import { useModal } from '../../hooks/useModal';
import Notice from '../../misc/Notice/Notice';
import useChatUpdater from '../../hooks/useChatUpdater';



const Messages = ({ messages, currentChatId, setChats }) => {

  /* Context */
  const { user } = useContext(AuthContext);

  /* States */
  const [notification, setNotification] = useState('');

  /* Custom hooks */
  const { setContextMenu } = useContextMenu();
  const { setModal } = useModal();
  const { deleteMessage } = useChatUpdater();

  /* Custom functions */
  const hideAndDeleteMessage = (message) => {
    const messageElement = document.getElementById(message.id);
    if (messageElement) {
      messageElement.classList.add('message-fade-away');
    }
    setTimeout(() => {
      deleteMessage(currentChatId, message, setChats);
    }, 400);
  }

  const editMsg = () => { //useChatUpdater

  }

  const copyMessageToClipboard = (message) => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        setNotification('Message was copied to clipboard');
      })
      .catch((error) => {
        setNotification('Failed to copy text:', error);
      });
    setNotification('');
  }

  const handleContextMenu = useCallback((event, message) => {
    event.preventDefault();

    const { clientX, clientY } = event
    setContextMenu(contextMenu, [clientX, clientY], message)
  }, [setContextMenu, contextMenu])

  /* Objects */
  const contextMenu = useMemo(() => [
    {
      name: 'Edit',
      onClick: (message) => editMsg(message)
    },
    {
      name: 'Delete',
      onClick: (message) => {
        setModal({
          header: 'Delete message',
          content: 'It will not be possible to restore this message. Are you sure?',
          onSubmit: () => hideAndDeleteMessage(message)
        });
      }
    },
    {
      name: 'Copy the text',
      onClick: (message) => copyMessageToClipboard(message)
    },
  ], [setModal, hideAndDeleteMessage]);



  return (
    messages.length !== 0 ? (
      <>
        <div className='chat-messages'>
          <Notice content={notification} />
          <ul>
            {
              messages.map((message, index) => (
                <li className={user.id === message.author ? 'message byMe' : 'message'}
                  key={index}
                  id={message.id}
                  onContextMenu={(event) => handleContextMenu(event, message)}
                >
                  {message.content}
                </li>
              ))
            }
          </ul>

        </div>
      </>

    ) : (
      <p className='no-messages-info unselectable'><i>There is no messages yet. Send your first!</i></p>
    )
  )
}


export default Messages;