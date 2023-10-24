import React, { useContext, useState, useEffect } from 'react';
import styles from './ChatTopInfo.module.css';
import { AuthContext } from '../../../context/AuthContext';
import messageStyles from '../Messages/Messages.module.css';
import useChatUpdater from '../../hooks/useChatUpdater';

const {isSelected} = messageStyles;

const ChatTopInfo = ({ currentChat,
  setCurrentChat,
  setIsAnyToggled,
  selectedMessages,
  setSelectedMessages,
  setChats, /* TODO: put setChats to useChatUpdater */
  onlineUsers }) => {
  const [intelocutorStatus, setIntelocutorStatus] = useState('Loading...');

  const { user } = useContext(AuthContext);
  const { deleteMessage } = useChatUpdater();

  const getIntelocutorId = () => {
    return currentChat.participants.find((participant) => participant.id !== user.id).id;
  };

  useEffect(() => {
    const loadIntelocutorStatus = async () => {
      if (onlineUsers.length > 0 && currentChat.participants) {
        const intelocutorId = getIntelocutorId();

        if (onlineUsers.find((user) => user.id === intelocutorId) !== undefined) {
          setIntelocutorStatus('Online');
        } else {
          setIntelocutorStatus('Offline');
        }
      }
    };

    if (currentChat && onlineUsers.length > 0) {
      loadIntelocutorStatus();
    } else {
      setIntelocutorStatus('Loading...');
    }
  }, [onlineUsers, currentChat]);

  const onCancel = () => {
    selectedMessages.forEach((message) => {
      console.log(isSelected);
      document.getElementById(message.id).classList.remove(isSelected);
    })
    setSelectedMessages([]);
  }

  const onDelete = () => {
    selectedMessages.forEach((message) => {
      deleteMessage(currentChat.id, message, setChats)
    })
    setSelectedMessages([])
  }

  return (
    <>
      <div className={styles.top_info}>
        {selectedMessages.length ? (
          <div className={styles.flex_container}>
            <p className={styles.selected_messages}>Selected: {selectedMessages.length}</p>
            <div className={styles.button_container}>
              <button className={`${styles.button} ${styles.delete}`} onClick={onDelete}>Delete</button>
              <button className={`${styles.button}`} onClick={onCancel}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <i
              className={styles.arrow_back_icon}
              onClick={() => {
                setCurrentChat({});
                setIsAnyToggled(false);
              }}
            />
            <div className={`${styles.avatar} ${styles.diminished}`} />
            <div className={styles.preview}>
              <article className={`${styles.username} ${styles.unselectable}`}>{currentChat.name}</article>
              <article className={styles.unselectable}>{intelocutorStatus}</article>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatTopInfo;
