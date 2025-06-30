import React, { useState } from 'react';
import axios from 'axios';

const ChatBox: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/ai', { message: input });
      const data = res.data;
      
      // Handle both successful AI response and fallback response
      if (data.ai) {
        setMessages((prev) => [...prev, { role: 'ai', content: data.ai }]);
      } else if (data.fallback) {
        setMessages((prev) => [...prev, { role: 'ai', content: data.fallback }]);
        if (data.error) {
          setError(data.error);
        }
      } else {
        setMessages((prev) => [...prev, { role: 'ai', content: 'Réponse inattendue du serveur' }]);
      }
    } catch (e: any) {
      const errorMessage = e.response?.data?.fallback || e.response?.data?.error || 'Erreur lors de la communication avec l\'IA.';
      setMessages((prev) => [...prev, { role: 'ai', content: errorMessage }]);
      setError(errorMessage);
    }
    setInput('');
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-4 mt-8">
      <h2 className="text-lg font-bold mb-2">Assistant IA</h2>
      <div className="h-64 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-16">Commencez la conversation avec l'IA...</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right mb-2' : 'text-left mb-2'}>
            <span className={m.role === 'user' ? 'inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-lg' : 'inline-block bg-green-100 text-green-800 px-3 py-1 rounded-lg'}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-center text-gray-400">L'IA réfléchit...</div>}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Posez une question à l'IA..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Envoyer
        </button>
      </div>
      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
    </div>
  );
};

export default ChatBox; 