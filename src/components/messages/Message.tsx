import React, { useEffect, useState } from 'react';
import {Message as MessageType} from '../../types';

const Message: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      void fetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [lastMessage]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://146.185.154.90:8000/messages?datetime=${lastMessage}`);
      const newMessages: MessageType[] = await response.json();
      if (newMessages.length > 0) {
        setMessages(prevState => [...prevState, ...newMessages]);
        const lastMessage = newMessages[newMessages.length - 1];
        setLastMessage(lastMessage.datetime);
      }
    } catch (error) {
      console.error('Error getting messages', error);
    }
  };



  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <p>{message.author}: {message.text}</p>
          <p>{message.datetime}</p>
        </div>
      ))}
    </div>
  );
};

export default Message;
