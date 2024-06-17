import React, { useEffect, useState } from 'react';
import {Message as MessageType} from '../../types';

const Message: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [lastMessage, setLastMessage] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [author, setAuthor] = useState<string>('')




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

  useEffect(() => {
    const interval = setInterval(() => {
      void fetchMessages();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages,lastMessage]);

  const sendMessage = async () => {
    const url = 'http://146.185.154.90:8000/messages';

    const data = new URLSearchParams();
    data.set('message', newMessage);
    data.set('author', author);

    try {
      const response = await fetch(url, {
        method: 'post',
        body: data,
      });

      const sendMessage: MessageType = await response.json()
      setMessages((prevState) => [...prevState, sendMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Err')
    }
  }



  return (
    <div className="container mt-4">
      <h1 className="mb-4">Messages</h1>
      <div className="list-group">
        {messages.map((message, index) => (
          <div key={index} className="list-group-item">
            <div className="d-flex justify-content-between">
              <h5 className="mb-2">{message.author}</h5>
              <small>{new Date(message.datetime).toLocaleString()}</small>
            </div>
            <p className="mb-1">{message.text}</p>
          </div>
        ))}
      </div>
      <input placeholder="User Name"
             className="form-control mt-5 mb-2"
             type="text" value={author}
             onChange={(e) => setAuthor(e.target.value)}/>
      <input placeholder="Message here"
             className="form-control mt-3 mb-2"
             type="text" value={newMessage}
             onChange={(e) => setNewMessage(e.target.value)}/>


      <button className="btn btn-primary" onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Message;
