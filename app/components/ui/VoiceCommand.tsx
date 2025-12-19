'use client';

import 'regenerator-runtime/runtime';
import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, ChevronDown } from 'lucide-react';

export default function VoiceCommand() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper to execute and show feedback
  const execute = (action: string, func: () => void) => {
    setLastCommand(action);
    func();
    // Clear the feedback after 2 seconds
    setTimeout(() => setLastCommand(''), 2000);
  };

  const commands = [
    {
      // Match any of these phrases
      command: ['go home', 'home', 'back to home'],
      callback: () => execute('Going Home...', () => router.push('/')),
      isFuzzyMatch: true
    },
    {
      command: ['scroll down', 'go down', 'move down', 'down'],
      callback: () => execute('Scrolling Down', () => window.scrollBy({ top: 400, behavior: 'smooth' })),
      isFuzzyMatch: true
    },
    {
      command: ['scroll up', 'go up', 'move up', 'up'],
      callback: () => execute('Scrolling Up', () => window.scrollBy({ top: -400, behavior: 'smooth' })),
      isFuzzyMatch: true
    },
    {
      command: ['top', 'top of page'],
      callback: () => execute('To the Top', () => window.scrollTo({ top: 0, behavior: 'smooth' })),
      isFuzzyMatch: true
    }
  ];

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ commands });

  if (!isClient || !browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      
      {/* Show Last Executed Command (Green Box) */}
      {lastCommand && (
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm mb-1 shadow-lg font-bold animate-bounce">
          ? {lastCommand}
        </div>
      )}

      {/* Show Live Transcript (Black Box) */}
      {listening && transcript && !lastCommand && (
        <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm mb-2 shadow-lg">
          "{transcript}"
        </div>
      )}

      <button
        onClick={listening ? SpeechRecognition.stopListening : () => SpeechRecognition.startListening({ continuous: true, language: 'en-US' })}
        className={`p-4 rounded-full shadow-xl transition-all ${
          listening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-200' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {listening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
    </div>
  );
}
