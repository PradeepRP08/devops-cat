import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Stack Job Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const faqData = {
    "how to apply": "To apply for a job, browse our listings, click 'Details' or 'Apply Now' on a job card, and hit the 'Submit Application' button on the job page.",
    "resume help": "You can upload and update your resume in your Profile section. Having a clear PDF resume increases your chances of getting shortlisted!",
    "profile": "To complete your profile, go to the 'View Profile' link in the top menu. Aim for 100% completion to stand out to recruiters.",
    "recruiter login": "Recruiters can use the 'Recruiter Login' button in the navbar to access their specialized hiring dashboard.",
    "status": "You can track your applications in the 'Applied Jobs' section. We show stages like 'Under Review', 'Shortlisted', and 'Selected'.",
    "contact": "For support, you can reach out to our team at support@stackjob.com",
    "hello": "Hello! I'm here to help you navigate the Stack Job portal. Ask me about jobs, profiles, or applications!",
    "hi": "Hi there! Looking for your dream job? I can help you with your profile or application tracking."
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.toLowerCase();
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput("");

    // Simple AI Logic Optimization
    setTimeout(() => {
        let response = "I'm still learning! Could you rephrase your question? Try asking me about 'how to apply', 'resume help', or 'application status'.";
        
        for (const [key, answer] of Object.entries(faqData)) {
            // optimized to check if any words in the key exist in the userMsg
            if (userMsg.includes(key)) {
                response = answer;
                break;
            }
        }

        setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 600);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Bot Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
           {/* Header */}
           <div className="bg-blue-600 p-6 text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">✨</div>
                    <div>
                        <p className="font-black text-sm uppercase tracking-widest">Stack AI</p>
                        <p className="text-[10px] font-bold text-blue-200">Online and ready to help</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-all text-xl">✕</button>
           </div>

           {/* Messages Section */}
           <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${m.isBot ? 'bg-white text-gray-700 border border-gray-100' : 'bg-blue-600 text-white shadow-blue-100'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
           </div>

           {/* Input Section */}
           <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm focus:border-blue-500 transition-all font-medium text-black"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95">
                    🚀
                </button>
           </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white text-3xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white"
      >
        {isOpen ? '✕' : '✨'}
      </button>
    </div>
  );
};

export default Chatbot;
