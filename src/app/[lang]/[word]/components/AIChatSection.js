'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { generateAIWord } from '@/lib/api';

const READY_PROMPTS = [
  { label: 'Short summary', text: 'Give me a short summary about {word}.' },
  { label: 'Example sentences', text: 'Provide 3 example sentences using {word}.' },
  { label: 'Synonyms & antonyms', text: 'What are synonyms and antonyms of {word}?' },
  { label: 'Etymology', text: 'Explain the etymology of {word}.' },
  { label: 'Usage tips', text: 'Give me usage tips for {word}.' },
  { label: 'Common mistakes', text: 'What are common mistakes when using {word}?' },
];

export default function AIChatSection({ word, lang }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // Scroll to bottom when messages change, only if user is near bottom
  // Disabled auto-scroll for testing
  // useEffect(() => {
  //   if (isNearBottom) {
  //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [messages, isNearBottom]);

  // Update isNearBottom on scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 100; // pixels from bottom
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(distanceFromBottom <= threshold);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // const handleSend = async (text = input) => {
  //   if (!text.trim()) return;

  //   const userMessage = { role: 'user', content: text };
  //   setMessages(prev => [...prev, userMessage]);
  //   setInput('');
  //   setIsLoading(true);
  //   setError(null);

  //   // Create a placeholder assistant message
  //   const assistantMessage = { role: 'assistant', content: '' };
  //   setMessages(prev => [...prev, assistantMessage]);

  //   try {
  //     const response = await generateAIWord(text, lang);
  //     const reader = response.body?.getReader();
  //     const decoder = new TextDecoder();

  //     if (!reader) {
  //       throw new Error('No reader available');
  //     }

  //     let accumulatedContent = '';
  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       const chunk = decoder.decode(value, { stream: true });
  //       // Parse SSE lines
  //       const lines = chunk.split('\n');
  //       for (const line of lines) {
  //         if (line.startsWith('data: ')) {
  //           const data = line.slice(6);
  //           if (data === '[DONE]') {
  //             break;
  //           }
  //           try {
  //             const parsed = JSON.parse(data);
  //             if (parsed.content) {
  //               accumulatedContent += parsed.content;
  //               // Update the last message with accumulated content
  //               setMessages(prev => {
  //                 const newMessages = [...prev];
  //                 const lastIndex = newMessages.length - 1;
  //                 if (newMessages[lastIndex].role === 'assistant') {
  //                   newMessages[lastIndex].content = accumulatedContent;
  //                 }
  //                 return newMessages;
  //               });
  //             }
  //             if (parsed.error) {
  //               throw new Error(parsed.error);
  //             }
  //           } catch (e) {
  //             console.error('Failed to parse SSE data:', e);
  //           }
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.error('AI chat error:', err);
  //     setError('Failed to get response. Please try again.');
  //     // Update the assistant message with error
  //     setMessages(prev => {
  //       const newMessages = [...prev];
  //       const lastIndex = newMessages.length - 1;
  //       if (newMessages[lastIndex].role === 'assistant') {
  //         newMessages[lastIndex].content = 'Sorry, I encountered an error. Please try again later.';
  //       }
  //       return newMessages;
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  const handleSend = async (text = input) => {
  if (!text.trim()) return;

  const userMessage = { role: 'user', content: text };
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);
  setError(null);

  // Create a placeholder assistant message
  const assistantMessage = { role: 'assistant', content: '' };
  setMessages(prev => [...prev, assistantMessage]);

  try {
    const response = await generateAIWord(text, lang);
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    let accumulatedContent = '';
    let buffer = ''; // Add buffer to handle incomplete chunks
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });
      
      // Split by double newline (SSE event separator)
      const events = buffer.split('\n\n');
      
      // Keep the last incomplete event in buffer
      buffer = events.pop() || '';
      
      for (const event of events) {
        // Skip empty events
        if (!event.trim()) continue;
        
        // Parse each line in the event
        const lines = event.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove "data: " prefix
            
            if (data === '[DONE]') {
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                // Update the last message with accumulated content
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastIndex = newMessages.length - 1;
                  if (newMessages[lastIndex].role === 'assistant') {
                    newMessages[lastIndex].content = accumulatedContent;
                  }
                  return newMessages;
                });
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e, 'Raw data:', data);
            }
          }
        }
      }
    }
    
    // Process any remaining data in buffer
    if (buffer.trim()) {
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastIndex = newMessages.length - 1;
                  if (newMessages[lastIndex].role === 'assistant') {
                    newMessages[lastIndex].content = accumulatedContent;
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Failed to parse remaining buffer:', e);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('AI chat error:', err);
    setError('Failed to get response. Please try again.');
    // Update the assistant message with error
    setMessages(prev => {
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;
      if (newMessages[lastIndex].role === 'assistant') {
        newMessages[lastIndex].content = 'Sorry, I encountered an error. Please try again later.';
      }
      return newMessages;
    });
  } finally {
    setIsLoading(false);
  }
};


  const handlePromptClick = (promptText) => {
    const filledPrompt = promptText.replace(/{word}/g, word);
    setInput(filledPrompt);
    // Optionally auto-send
    // handleSend(filledPrompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show feedback (optional)
    });
  };


  return (
    <section className="mt-16" aria-labelledby="ai-chat-heading">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-200 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
            <Bot size={28} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 id="ai-chat-heading" className="text-2xl font-bold text-gray-800">
              AI Word Assistant
            </h2>
            <p className="text-gray-600">
              Ask anything about <span className="font-semibold text-purple-700">{word}</span> in {lang}
            </p>
          </div>
        </div>

        {/* Ready Prompts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" />
            Quick Prompts
          </h3>
          <div className="flex flex-wrap gap-3">
            {READY_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt.text)}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 text-sm font-medium shadow-sm"
                aria-label={`Use prompt: ${prompt.label}`}
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-inner overflow-hidden mb-6">
          {/* Messages */}
          <div ref={messagesContainerRef} className="h-80 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bot size={48} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium">Ask me anything about this word!</p>
                <p className="text-sm">Try a quick prompt or type your own question.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}
                    aria-hidden="true"
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-50 text-gray-800 border border-blue-100' : 'bg-gray-50 text-gray-800 border border-gray-200'}`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                          aria-label="Copy response"
                        >
                          <Copy size={14} />
                          Copy
                        </button>
                        <button
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600"
                          aria-label="Helpful"
                        >
                          <ThumbsUp size={14} />
                          Helpful
                        </button>
                        <button
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
                          aria-label="Not helpful"
                        >
                          <ThumbsDown size={14} />
                          Not helpful
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-300 p-4">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about "${word}"...`}
                className="flex-1 border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="2"
                aria-label="Type your question"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="self-end bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <p className="text-gray-500 text-sm mt-3 text-center">
              AI responses are powered by DeepSeek AI. If you encounter errors, please try again later.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center text-gray-600 text-sm">
          <p>
            This AI assistant can help you understand nuances, usage, and more about <strong>{word}</strong>.
            Powered by <span className="font-semibold text-purple-700">w9999 AI</span>.
          </p>
        </div>
      </div>
    </section>
  );
}