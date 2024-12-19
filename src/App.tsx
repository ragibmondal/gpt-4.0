import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ImageMessage } from './components/ImageMessage';
import { CommandMenu } from './components/CommandMenu';
import { ImageInput } from './components/ImageInput';
import { Message } from './types';

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, imageUrl?: string, options?: { stream: boolean }) => Promise<any>;
        txt2img: (prompt: string) => Promise<HTMLImageElement>;
      };
    };
  }
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'generateImage' | 'analyzeImage'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string) => {
    setMessages(prev => [...prev, { text: message, isUser: true, type: 'text' }]);
    setIsLoading(true);

    try {
      const response = await window.puter.ai.chat(message, undefined, { stream: true });
      let fullResponse = '';

      setMessages(prev => [...prev, { text: '', isUser: false, type: 'text' }]);

      for await (const part of response) {
        fullResponse += part?.text || '';
        setMessages(prev => [
          ...prev.slice(0, -1),
          { text: fullResponse, isUser: false, type: 'text' }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { text: 'Sorry, there was an error processing your request.', isUser: false, type: 'text' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGeneration = async (prompt: string) => {
    setMessages(prev => [...prev, { text: prompt, isUser: true, type: 'text' }]);
    setIsLoading(true);
    setInputMode('text');

    try {
      const imageElement = await window.puter.ai.txt2img(prompt);
      setMessages(prev => [
        ...prev,
        { text: 'Generated image:', isUser: false, type: 'image', imageUrl: imageElement.src }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { text: 'Sorry, there was an error generating the image.', isUser: false, type: 'text' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageAnalysis = async (imageUrl: string) => {
    setMessages(prev => [...prev, { text: 'Analyze this image:', isUser: true, type: 'image', imageUrl }]);
    setIsLoading(true);
    setInputMode('text');

    try {
      const response = await window.puter.ai.chat('What do you see in this image?', imageUrl, { stream: true });
      let fullResponse = '';

      setMessages(prev => [...prev, { text: '', isUser: false, type: 'imageAnalysis' }]);

      for await (const part of response) {
        fullResponse += part?.text || '';
        setMessages(prev => [
          ...prev.slice(0, -1),
          { text: fullResponse, isUser: false, type: 'imageAnalysis' }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { text: 'Sorry, there was an error analyzing the image.', isUser: false, type: 'text' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b p-4">
        <h1 className="text-xl font-semibold text-center text-gray-800">
          AI Chat Assistant
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
              Start a conversation or try generating/analyzing images
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-4 p-6 ${message.isUser ? 'bg-white' : 'bg-gray-50'}`}>
              {message.type === 'image' ? (
                <ImageMessage imageUrl={message.imageUrl!} alt={message.text} />
              ) : (
                <ChatMessage message={message.text} isUser={message.isUser} />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {inputMode === 'text' ? (
        <>
          <CommandMenu
            onImageGenerate={() => setInputMode('generateImage')}
            onImageAnalyze={() => setInputMode('analyzeImage')}
          />
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </>
      ) : (
        <ImageInput
          type={inputMode === 'generateImage' ? 'generate' : 'analyze'}
          onSubmit={inputMode === 'generateImage' ? handleImageGeneration : handleImageAnalysis}
          onCancel={() => setInputMode('text')}
        />
      )}
    </div>
  );
}

export default App;