'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import Image from 'next/image';

// Conversation flow types
interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  options?: QuickReply[];
  timestamp: Date;
}

interface QuickReply {
  label: string;
  value: string;
  nextStep: ConversationStep;
}

type ConversationStep =
  | 'greeting'
  | 'location'
  | 'budget'
  | 'plot_size'
  | 'name'
  | 'phone'
  | 'email'
  | 'complete'
  | 'custom_query';

// Lead data collected through conversation
interface LeadData {
  location?: string;
  budget?: string;
  plotSize?: string;
  name?: string;
  phone?: string;
  email?: string;
}

// Bot responses and conversation flow
const BOT_RESPONSES: Record<ConversationStep, { text: string; options?: QuickReply[] }> = {
  greeting: {
    text: "Hello! 👋\nWelcome to Plotzed Real Estate.\n\nWe offer premium RERA-approved plots with zero brokerage. How can I help you today?",
    options: [
      { label: 'View Plots', value: 'view_plots', nextStep: 'location' },
      { label: 'Schedule Site Visit', value: 'site_visit', nextStep: 'location' },
      { label: 'Know Prices', value: 'prices', nextStep: 'budget' },
      { label: 'Talk to Expert', value: 'expert', nextStep: 'name' },
    ],
  },
  location: {
    text: "We have premium plots in these locations. Which area interests you?",
    options: [
      { label: 'Chennai', value: 'Chennai', nextStep: 'budget' },
      { label: 'Coimbatore', value: 'Coimbatore', nextStep: 'budget' },
      { label: 'Bangalore', value: 'Bangalore', nextStep: 'budget' },
      { label: 'Hyderabad', value: 'Hyderabad', nextStep: 'budget' },
      { label: 'Other', value: 'Other', nextStep: 'budget' },
    ],
  },
  budget: {
    text: "Great choice! What's your budget range?",
    options: [
      { label: '₹15-25 Lakhs', value: '15-25 Lakhs', nextStep: 'plot_size' },
      { label: '₹25-50 Lakhs', value: '25-50 Lakhs', nextStep: 'plot_size' },
      { label: '₹50-75 Lakhs', value: '50-75 Lakhs', nextStep: 'plot_size' },
      { label: '₹75 Lakhs+', value: '75 Lakhs+', nextStep: 'plot_size' },
    ],
  },
  plot_size: {
    text: "What plot size are you looking for?",
    options: [
      { label: '1200-1500 sq.ft', value: '1200-1500 sq.ft', nextStep: 'name' },
      { label: '1500-2000 sq.ft', value: '1500-2000 sq.ft', nextStep: 'name' },
      { label: '2000-3000 sq.ft', value: '2000-3000 sq.ft', nextStep: 'name' },
      { label: '3000+ sq.ft', value: '3000+ sq.ft', nextStep: 'name' },
    ],
  },
  name: {
    text: "Perfect! To help you better, may I know your name?",
  },
  phone: {
    text: "Thanks! Please share your phone number so our expert can contact you.",
  },
  email: {
    text: "And your email address for sending plot details?",
  },
  complete: {
    text: "Thank you for your interest! 🎉\n\nOur property expert will contact you within 24 hours with personalized plot recommendations.\n\nMeanwhile, feel free to explore our website!",
    options: [
      { label: 'View All Plots', value: 'view_all', nextStep: 'greeting' },
      { label: 'Start New Chat', value: 'restart', nextStep: 'greeting' },
    ],
  },
  custom_query: {
    text: "I'll connect you with our expert who can answer your questions. Please share your details.",
  },
};

// Time greeting based on hour
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [leadData, setLeadData] = useState<LeadData>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingResponse = BOT_RESPONSES.greeting;
      const greeting = greetingResponse.text.replace('Hello!', `${getTimeGreeting()}!`);

      setTimeout(() => {
        setMessages([
          {
            id: '1',
            type: 'bot',
            text: greeting,
            options: greetingResponse.options,
            timestamp: new Date(),
          },
        ]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  // Add bot message with typing effect
  const addBotMessage = (step: ConversationStep, customText?: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const response = BOT_RESPONSES[step];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'bot',
          text: customText || response.text,
          options: response.options,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setCurrentStep(step);
    }, 800);
  };

  // Handle quick reply selection
  const handleQuickReply = (option: QuickReply) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        text: option.label,
        timestamp: new Date(),
      },
    ]);

    // Update lead data based on current step
    if (currentStep === 'location') {
      setLeadData((prev) => ({ ...prev, location: option.value }));
    } else if (currentStep === 'budget') {
      setLeadData((prev) => ({ ...prev, budget: option.value }));
    } else if (currentStep === 'plot_size') {
      setLeadData((prev) => ({ ...prev, plotSize: option.value }));
    }

    // Handle special actions
    if (option.value === 'view_all') {
      window.location.href = '/plots';
      return;
    }
    if (option.value === 'restart') {
      setMessages([]);
      setLeadData({});
      setCurrentStep('greeting');
      return;
    }

    // Move to next step
    addBotMessage(option.nextStep);
  };

  // Handle text input submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    const userInput = inputValue.trim();
    setInputValue('');

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        text: userInput,
        timestamp: new Date(),
      },
    ]);

    // Process based on current step
    if (currentStep === 'name') {
      setLeadData((prev) => ({ ...prev, name: userInput }));
      addBotMessage('phone');
    } else if (currentStep === 'phone') {
      // Validate phone
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(userInput.replace(/\D/g, '').slice(-10))) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: 'bot',
              text: "Please enter a valid 10-digit Indian mobile number.",
              timestamp: new Date(),
            },
          ]);
          setIsTyping(false);
        }, 500);
        return;
      }
      setLeadData((prev) => ({ ...prev, phone: userInput.replace(/\D/g, '').slice(-10) }));
      addBotMessage('email');
    } else if (currentStep === 'email') {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userInput)) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: 'bot',
              text: "Please enter a valid email address.",
              timestamp: new Date(),
            },
          ]);
          setIsTyping(false);
        }, 500);
        return;
      }

      const finalLeadData = { ...leadData, email: userInput };
      setLeadData(finalLeadData);

      // Submit lead to API
      await submitLead(finalLeadData);
    } else {
      // Handle custom queries
      addBotMessage('name', "I'd be happy to help! Let me connect you with our expert. May I know your name?");
    }
  };

  // Submit lead data to API
  const submitLead = async (data: LeadData) => {
    setIsSubmitting(true);
    setIsTyping(true);

    try {
      const message = [
        'Chatbot Lead',
        '',
        data.location ? `Location: ${data.location}` : '',
        data.budget ? `Budget: ${data.budget}` : '',
        data.plotSize ? `Plot Size: ${data.plotSize}` : '',
      ].filter(Boolean).join('\n');

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          message: message,
          source: 'chatbot',
        }),
      });

      if (response.ok) {
        addBotMessage('complete');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Failed to submit lead:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'bot',
          text: "Sorry, something went wrong. Please try again or call us at +91 77085 94263.",
          options: [{ label: 'Try Again', value: 'restart', nextStep: 'greeting' }],
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show input for text steps
  const showInput = ['name', 'phone', 'email', 'custom_query'].includes(currentStep);

  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Collapsed State - Speech Bubble + Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-6 z-50 flex items-end gap-3">
          {/* Speech Bubble */}
          {!isMinimized && (
            <div className="relative bg-white rounded-2xl shadow-lg px-4 py-3 max-w-[200px] animate-fade-in">
              {/* Close button */}
              <button
                onClick={() => setIsMinimized(true)}
                className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-md transition-colors"
                aria-label="Minimize"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
              {/* Speech bubble pointer */}
              <div className="absolute -right-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white" />
              <p className="text-[#112250] font-semibold text-sm">We&apos;re Online!</p>
              <p className="text-gray-600 text-sm">How may I assist you today?</p>
            </div>
          )}

          {/* Chat Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Open chat"
          >
            <div className="w-14 h-14 bg-[#112250] hover:bg-[#006DB8] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              {/* Chat Icon */}
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01" />
                <path d="M12 10h.01" />
                <path d="M16 10h.01" />
              </svg>
            </div>
            <span className="text-[#112250] text-xs font-bold tracking-wide">CHAT</span>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#112250] to-[#006DB8] p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.svg"
                alt="Plotzed"
                width={36}
                height={36}
                className="object-contain"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Plotzed Assistant</h3>
              <p className="text-white/70 text-sm">Online | Typically replies instantly</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.type === 'user'
                      ? 'bg-[#112250] text-white rounded-2xl rounded-br-md'
                      : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                  } px-4 py-3`}
                >
                  <p className="whitespace-pre-line text-sm">{message.text}</p>

                  {/* Quick Reply Options */}
                  {message.options && message.type === 'bot' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(option)}
                          className="px-3 py-1.5 border border-[#112250] text-[#112250] rounded-full text-sm hover:bg-[#112250] hover:text-white transition-colors"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {showInput && (
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type={currentStep === 'email' ? 'email' : currentStep === 'phone' ? 'tel' : 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    currentStep === 'name'
                      ? 'Enter your name...'
                      : currentStep === 'phone'
                      ? 'Enter 10-digit mobile number...'
                      : currentStep === 'email'
                      ? 'Enter your email...'
                      : 'Type your message...'
                  }
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#006DB8] focus:ring-2 focus:ring-[#006DB8]/20"
                  disabled={isSubmitting}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSubmitting}
                  className="w-10 h-10 bg-[#D8B893] hover:bg-[#c4a57f] disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-5 h-5 text-[#112250]" />
                </button>
              </div>
            </form>
          )}

          {/* Powered by */}
          <div className="py-2 text-center bg-white border-t border-gray-100">
            <span className="text-xs text-gray-400">Powered by Plotzed</span>
          </div>
        </div>
      )}
    </>
  );
}
