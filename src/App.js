import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, Send, Music, Users, Calendar, Clock, Instagram, 
  Facebook, Twitter, Mail, Phone, Gift, Mic, TrendingUp, 
  MessageSquare, Play, Pause, AlertTriangle 
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
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const audioRef = useRef(null);

  // Sistema de streams principales y de respaldo
  const streamSources = [
    {
      url: 'https://uk14freenew.listen2myradio.com/live.mp3?typeportmount=s1_22602_stream_569004243',
      name: 'Stream Principal 1',
      server: 'uk14'
    },
    {
      url: 'https://uk17freenew.listen2myradio.com/live.mp3?typeportmount=s1_3733_stream_619888809',
      name: 'Stream Principal 2',
      server: 'uk17'
    }
  ];

  const backupPlayers = [
    {
      url: 'https://radiocolmena.radiostream321.com/',
      name: 'Reproductor Oficial 1'
    },
    {
      url: 'https://radiocolmena.radiostream123.com/',
      name: 'Reproductor Oficial 2'
    }
  ];

  const chatUrls = [
    'http://uk17freenew.listen2myradio.com/chat/frame.php?frameid=3414617',
    'http://uk14freenew.listen2myradio.com/chat/frame.php?frameid=3414617'
  ];

  const [currentChatIndex, setCurrentChatIndex] = useState(0);

  const programas = [
    { hora: '06:00 - 09:00', nombre: 'Mañanas Colmena', dj: 'DJ Mateo', tipo: 'Música variada' },
    { hora: '09:00 - 12:00', nombre: 'Éxitos del Momento', dj: 'DJ Carolina', tipo: 'Top hits' },
    { hora: '12:00 - 15:00', nombre: 'Mediodía Musical', dj: 'DJ Santiago', tipo: 'Rock y pop' },
    { hora: '15:00 - 18:00', nombre: 'Tarde Urbana', dj: 'DJ Laura', tipo: 'Reggaeton y urbano' },
    { hora: '18:00 - 21:00', nombre: 'Noche de Oro', dj: 'DJ Andrés', tipo: 'Clásicos' },
    { hora: '21:00 - 00:00', nombre: 'Zona Electrónica', dj: 'DJ Valentina', tipo: 'Electronic/Dance' }
  ];

  const locutores = [
    { nombre: 'DJ Mateo', programa: 'Mañanas Colmena', especialidad: 'Música variada', foto: '👨‍🎤' },
    { nombre: 'DJ Carolina', programa: 'Éxitos del Momento', especialidad: 'Top hits internacional', foto: '👩‍🎤' },
    { nombre: 'DJ Santiago', programa: 'Mediodía Musical', especialidad: 'Rock & Pop', foto: '👨‍🎤' },
    { nombre: 'DJ Laura', programa: 'Tarde Urbana', especialidad: 'Música urbana', foto: '👩‍🎤' }
  ];

  const stats = [
    { label: 'Oyentes Mensuales', value: '50K+', icon: Users },
    { label: 'Horas al Aire', value: '24/7', icon: Clock },
    { label: 'Países Alcanzados', value: '25+', icon: TrendingUp },
    { label: 'Mensajes del Mes', value: '1.2K', icon: MessageSquare }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setListeners(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(100, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tryNextStream = () => {
    const nextIndex = (currentStreamIndex + 1) % streamSources.length;
    setCurrentStreamIndex(nextIndex);
    
    if (isPlaying) {
      setTimeout(() => {
        togglePlay();
      }, 1000);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsBuffering(false);
      } else {
        setIsBuffering(true);
        setAudioError(false);

        audioRef.current.src = streamSources[currentStreamIndex].url;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioError(false);
            setIsBuffering(false);
          })
          .catch(error => {
            console.log('Error al reproducir:', error);
            setAudioError(true);
            setIsPlaying(false);
            setIsBuffering(false);
            
            // Intentar con el siguiente stream después de 2 segundos
            setTimeout(tryNextStream, 2000);
          });
      }
    }
  };

  const openPlayer = (url) => {
    window.open(url, '_blank');
  };

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
    // Rotar entre los chats disponibles
    const nextChatIndex = (currentChatIndex + 1) % chatUrls.length;
    setCurrentChatIndex(nextChatIndex);
    window.open(chatUrls[nextChatIndex], 'ChatWindow', 'location=no,width=250,height=660');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#0D0D0D] to-[#1a1a2e] text-white">
      {/* Header */}
      <header className="bg-[#0D0D0D] backdrop-blur-lg border-b border-[#FFC300]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Radio className="w-10 h-10 text-[#FFC300] animate-pulse" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFC300] to-[#FF2E93] bg-clip-text text-transparent">
                  Radio Colmena
                </h1>
                <p className="text-sm text-[#9B5DE5]">Tu música favorita 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#FFFFFF]/10 px-4 py-2 rounded-lg">
                <Users className="w-4 h-4 text-[#FFC300]" />
                <span className="font-semibold">{listeners}</span>
                <span className="text-sm text-[#9B5DE5]">en vivo</span>
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
                    ? 'bg-gradient-to-r from-[#FFC300] to-[#FF2E93] text-[#0D0D0D]'
                    : 'bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-white'
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
                {/* Player */}
                <div className="bg-[#FFFFFF]/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-[#FFC300]/20">
                  <div className="flex items-center gap-3 mb-6">
                    <Music className="w-6 h-6 text-[#FFC300]" />
                    <h2 className="text-2xl font-bold">En Vivo Ahora</h2>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#9B5DE5] to-[#FF2E93] rounded-xl p-8 mb-6">
                    <div className="w-32 h-32 bg-[#FFFFFF]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {isBuffering ? (
                        <div className="w-16 h-16 border-4 border-[#FFC300] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Radio className="w-16 h-16 animate-pulse" />
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-3xl font-bold mb-2">Radio Colmena</h3>
                      <p className="text-xl text-[#FFFFFF]/90">Transmisión en vivo</p>
                    </div>
                  </div>

                  {/* Reproductor HTML5 */}
                  <div className="bg-[#FFFFFF]/5 rounded-xl p-6">
                    <div className="w-full max-w-4xl mx-auto">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-[#FFC300] to-[#FF2E93] p-3 rounded-full">
                            <Radio className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Radio Colmena Online</h3>
                            <p className="text-sm text-[#9B5DE5]">
                              {streamSources[currentStreamIndex].name} - Servidor {streamSources[currentStreamIndex].server}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-[#00A8E8] animate-pulse' : 'bg-[#FF2E93]'}`} />
                          <span className="text-sm text-[#9B5DE5]">
                            {isPlaying ? 'En vivo' : 'Pausado'}
                          </span>
                        </div>
                      </div>

                      {/* Controles de audio */}
                      <div className="flex flex-col items-center gap-4 mb-6">
                        <button
                          onClick={togglePlay}
                          disabled={isBuffering}
                          className={`p-6 rounded-full transition-all transform hover:scale-105 ${
                            isPlaying 
                              ? 'bg-[#FF2E93] hover:bg-[#e82a84] shadow-lg' 
                              : 'bg-[#00A8E8] hover:bg-[#0097d0] shadow-lg'
                          } ${isBuffering ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isBuffering ? (
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : isPlaying ? (
                            <Pause className="w-12 h-12 text-white" />
                          ) : (
                            <Play className="w-12 h-12 text-white" />
                          )}
                        </button>
                        
                        <div className="text-center">
                          <p className="text-lg font-semibold text-[#FFFFFF]/90">
                            {isBuffering ? '🔄 Conectando...' : 
                             isPlaying ? '🎵 Reproduciendo en vivo...' : 
                             '▶️ Haz clic para reproducir'}
                          </p>
                          {audioError && (
                            <p className="text-sm text-[#FFC300] mt-2">
                              Probando siguiente stream automáticamente...
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Audio element (oculto) */}
                      <audio
                        ref={audioRef}
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

                      {/* Información del sistema de respaldo */}
                      <div className="mt-4 p-4 bg-[#00A8E8]/10 rounded-lg border border-[#00A8E8]/30">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-[#FFC300]" />
                          <p className="text-sm text-[#00A8E8] font-semibold">
                            Sistema de respaldo activo: {streamSources.length} streams + {backupPlayers.length} reproductores
                          </p>
                        </div>
                        <p className="text-xs text-[#00A8E8]/80">
                          Si un stream falla, se probará automáticamente con el siguiente disponible
                        </p>
                      </div>

                      {/* Información y controles adicionales */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <button
                          onClick={() => openPlayer(backupPlayers[0].url)}
                          className="px-4 py-3 bg-[#9B5DE5] rounded-lg hover:bg-[#8a4fd4] transition-colors flex items-center justify-center gap-2"
                        >
                          <span>📻</span>
                          <span>Abrir Reproductor Oficial</span>
                        </button>
                        
                        <button
                          onClick={openChat}
                          className="px-4 py-3 bg-[#FF2E93] rounded-lg hover:bg-[#e82a84] transition-colors flex items-center justify-center gap-2"
                        >
                          <span>💬</span>
                          <span>Abrir Chat en Vivo</span>
                        </button>
                      </div>

                      {/* Información técnica */}
                      <div className="mt-6 p-4 bg-[#00A8E8]/10 rounded-lg border border-[#00A8E8]/30">
                        <p className="text-sm text-[#00A8E8] mb-2">
                          ℹ️ <strong>Información técnica:</strong>
                        </p>
                        <p className="text-xs text-[#00A8E8]/80">
                          Usando stream directo MP3 para evitar redirecciones. 
                          Calidad estable y menor consumo de recursos.
                        </p>
                      </div>

                      {/* Enlaces directos para apps externas */}
                      <div className="mt-4 space-y-3">
                        <div className="p-4 bg-[#FFC300]/10 rounded-lg border border-[#FFC300]/30">
                          <p className="text-sm text-[#FFC300] mb-2">
                            🔗 <strong>Streams disponibles para apps externas:</strong>
                          </p>
                          <div className="space-y-2">
                            {streamSources.map((stream, index) => (
                              <div key={index} className="bg-[#0D0D0D] px-3 py-2 rounded-lg">
                                <code className="text-xs text-[#FFC300] break-all">
                                  {stream.url}
                                </code>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-[#FFFFFF]/10 backdrop-blur-lg rounded-xl p-4 border border-[#FFC300]/20 text-center">
                      <stat.icon className="w-8 h-8 text-[#FFC300] mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-[#9B5DE5]">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div className="bg-[#FFFFFF]/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-[#FFC300]/20">
                  <h3 className="text-xl font-bold mb-4">Síguenos en Redes</h3>
                  <div className="flex flex-wrap gap-4">
                    <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-[#FF2E93] to-[#9B5DE5] px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                      <Instagram className="w-5 h-5" />
                      <span>Instagram</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-[#00A8E8] px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                      <Facebook className="w-5 h-5" />
                      <span>Facebook</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-[#9B5DE5] px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                      <Twitter className="w-5 h-5" />
                      <span>Twitter</span>
                    </a>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#FFFFFF]/20 space-y-2">
                    <p className="flex items-center gap-2 text-[#9B5DE5]">
                      <Mail className="w-4 h-4" />
                      <span>contacto@radiocolmena.com</span>
                    </p>
                    <p className="flex items-center gap-2 text-[#9B5DE5]">
                      <Phone className="w-4 h-4" />
                      <span>+57 300 123 4567</span>
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Resto de los tabs se mantienen igual */}
            {activeTab === 'programacion' && (
              <div className="bg-[#FFFFFF]/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-[#FFC300]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-[#FFC300]" />
                  <h2 className="text-2xl font-bold">Programación Diaria</h2>
                </div>
                <div className="space-y-3">
                  {programas.map((prog, idx) => (
                    <div key={idx} className="bg-[#FFFFFF]/5 rounded-lg p-4 hover:bg-[#FFFFFF]/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-[#FFC300] to-[#FF2E93] p-2 rounded-lg">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{prog.nombre}</h3>
                            <p className="text-sm text-[#9B5DE5]">{prog.hora}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#FFC300]">{prog.dj}</p>
                          <p className="text-xs text-[#00A8E8]">{prog.tipo}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'locutores' && (
              <div className="bg-[#FFFFFF]/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-[#FFC300]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Mic className="w-6 h-6 text-[#FFC300]" />
                  <h2 className="text-2xl font-bold">Nuestros Locutores</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {locutores.map((locutor, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-[#9B5DE5] to-[#FF2E93] rounded-xl p-6">
                      <div className="text-6xl mb-3 text-center">{locutor.foto}</div>
                      <h3 className="text-xl font-bold text-center mb-2">{locutor.nombre}</h3>
                      <p className="text-[#FFFFFF]/90 text-center mb-1">{locutor.programa}</p>
                      <p className="text-sm text-[#FFFFFF]/80 text-center">{locutor.especialidad}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'solicitudes' && (
              <div className="bg-[#FFFFFF]/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-[#FFC300]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Music className="w-6 h-6 text-[#FFC300]" />
                  <h2 className="text-2xl font-bold">Solicita tu Canción</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tu Nombre</label>
                    <input
                      type="text"
                      value={songRequest.name}
                      onChange={(e) => setSongRequest({...songRequest, name: e.target.value})}
                      className="w-full px-4 py-2 bg-[#FFFFFF]/10 rounded-lg border border-[#FFFFFF]/20 focus:outline-none focus:border-[#FFC300] text-white placeholder-[#9B5DE5]"
                      placeholder="Escribe tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Canción</label>
                    <input
                      type="text"
                      value={songRequest.song}
                      onChange={(e) => setSongRequest({...songRequest, song: e.target.value})}
                      className="w-full px-4 py-2 bg-[#FFFFFF]/10 rounded-lg border border-[#FFFFFF]/20 focus:outline-none focus:border-[#FFC300] text-white placeholder-[#9B5DE5]"
                      placeholder="Nombre de la canción"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Artista</label>
                    <input
                      type="text"
                      value={songRequest.artist}
                      onChange={(e) => setSongRequest({...songRequest, artist: e.target.value})}
                      className="w-full px-4 py-2 bg-[#FFFFFF]/10 rounded-lg border border-[#FFFFFF]/20 focus:outline-none focus:border-[#FFC300] text-white placeholder-[#9B5DE5]"
                      placeholder="Nombre del artista"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mensaje (Opcional)</label>
                    <textarea
                      value={songRequest.message}
                      onChange={(e) => setSongRequest({...songRequest, message: e.target.value})}
                      className="w-full px-4 py-2 bg-[#FFFFFF]/10 rounded-lg border border-[#FFFFFF]/20 focus:outline-none focus:border-[#FFC300] text-white placeholder-[#9B5DE5] h-24"
                      placeholder="Dedica esta canción o envía un saludo..."
                    />
                  </div>
                  <button
                    onClick={submitRequest}
                    className="w-full bg-gradient-to-r from-[#FFC300] to-[#FF2E93] py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                  >
                    Enviar Solicitud
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'concursos' && (
              <div className="bg-[#FFFFFF]/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-[#FFC300]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="w-6 h-6 text-[#FFC300]" />
                  <h2 className="text-2xl font-bold">Concursos y Sorteos</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-[#FFC300] to-[#FF2E93] rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-2">🎁 Concurso del Mes</h3>
                    <p className="text-lg mb-4">Gana entradas para el concierto más esperado del año</p>
                    <div className="bg-[#0D0D0D]/30 rounded-lg p-4 mb-4">
                      <p className="font-semibold mb-2">Cómo participar:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Síguenos en todas nuestras redes sociales</li>
                        <li>Comparte esta publicación</li>
                        <li>Etiqueta a 3 amigos</li>
                        <li>Escucha Radio Colmena y espera la palabra clave</li>
                      </ol>
                    </div>
                    <p className="text-sm">Sorteo: 30 de Noviembre, 2025</p>
                  </div>

                  <div className="bg-[#FFFFFF]/5 rounded-lg p-4">
                    <h4 className="font-bold mb-2">📻 Oyente del Día</h4>
                    <p className="text-sm text-[#9B5DE5]">Participa en nuestro chat y podrías ganar merchandising exclusivo de Radio Colmena</p>
                  </div>

                  <div className="bg-[#FFFFFF]/5 rounded-lg p-4">
                    <h4 className="font-bold mb-2">🎵 Adivina la Canción</h4>
                    <p className="text-sm text-[#9B5DE5]">Todos los viernes a las 8 PM. Sé el primero en identificar la canción y gana premios</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Sidebar */}
          <div className="bg-[#FFFFFF]/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-[#FFC300]/20 flex flex-col h-[calc(100vh-200px)] lg:sticky lg:top-24">
            <h3 className="text-xl font-bold mb-4">Chat en Vivo</h3>
            
            {!userName ? (
              <div className="space-y-4">
                <p className="text-[#9B5DE5]">Únete a la conversación:</p>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userName.trim() && setUserName(userName)}
                  className="w-full px-4 py-2 bg-[#FFFFFF]/10 rounded-lg border border-[#FFFFFF]/20 focus:outline-none focus:border-[#FFC300] text-white placeholder-[#9B5DE5]"
                />
                <button
                  onClick={() => userName.trim() && setUserName(userName)}
                  className="w-full bg-gradient-to-r from-[#FFC300] to-[#FF2E93] py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Entrar al Chat
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className="bg-[#FFFFFF]/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#FFC300]">{msg.user}</span>
                        <span className="text-xs text-[#00A8E8]">{msg.time}</span>
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
                    className="flex-1 px-4 py-2 bg-[#FFFFFF]/10 rounded-lg border border-[#FFFFFF]/20 focus:outline-none focus:border-[#FFC300] text-white placeholder-[#9B5DE5]"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-[#FFC300] to-[#FF2E93] p-2 rounded-lg hover:opacity-90 transition-opacity"
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
      <footer className="bg-[#0D0D0D] backdrop-blur-lg border-t border-[#FFC300]/10 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#9B5DE5]">© 2025 Radio Colmena - Todos los derechos reservados</p>
          <p className="text-sm text-[#00A8E8] mt-2">Transmitiendo música desde Colombia para el mundo 🌎</p>
        </div>
      </footer>
    </div>
  );
}