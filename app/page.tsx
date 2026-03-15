"use client";
import { useState } from 'react';
import Reader from '../components/Reader';

export default function Home() {
  const [topic, setTopic] = useState('Travel');
  const [level, setLevel] = useState('A1');
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateStory() {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ language: 'Spanish', level, topic }),
      });
      const data = await res.json();
      setStory(data);
    } catch (e) {
      alert("Error generating story");
    } finally {
      setLoading(false);
    }
  }

  if (story) {
    return (
      <div>
        <button 
          onClick={() => setStory(null)}
          className="m-4 text-sm text-blue-600 underline"
        >
          ← Back to Settings
        </button>
        <Reader data={story} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Infinite Reader</h1>
        
        <label className="block mb-2 text-sm font-medium text-slate-600">Difficulty Level</label>
        <select 
          className="w-full mb-4 p-3 border rounded-lg bg-slate-50"
          value={level} 
          onChange={(e) => setLevel(e.target.value)}
        >
          <option>A1</option><option>A2</option><option>B1</option><option>B2</option>
        </select>

        <label className="block mb-2 text-sm font-medium text-slate-600">Topic</label>
        <input 
          className="w-full mb-6 p-3 border rounded-lg bg-slate-50"
          placeholder="e.g. Space, Cooking, History..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button 
          onClick={generateStory}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all disabled:bg-blue-300"
        >
          {loading ? "Generating Story..." : "Generate My Story"}
        </button>
      </div>
    </div>
  );
}
