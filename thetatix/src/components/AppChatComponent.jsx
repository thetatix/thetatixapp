import React, { useEffect, useState } from 'react';
import { useChannel } from "./AblyReactEffect";
import styles from '@/assets/styles/Stream.module.css'
// import styles from './AblyChatComponent.module.css';

const AblyChatComponent = ({eventAddress}) => {

    let inputBox = null;
    let messageEnd = null;
    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState([]);
    const messageTextIsEmpty = messageText.trim().length === 0;

    const [channel, ably] = useChannel(eventAddress, (message) => {
        // Here we're computing the state that'll be drawn into the message history
        // We do that by slicing the last 199 messages from the receivedMessages buffer

        const history = receivedMessages.slice(-199);
        setMessages([...history, message]);

        // Then finally, we take the message history, and combine it with the new message
        // This means we'll always have up to 199 message + 1 new message, stored using the
        // setMessages react useState hook
    });



    const sendChatMessage = (messageText) => {
        channel.publish({ name: "chat-message", data: messageText });
        setMessageText("");
        inputBox.focus();
    }

    const handleFormSubmission = (event) => {
        event.preventDefault();
        sendChatMessage(messageText);
    }

    const handleKeyPress = (event) => {
        if (event.charCode !== 13 || messageTextIsEmpty) {
            return;
        }
        sendChatMessage(messageText);
        event.preventDefault();
    }

    const messages = receivedMessages.map((message, index) => {
        console.log('msg',message);
        console.log('other',ably.connection.id);
        const author = message.connectionId === ably.connection.id ? "me" : "other";
        return <div key={index} className={styles.chatMessage} data-author={author}>
            <h6>{author}</h6>
            <div className={styles.chatBubble}>
                <p>
                    {message.data}
                </p>
            </div>
        </div>;
    });

    useEffect(() => {
        messageEnd.scrollIntoView({ behaviour: "smooth" });
    });

    return (
        <div className={styles.chatHolder}>
            <div className={styles.chatMessages}>
                {messages}
                <div ref={(element) => { messageEnd = element; }}></div>
            </div>
            <form onSubmit={handleFormSubmission} className={styles.chatForm}>
                <textarea
                    ref={(element) => { inputBox = element; }}
                    value={messageText}
                    placeholder="Type a message here"
                    rows="1"
                    onChange={e => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                ></textarea>
                <button type="submit" disabled={messageTextIsEmpty}>Send</button>
            </form>
        </div>
    )
}

export default AblyChatComponent;