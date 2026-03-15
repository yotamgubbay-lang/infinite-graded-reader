"use client"; // <--- MUST BE THE VERY FIRST LINE

import { useState } from 'react';
import Reader from '../components/Reader';

export default function Home() {
  const [level, setLevel] = useState('A1');
  const [topic, setTopic] = useState('');
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'Spanish', level, topic: topic || 'Travel' }),
      });
      
      if (!res.ok) throw new Error("Server error");
      
      const data = await res.json();
      setStory(data);
    } catch (e) {
      console.error(e);
      alert("Failed to connect to AI. Check your API Key in Vercel settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      {!story ? (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-center">Infinite Graded Reader</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Level</label>
              <select className="w-full p-2 border rounded" onChange={(e) => setLevel(e.target.value)}>
                <option>A1</option><option>A2</option><option>B1</option><option>B2</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500">Topic</label>
              <input className="w-full p-2 border rounded" placeholder="e.g. Travel, Cooking..." onChange={(e) => setTopic(e.target.value)} />
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? "AI is writing..." : "Generate Story"}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStory(null)} className="mb-6 text-blue-600 font-medium">← Create New Story</button>
          <Reader data={story} />
        </div>
      )}
    </main>
  );
}
