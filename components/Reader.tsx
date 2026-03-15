"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Reader({ data }: any) {
  const [selectedWord, setSelectedWord] = useState<any>(null);

  return (
    <div className="max-w-2xl mx-auto p-6 font-serif">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      {data.story_paragraphs.map((p: string, i: number) => (
        <p key={i} className="text-xl mb-4 leading-relaxed">
          {p.split(' ').map((word, j) => {
            const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
            const isGlossary = data.glossary.find((g: any) => g.word.toLowerCase() === cleanWord.toLowerCase());
            return isGlossary ? (
              <span key={j} onClick={() => setSelectedWord(isGlossary)} className="text-blue-600 border-b-2 border-blue-200 cursor-pointer mx-0.5">{word} </span>
            ) : <span key={j}>{word} </span>;
          })}
        </p>
      ))}

      <AnimatePresence>
        {selectedWord && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-6 border-t z-50">
            <button onClick={() => setSelectedWord(null)} className="absolute top-2 right-2"><X /></button>
            <h3 className="text-xl font-bold">{selectedWord.word}</h3>
            <p className="text-gray-600 italic">{selectedWord.translation}</p>
            <p className="mt-2 text-sm text-gray-400">{selectedWord.context}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
