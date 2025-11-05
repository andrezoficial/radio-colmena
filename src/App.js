import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Send, Music, Users, Calendar, Clock, Instagram, Facebook, Twitter, Mail, Phone, Gift, Mic, TrendingUp, MessageSquare } from 'lucide-react';

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
  
  // Estados para el reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStream, setCurrentStream] = useState(0);
  const audioRef = useRef(null);

  // Todas las URLs posibles para probar
  const streamUrls = [
    { url: "http://s33.myradiostream.com:18640/stream", name: "/stream" },
    { url: "http://s33.myradiostream.com:18640/listen.mp3", name: "/listen.mp3" },
    { url: "http://s33.myradiostream.com:18640/", name: "/ (raíz)" },
    { url: "http://s33.myradiostream.com:18640/;", name: "/;" },
    { url: "http://s33.myradiostream.com:18640/stream.mp3", name: "/stream.mp3" },
    { url: "http://s33.myradiostream.com:18640/listen", name: "/listen" }
  ];

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

  // Funciones del reproductor
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('Error al reproducir:', error);
          alert(`No se pudo conectar con ${streamUrls[currentStream].name}. Probaremos otra URL.`);
          tryNextStream();
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const tryNextStream = () => {
    if (currentStream < streamUrls.length - 1) {
      setCurrentStream(prev => prev + 1);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error);
        }
      }, 1000);
    } else {
      alert('Se probaron todas las URLs posibles. Verifica que Mixxx esté transmitiendo.');
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const changeStream = (index) => {
    setCurrentStream(index);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setTimeout(() => {
        audioRef.current.play().catch(console.error);
      }, 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setListeners(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() && userName.trim()) {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      setMessages([...messages, { user: userName, text: newMessage, time }]);
      setNewMessage('');
    }
  };

  const submitRequest = () => {
    if (songRequest.name && songRequest.song) {
      alert('¡Solicitud enviada! La escucharemos pronto en Radio Colmena 🎵');
      setSongRequest({ name: '', song: '', artist: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Radio className="w-10 h-10 text-cyan-400 animate-pulse" />
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
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20'
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
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <Music className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl font-bold">En Vivo Ahora</h2>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-8 mb-6">
                    <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Radio className="w-16 h-16 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-3xl font-bold mb-2">Radio Colmena</h3>
                      <p className="text-xl text-blue-100">Transmisión en vivo</p>
                    </div>
                  </div>

                  {/* REPRODUCTOR DE AUDIO MEJORADO */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <div className="w-full max-w-md mx-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="bg-gradient-to-r from-cyan-400 to-blue-600 p-3 rounded-full hover:opacity-90 transition-opacity"
                          >
                            {isPlaying ? 
                              <Pause className="w-6 h-6" /> : 
                              <Play className="w-6 h-6" />
                            }
                          </button>
                          <div>
                            <h3 className="font-bold text-lg">Radio Colmena</h3>
                            <p className="text-sm text-blue-200">
                              {isPlaying ? 'En vivo ahora' : 'Presiona play para escuchar'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsMuted(!isMuted);
                              if (audioRef.current) {
                                audioRef.current.muted = !isMuted;
                              }
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            {isMuted ? 
                              <VolumeX className="w-5 h-5" /> : 
                              <Volume2 className="w-5 h-5" />
                            }
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-20 accent-cyan-400"
                          />
                        </div>
                      </div>

                      {/* Reproductor de audio con todas las opciones */}
                      <audio
                        id="radio-stream"
                        ref={audioRef}
                        src={streamUrls[currentStream].url}
                        crossOrigin="anonymous"
                        onPlay={() => {
                          setIsPlaying(true);
                          console.log('🎵 Reproduciendo:', streamUrls[currentStream].url);
                        }}
                        onPause={() => setIsPlaying(false)}
                        onError={(e) => {
                          console.error('Error del reproductor:', e);
                          setIsPlaying(false);
                        }}
                        onLoadStart={() => console.log('🔄 Cargando:', streamUrls[currentStream].url)}
                        onCanPlay={() => console.log('✅ Listo:', streamUrls[currentStream].url)}
                      />
                      
                      {/* Indicador de estado */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                        <span className="text-sm text-blue-200">
                          {isPlaying ? 'Conectado - Transmisión en vivo' : `Desconectado - URL: ${streamUrls[currentStream].name}`}
                        </span>
                      </div>

                      {/* Selector de URLs */}
                      <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                        <p className="text-sm text-blue-200 mb-2">
                          🔄 Selecciona la URL correcta:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {streamUrls.map((stream, index) => (
                            <button
                              key={index}
                              onClick={() => changeStream(index)}
                              className={`px-2 py-1 rounded text-xs ${
                                currentStream === index
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-white/10 hover:bg-white/20'
                              }`}
                            >
                              {stream.name}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-blue-300 mt-2">
                          Actual: <strong>{streamUrls[currentStream].url}</strong>
                        </p>
                      </div>

                      {/* Información de ayuda */}
                      <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                        <p className="text-sm text-yellow-200">
                          💡 <strong>Solución:</strong> Si ninguna URL funciona, verifica:
                        </p>
                        <ul className="text-xs text-yellow-200 mt-1 list-disc list-inside">
                          <li>Que Mixxx esté transmitiendo (botón Broadcast en verde)</li>
                          <li>Que el servidor s33.myradiostream.com esté online</li>
                          <li>Que el firewall permita la conexión</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                      <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-blue-200">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                  <h3 className="text-xl font-bold mb-4">Síguenos en Redes</h3>
                  <div className="flex flex-wrap gap-4">
                    <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                      <Instagram className="w-5 h-5" />
                      <span>Instagram</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                      <Facebook className="w-5 h-5" />
                      <span>Facebook</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-sky-500 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                      <Twitter className="w-5 h-5" />
                      <span>Twitter</span>
                    </a>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                    <p className="flex items-center gap-2 text-blue-200">
                      <Mail className="w-4 h-4" />
                      <span>contacto@radiocolmena.com</span>
                    </p>
                    <p className="flex items-center gap-2 text-blue-200">
                      <Phone className="w-4 h-4" />
                      <span>+57 300 123 4567</span>
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Resto de los tabs se mantienen igual */}
            {activeTab === 'programacion' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold">Programación Diaria</h2>
                </div>
                <div className="space-y-3">
                  {programas.map((prog, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-cyan-400 to-blue-600 p-2 rounded-lg">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{prog.nombre}</h3>
                            <p className="text-sm text-blue-200">{prog.hora}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-cyan-400">{prog.dj}</p>
                          <p className="text-xs text-blue-300">{prog.tipo}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'locutores' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Mic className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold">Nuestros Locutores</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {locutores.map((locutor, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6">
                      <div className="text-6xl mb-3 text-center">{locutor.foto}</div>
                      <h3 className="text-xl font-bold text-center mb-2">{locutor.nombre}</h3>
                      <p className="text-blue-100 text-center mb-1">{locutor.programa}</p>
                      <p className="text-sm text-blue-200 text-center">{locutor.especialidad}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'solicitudes' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Music className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold">Solicita tu Canción</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tu Nombre</label>
                    <input
                      type="text"
                      value={songRequest.name}
                      onChange={(e) => setSongRequest({...songRequest, name: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-500 text-white placeholder-blue-300"
                      placeholder="Escribe tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Canción</label>
                    <input
                      type="text"
                      value={songRequest.song}
                      onChange={(e) => setSongRequest({...songRequest, song: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-500 text-white placeholder-blue-300"
                      placeholder="Nombre de la canción"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Artista</label>
                    <input
                      type="text"
                      value={songRequest.artist}
                      onChange={(e) => setSongRequest({...songRequest, artist: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-500 text-white placeholder-blue-300"
                      placeholder="Nombre del artista"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mensaje (Opcional)</label>
                    <textarea
                      value={songRequest.message}
                      onChange={(e) => setSongRequest({...songRequest, message: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-500 text-white placeholder-blue-300 h-24"
                      placeholder="Dedica esta canción o envía un saludo..."
                    />
                  </div>
                  <button
                    onClick={submitRequest}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                  >
                    Enviar Solicitud
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'concursos' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold">Concursos y Sorteos</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-2">🎁 Concurso del Mes</h3>
                    <p className="text-lg mb-4">Gana entradas para el concierto más esperado del año</p>
                    <div className="bg-black/30 rounded-lg p-4 mb-4">
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

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-bold mb-2">📻 Oyente del Día</h4>
                    <p className="text-sm text-blue-200">Participa en nuestro chat y podrías ganar merchandising exclusivo de Radio Colmena</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-bold mb-2">🎵 Adivina la Canción</h4>
                    <p className="text-sm text-blue-200">Todos los viernes a las 8 PM. Sé el primero en identificar la canción y gana premios</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Sidebar */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 flex flex-col h-[calc(100vh-200px)] lg:sticky lg:top-24">
            <h3 className="text-xl font-bold mb-4">Chat en Vivo</h3>
            
            {!userName ? (
              <div className="space-y-4">
                <p className="text-blue-200">Únete a la conversación:</p>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userName.trim() && setUserName(userName)}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-500 text-white placeholder-blue-300"
                />
                <button
                  onClick={() => userName.trim() && setUserName(userName)}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Entrar al Chat
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
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
                    className="flex-1 px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-500 text-white placeholder-blue-300"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-cyan-400 to-blue-600 p-2 rounded-lg hover:opacity-90 transition-opacity"
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