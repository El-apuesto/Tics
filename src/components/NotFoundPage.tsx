import { useState, useEffect } from 'react';

export function NotFoundPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [keyStrokes, setKeyStrokes] = useState(0);

  // Reveal login after Alt+Space+Enter ONLY
  const revealLogin = () => {
    setShowLogin(true);
  };

  // Check for Alt+Space+Enter combo ONLY on 404 page
  useEffect(() => {
    const keysPressed = new Set();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key);
      
      // Check for Alt+Space+Enter
      if (e.altKey && e.key === ' ' && keysPressed.has('Enter')) {
        e.preventDefault();
        revealLogin();
        keysPressed.clear();
      }
      
      // Handle key strokes for visual feedback
      if (showLogin) {
        setKeyStrokes(prev => prev + 1);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [showLogin]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        {/* 404 Error Message */}
        {!showLogin ? (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              <span className="inline-block animate-bounce">🎭</span>
              <span className="inline-block animate-pulse delay-100">🤪</span>
              <span className="inline-block animate-spin delay-200">🌀</span>
              <span className="inline-block animate-bounce delay-300">🎯</span>
            </div>
            <h1 className="font-display font-black text-4xl lg:text-5xl mb-4">
              404 - <span className="text-primary animate-pulse">Tic'd</span> Away!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Well butter my biscuit! 🦋 That page did a <span className="font-bold text-primary">ninja vanish</span> 
              <span className="inline-block animate-bounce delay-400">💨</span> 
              and now it's <span className="inline-block animate-spin delay-500">🌀</span> 
              <span className="inline-block animate-pulse delay-600">lost in the sauce</span>! 
              <span className="inline-block animate-bounce delay-700">🎯</span>
            </p>
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground space-x-2">
                <span>Press </span>
                <span className="font-mono bg-muted px-2 py-1 rounded animate-pulse">Alt+Space+Enter</span>
                <span> for </span>
                <span className="inline-block animate-bounce delay-100">🎭</span>
                <span> instant access!</span>
              </div>
            </div>
          </div>
        ) : (
          /* 404 Message with Red X's */
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              <span className="inline-block animate-bounce">🎭</span>
              <span className="inline-block animate-pulse delay-100">🤪</span>
              <span className="inline-block animate-spin delay-200">🌀</span>
              <span className="inline-block animate-bounce delay-300">🎯</span>
            </div>
            <h1 className="font-display font-black text-4xl lg:text-5xl mb-4">
              404 - <span className="text-primary animate-pulse">Tic'd</span> Away!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Well butter my biscuit! 🦋 That page did a <span className="font-bold text-primary">ninja vanish</span> 
              <span className="inline-block animate-bounce delay-400">💨</span> 
              and now it's <span className="inline-block animate-spin delay-500">🌀</span> 
              <span className="inline-block animate-pulse delay-600">lost in the sauce</span>! 
              <span className="inline-block animate-bounce delay-700">🎯</span>
            </p>
            
            {/* Red X's appearing on page */}
            <div className="fixed inset-0 pointer-events-none z-50">
              <div className="flex gap-1 justify-center items-center h-full">
                {Array.from({ length: keyStrokes }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index % 3 === 0 ? 'bg-red-500 animate-bounce' :
                      index % 3 === 1 ? 'bg-yellow-500 animate-pulse' :
                      index % 3 === 2 ? 'bg-green-500 animate-spin' :
                      'bg-blue-500 animate-pulse'
                    }`}
                    style={{
                      position: 'absolute',
                      left: `${20 + (index % 4) * 8}%`,
                      top: `${20 + Math.floor(index / 4) * 8}%`,
                      animation: `fadeInOut 0.3s ease ${index * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.5); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
      `}} />
    </div>
  );
}
