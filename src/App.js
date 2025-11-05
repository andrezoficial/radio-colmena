import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, Send, Music, Users, Calendar, Clock, Instagram, 
  Facebook, Twitter, Mail, Phone, Gift, Mic, TrendingUp, 
  MessageSquare, Play, Pause, Volume2, VolumeX, Heart, Share
} from 'lucide-react';

export default function EmisionaOnline() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [listeners, setListeners] = useState(142);
  const [messages, setMessages] = useState([
    { user: 'Ana', text: '¡Excelente música! 🎵', time: '10:30' },
    { user: 'Carlos', text: 'Saludos desde Bogotá', time: '10:32' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [songRequest, setSongRequest] = useState({ name: '', song: '', artist: '', message: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Cargando...');
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef(null);

  const streamUrls = {
    directStream: 'https://uk17freenew.listen2myradio.com/live.mp3?typeportmount=s1_3733_stream_619888809',
    playerPage: 'https://radiocolmena.radiostream123.com/',
    chat: 'http://uk17freenew.listen2myradio.com/chat/frame.php?frameid=3414617'
  };

  // Efecto para el volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Efecto para simular cambios de canción
  useEffect(() => {
    const tracks = [
      'Éxitos del Momento - Mix Top 40',
      'Clásicos de los 80s y 90s',
      'Música Urbana - Lo mejor del reggaeton',
      'Rock Internacional - Los grandes éxitos',
      'Pop Latino - Los favoritos de la radio'
    ];
    
    const interval = setInterval(() => {
      if (isPlaying) {
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        setCurrentTrack(randomTrack);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsBuffering(true);
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioError(false);
            setIsBuffering(false);
          })
          .catch(error => {
            console.log('Error al reproducir:', error);
            setAudioError(true);
            setIsBuffering(false);
          });
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Shortcut de teclado: Espacio para play/pause
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !e.target.type) {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  // Resto de las funciones existentes se mantienen igual...
  const submitRequest = () => {
    if (songRequest.name && songRequest.song) {
      alert('¡Solicitud enviada! La escucharemos pronto en Radio Colmena 🎵');
      setSongRequest({ name: '', song: '', artist: '', message: '' });
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && userName.trim()) {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      setMessages([...messages, { user: userName, text: newMessage, time }]);
      setNewMessage('');
    }
  };

  const openChat = () => {
    window.open(streamUrls.chat, 'ChatWindow', 'location=no,width=250,height=660');
  };

  const shareRadio = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Radio Colmena',
        text: 'Escucha Radio Colmena en vivo',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles! Comparte Radio Colmena 🎵');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`relative ${isPlaying ? 'animate-pulse' : ''}`}>
                <Radio className="w-10 h-10 text-cyan-400" />
                {isPlaying && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Radio Colmena
                </h1>
                <p className="text-sm text-blue-200">Tu música favorita 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">{listeners}</span>
                <span className="text-sm text-blue-200">en vivo</span>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {['inicio', 'programacion', 'locutores', 'solicitudes', 'concursos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'inicio' && (
              <>
                {/* Player Mejorado */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <Music className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl font-bold">En Vivo Ahora</h2>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-8 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                    <div className="relative">
                      <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        {isBuffering ? (
                          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Radio className="w-16 h-16 animate-pulse" />
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="text-3xl font-bold mb-2">Radio Colmena</h3>
                        <p className="text-xl text-blue-100">Transmisión en vivo</p>
                      </div>
                    </div>
                  </div>

                  {/* Reproductor HTML5 Mejorado */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <div className="w-full max-w-4xl mx-auto">
                      {/* Info del track */}
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                          <span className="text-sm text-blue-200">{isPlaying ? 'En vivo' : 'Pausado'}</span>
                        </div>
                        <p className="text-lg font-semibold text-cyan-300 truncate">
                          {currentTrack}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-cyan-400 to-blue-600 p-3 rounded-full">
                            <Radio className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Radio Colmena Online</h3>
                            <p className="text-sm text-blue-200">
                              Stream directo MP3 - Sin redirecciones
                            </p>
                          </div>
                        </div>
                        
                        {/* Botones de acción rápida */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={shareRadio}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            title="Compartir radio"
                          >
                            <Share className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(streamUrls.playerPage, '_blank')}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            title="Abrir reproductor oficial"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Controles de audio mejorados */}
                      <div className="flex flex-col items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          {/* Control de volumen */}
                          <div className="relative">
                            <button
                              onClick={toggleMute}
                              onMouseEnter={() => setShowVolume(true)}
                              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="w-5 h-5" />
                              ) : (
                                <Volume2 className="w-5 h-5" />
                              )}
                            </button>
                            
                            {showVolume && (
                              <div 
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-lg rounded-lg p-3"
                                onMouseLeave={() => setShowVolume(false)}
                              >
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={volume}
                                  onChange={handleVolumeChange}
                                  className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
                                />
                              </div>
                            )}
                          </div>

                          {/* Botón principal play/pause */}
                          <button
                            onClick={togglePlay}
                            disabled={isBuffering}
                            className={`p-6 rounded-full transition-all transform hover:scale-105 active:scale-95 ${
                              isPlaying 
                                ? 'bg-red-500 hover:bg-red-600 shadow-lg' 
                                : 'bg-green-500 hover:bg-green-600 shadow-lg'
                            } ${isBuffering ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isBuffering ? (
                              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : isPlaying ? (
                              <Pause className="w-8 h-8 text-white" />
                            ) : (
                              <Play className="w-8 h-8 text-white" />
                            )}
                          </button>

                          {/* Botón de chat */}
                          <button
                            onClick={openChat}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            title="Abrir chat en vivo"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-semibold text-blue-100">
                            {isBuffering ? '🔄 Cargando...' : 
                             isPlaying ? '🎵 Reproduciendo en vivo...' : 
                             '▶️ Haz clic para reproducir'}
                          </p>
                          <p className="text-sm text-blue-300 mt-1">
                            Presiona <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Espacio</kbd> para play/pause
                          </p>
                          {audioError && (
                            <p className="text-sm text-red-400 mt-2">
                              Error de reproducción. Usa el reproductor oficial como alternativa.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Audio element (oculto) */}
                      <audio
                        ref={audioRef}
                        src={streamUrls.directStream}
                        preload="none"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                        onError={() => {
                          setAudioError(true);
                          setIsPlaying(false);
                          setIsBuffering(false);
                        }}
                        onWaiting={() => setIsBuffering(true)}
                        onCanPlay={() => setIsBuffering(false)}
                      />

                      {/* Acciones rápidas mejoradas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <button
                          onClick={() => window.open(streamUrls.playerPage, '_blank')}
                          className="px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 hover:scale-105 transform transition-transform"
                        >
                          <span>📻</span>
                          <span>Abrir Reproductor Oficial</span>
                        </button>
                        
                        <button
                          onClick={openChat}
                          className="px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 hover:scale-105 transform transition-transform"
                        >
                          <span>💬</span>
                          <span>Chat en Vivo</span>
                        </button>
                      </div>

                      {/* Información técnica mejorada */}
                      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <p className="text-sm text-blue-200 mb-2">
                          ℹ️ <strong>Mejor experiencia de audio</strong>
                        </p>
                        <p className="text-xs text-blue-300">
                          Stream directo MP3 • Control de volumen • Atajos de teclado • Sin redirecciones
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats - Con hover effects */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-colors hover:scale-105 transform duration-200"
                    >
                      <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-blue-200">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Resto del contenido se mantiene igual... */}
              </>
            )}

            {/* Los otros tabs se mantienen exactamente igual */}
            {activeTab === 'programacion' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                {/* Contenido igual... */}
              </div>
            )}

            {/* ... resto de tabs igual */}
          </div>

          {/* Chat Sidebar - Mejorado */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 flex flex-col h-[calc(100vh-200px)] lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Chat en Vivo</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Conectado</span>
              </div>
            </div>
            
            {!userName ? (
              <div className="space-y-4">
                <p className="text-blue-200">Únete a la conversación:</p>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userName.trim() && setUserName(userName)}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-500 text-white placeholder-blue-300 transition-colors"
                />
                <button
                  onClick={() => userName.trim() && setUserName(userName)}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity hover:scale-105 transform"
                >
                  Entrar al Chat
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-cyan-400">{msg.user}</span>
                        <span className="text-xs text-blue-300">{msg.time}</span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-500 text-white placeholder-blue-300 transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-cyan-400 to-blue-600 p-2 rounded-lg hover:opacity-90 transition-opacity hover:scale-105 transform"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-lg border-t border-white/10 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-blue-200">© 2025 Radio Colmena - Todos los derechos reservados</p>
          <p className="text-sm text-blue-300 mt-2">Transmitiendo música desde Colombia para el mundo 🌎</p>
        </div>
      </footer>
    </div>
  );
}