import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../config';

function AROMICoach() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '👋 Hi! I\'m AROMI, your AI health coach. How can I help you today? You can ask me about workouts, nutrition, motivation, or any fitness questions!'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                API_ENDPOINTS.chat,
                { query: input, context: {} },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const assistantMessage = {
                role: 'assistant',
                content: response.data.response || 'Thanks for your message! How can I help further?'
            };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '😔 Sorry, I\'m having trouble connecting. Please try again later.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleBack = () => {
        window.location.href = '/dashboard';
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>🤖 AROMI AI Coach</h1>
                    <span style={styles.onlineDot}></span>
                    <span style={styles.onlineText}>Online</span>
                </div>
                <button onClick={handleBack} style={styles.backButton}>
                    ← Back to Dashboard
                </button>
            </div>

            {/* Chat Container */}
            <div style={styles.chatContainer}>
                {/* Messages */}
                <div style={styles.messagesContainer}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
                        >
                            {msg.role === 'assistant' && (
                                <span style={styles.assistantIcon}>🤖</span>
                            )}
                            <div style={msg.role === 'user' ? styles.userBubble : styles.assistantBubble}>
                                {msg.content}
                            </div>
                            {msg.role === 'user' && (
                                <span style={styles.userIcon}>👤</span>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div style={styles.assistantMessage}>
                            <span style={styles.assistantIcon}>🤖</span>
                            <div style={styles.assistantBubble}>
                                <span style={styles.typingIndicator}>...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={styles.inputContainer}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about workouts, nutrition, motivation..."
                        style={styles.input}
                        rows="1"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        style={loading || !input.trim() ? styles.sendButtonDisabled : styles.sendButton}
                    >
                        {loading ? '...' : 'Send'}
                    </button>
                </div>
                <p style={styles.hint}>Press Enter to send, Shift+Enter for new line</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1000px',
        margin: '0 auto',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    title: {
        margin: 0,
        color: '#333'
    },
    onlineDot: {
        width: '10px',
        height: '10px',
        backgroundColor: '#28a745',
        borderRadius: '50%',
        display: 'inline-block'
    },
    onlineText: {
        color: '#28a745',
        fontSize: '14px'
    },
    backButton: {
        padding: '8px 16px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    chatContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    messagesContainer: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    userMessage: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: '10px'
    },
    assistantMessage: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        gap: '10px'
    },
    userBubble: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '18px 18px 4px 18px',
        maxWidth: '70%',
        wordWrap: 'break-word'
    },
    assistantBubble: {
        backgroundColor: '#e9ecef',
        color: '#333',
        padding: '12px 16px',
        borderRadius: '18px 18px 18px 4px',
        maxWidth: '70%',
        wordWrap: 'break-word'
    },
    assistantIcon: {
        fontSize: '24px'
    },
    userIcon: {
        fontSize: '24px'
    },
    typingIndicator: {
        fontSize: '20px',
        letterSpacing: '2px'
    },
    inputContainer: {
        display: 'flex',
        padding: '20px',
        borderTop: '1px solid #dee2e6',
        gap: '10px'
    },
    input: {
        flex: 1,
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        resize: 'none',
        fontFamily: 'inherit',
        fontSize: '14px'
    },
    sendButton: {
        padding: '12px 24px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    sendButtonDisabled: {
        padding: '12px 24px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'not-allowed'
    },
    hint: {
        margin: '5px 0 15px 20px',
        color: '#999',
        fontSize: '12px'
    }
};

export default AROMICoach;