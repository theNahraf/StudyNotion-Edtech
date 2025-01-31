import React, { useState } from 'react';
import axios from 'axios';

const ChatXPro = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/ask', { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error getting response:", error);
      setAnswer('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Ask Doubt With xAi </h2>
        
        {/* Chat Form */}
        <form onSubmit={handleSubmit} className="flex flex-col ">
          <textarea
            className="w-full form-style p-4 mb-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your coding question here..."
            rows="5"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Send'}
          </button>
        </form>

        {/* AI Response Section */}
        {answer && (
          <div className="mt-6 bg-gray-700 p-4 rounded-md">
            <h3 className="text-xl font-semibold">AI Response:</h3>
            <p className="mt-2">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatXPro;
