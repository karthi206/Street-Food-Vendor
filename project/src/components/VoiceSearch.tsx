import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Import regenerator-runtime for async/await support
import 'regenerator-runtime/runtime';

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
  placeholder?: string;
}

// Declare SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceSearch({ onResult, placeholder }: VoiceSearchProps) {
  const { t, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.maxAlternatives = 1;
      
      // Set language based on current language setting
      const langMap: { [key: string]: string } = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'ta': 'ta-IN'
      };
      recognitionInstance.lang = langMap[language] || 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          onResult(transcript);
          setTranscript('');
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language, onResult]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full transition-all duration-200 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse shadow-lg' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title={isListening ? t('listening') : t('voiceSearch')}
      >
        {isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>
      
      {isListening && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-10">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Volume2 className="h-4 w-4 animate-pulse" />
            <span>{t('listening')}</span>
          </div>
          {transcript && (
            <div className="mt-2 text-sm text-gray-800 border-t pt-2">
              {transcript}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">
            {t('speakNow')}
          </div>
        </div>
      )}
    </div>
  );
}