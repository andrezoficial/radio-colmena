import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Radio, Send, Music, Users, Calendar, Clock, Instagram,
  Facebook, Twitter, Mail, Phone, Gift, Mic, TrendingUp,
  MessageSquare, Play, Pause, AlertTriangle, Volume2, VolumeX,
  ExternalLink, Copy, Check, Wifi, ChevronRight
} from 'lucide-react';

const STREAMS = [
  {
    url: 'https://uk14freenew.listen2myradio.com/live.mp3?typeportmount=s1_22602_stream_569004243',
    name: 'Servidor principal',
    server: 'UK14'
  },
  {
    url: 'https://uk17freenew.listen2myradio.com/live.mp3?typeportmount=s1_3733_stream_619888809',
    name: 'Servidor de respaldo',
    server: 'UK17'
  }
];

const BACKUP_PLAYERS = [
  { url: 'https://radiocolmena.radiostream321.com/', name: 'Reproductor oficial 1' },
  { url: 'https://radiocolmena.radiostream123.com/', name: 'Reproductor oficial 2' }
];

const PROGRAMS = [
  { start: 6, end: 9, hora: '06:00 – 09:00', nombre: 'Mañanas Colmena', dj: 'DJ Mateo', tipo: 'Música variada' },
  { start: 9, end: 12, hora: '09:00 – 12:00', nombre: 'Éxitos del Momento', dj: 'DJ Carolina', tipo: 'Top hits' },
  { start: 12, end: 15, hora: '12:00 – 15:00', nombre: 'Mediodía Musical', dj: 'DJ Santiago', tipo: 'Rock y pop' },
  { start: 15, end: 18, hora: '15:00 – 18:00', nombre: 'Tarde Urbana', dj: 'DJ Laura', tipo: 'Música urbana' },
  { start: 18, end: 21, hora: '18:00 – 21:00', nombre: 'Noche de Oro', dj: 'DJ Andrés', tipo: 'Clásicos' },
  { start: 21, end: 24, hora: '21:00 – 00:00', nombre: 'Zona Electrónica', dj: 'DJ Valentina', tipo: 'Electronic / Dance' },
  { start: 0, end: 6, hora: '00:00 – 06:00', nombre: 'Madrugada Colmena', dj: 'Selección automática', tipo: 'Música sin pausa' }
];

const SPEAKERS = [
  { nombre: 'DJ Mateo', programa: 'Mañanas Colmena', especialidad: 'Música variada' },
  { nombre: 'DJ Carolina', programa: 'Éxitos del Momento', especialidad: 'Top hits internacional' },
  { nombre: 'DJ Santiago', programa: 'Mediodía Musical', especialidad: 'Rock & Pop' },
  { nombre: 'DJ Laura', programa: 'Tarde Urbana', especialidad: 'Música urbana' }
];

const INITIAL_MESSAGES = [
  { user: 'Ana', text: '¡Excelente música! 🎵', time: '10:30' },
  { user: 'Carlos', text: 'Saludos desde Bogotá 🇨🇴', time: '10:32' }
];

const TZ = 'America/Bogota';

function getBogotaHour() {
  const h = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: TZ }).format(new Date());
  return Number(h) % 24;
}

function getCurrentProgram() {
  const hour = getBogotaHour();
  return PROGRAMS.find(p => hour >= p.start && hour < p.end) || PROGRAMS[0];
}

export default function EmisoraOnline() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [listeners, setListeners] = useState(142);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [songRequest, setSongRequest] = useState({ name: '', song: '', artist: '', message: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false); // false | 'retrying' | 'failed'
  const [isBuffering, setIsBuffering] = useState(false);
  const [streamIndex, setStreamIndex] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(getCurrentProgram);
  const [nameDraft, setNameDraft] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const audioRef = useRef(null);
  const retryTimer = useRef(null);
  const failCount = useRef(0);
  const attemptFailed = useRef(false);
  const streamRef = useRef(0);
  const chatRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setListeners(prev => Math.max(100, prev + Math.floor(Math.random() * 3) - 1));
      setCurrentProgram(getCurrentProgram());
    }, 5000);
    return () => {
      clearInterval(interval);
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
      if (audio) audio.pause();
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages.length, userName]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const stream = STREAMS[streamIndex];

  const navItems = [
    ['inicio', 'Inicio', Radio],
    ['programacion', 'Programación', Calendar],
    ['locutores', 'Locutores', Mic],
    ['solicitudes', 'Pide tu canción', Music],
    ['concursos', 'Concursos', Gift]
  ];

  const clearRetry = () => {
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }
  };

  const handleFailure = () => {
    if (attemptFailed.current) return; // evita contar dos veces el mismo fallo
    attemptFailed.current = true;
    const audio = audioRef.current;
    if (audio) audio.pause();
    setIsPlaying(false);
    setIsBuffering(false);
    failCount.current += 1;

    if (failCount.current < STREAMS.length) {
      setAudioError('retrying');
      const next = (streamRef.current + 1) % STREAMS.length;
      retryTimer.current = setTimeout(() => startStream(next), 900);
    } else {
      failCount.current = 0;
      setAudioError('failed');
    }
  };

  const startStream = async (index) => {
    const audio = audioRef.current;
    if (!audio) return;
    clearRetry();
    attemptFailed.current = false;
    streamRef.current = index;
    setStreamIndex(index);
    setIsBuffering(true);

    audio.src = STREAMS[index].url;
    audio.load();
    try {
      await audio.play();
      failCount.current = 0;
      setAudioError(false);
      setIsPlaying(true);
    } catch (error) {
      if (error && error.name === 'AbortError') return; // fue reemplazado por otro intento
      handleFailure();
    }
  };

  const stopStream = () => {
    const audio = audioRef.current;
    clearRetry();
    failCount.current = 0;
    attemptFailed.current = true;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src'); // corta la descarga del stream en vivo
      audio.load();
    }
    setIsPlaying(false);
    setIsBuffering(false);
    setAudioError(false);
  };

  const togglePlay = () => {
    if (isPlaying || isBuffering || audioError === 'retrying') {
      stopStream();
    } else {
      failCount.current = 0;
      setAudioError(false);
      startStream(streamIndex);
    }
  };

  const switchStream = (index) => {
    failCount.current = 0;
    if (isPlaying || isBuffering) {
      startStream(index);
    } else {
      streamRef.current = index;
      setStreamIndex(index);
      setAudioError(false);
    }
  };

  const handleAudioError = () => {
    const audio = audioRef.current;
    if (!audio || !audio.getAttribute('src')) return;
    handleFailure();
  };

  const openPlayer = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const submitRequest = () => {
    if (!songRequest.name.trim() || !songRequest.song.trim()) return;
    setSongRequest({ name: '', song: '', artist: '', message: '' });
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 4000);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !userName.trim()) return;
    const time = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: TZ }).format(new Date());
    setMessages(prev => [...prev, { user: userName.trim(), text: newMessage.trim(), time }]);
    setNewMessage('');
  };

  const confirmName = () => {
    const name = nameDraft.trim();
    if (name) setUserName(name);
  };

  const copyStream = async () => {
    try {
      await navigator.clipboard.writeText(stream.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const heroStats = useMemo(() => [
    { label: 'Oyentes ahora', value: listeners, icon: Users },
    { label: 'Al aire', value: '24/7', icon: Clock },
    { label: 'Cobertura', value: '25+', icon: TrendingUp },
    { label: 'Comunidad', value: '1.2K+', icon: MessageSquare }
  ], [listeners]);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-white selection:bg-[#FFD23F]/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#FFD23F]/10 blur-3xl" />
        <div className="absolute -right-40 top-96 h-96 w-96 rounded-full bg-[#F0386B]/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0D12]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setActiveTab('inicio')} className="flex min-w-0 items-center gap-3 text-left">
              <Logo className="h-11 w-11 shrink-0 drop-shadow-[0_6px_14px_rgba(240,56,107,0.35)]" />
              <div className="min-w-0">
                <div className="truncate text-lg font-black tracking-tight sm:text-xl">Radio Colmena</div>
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Transmitiendo desde Colombia
                </div>
              </div>
            </button>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 sm:flex">
              <Users className="h-4 w-4 text-[#FFD23F]" />
              <span className="font-bold">{listeners}</span>
              <span className="text-xs text-white/50">escuchando</span>
            </div>
          </div>

          <nav className="-mx-1 mt-3 flex gap-1 overflow-x-auto pb-1">
            {navItems.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  activeTab === id
                    ? 'bg-white text-[#0B0D12] shadow-lg'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <section className="min-w-0">
            {activeTab === 'inicio' && (
              <div className="space-y-6">
                <div className="hive-bg overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#161a24] to-[#0c0f15] shadow-2xl">
                  <div className="relative p-5 sm:p-8">
                    <div className="absolute right-5 top-5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                      ● EN VIVO
                    </div>

                    <div className="max-w-2xl pt-7 sm:pt-3">
                      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#FFD23F]">Radio Colmena Online</p>
                      <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">La música que <span className="bg-gradient-to-r from-[#FFD23F] to-[#F0386B] bg-clip-text text-transparent">te conecta.</span></h1>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
                        Escucha nuestra señal en vivo, participa en la comunidad y pide tu canción favorita.
                      </p>
                    </div>

                    <div className="mt-7 grid gap-4 md:grid-cols-[1fr_280px]">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-14 w-14 shrink-0 place-items-center bg-gradient-to-br from-[#FFD23F] to-[#F0386B]" style={{ clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }}>
                            {isBuffering ? (
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0B0D12] border-t-transparent" />
                            ) : (
                              <Equalizer on={isPlaying} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold uppercase tracking-wider text-white/40">Ahora en Radio Colmena</div>
                            <div className="truncate text-xl font-extrabold">{currentProgram.nombre}</div>
                            <div className="text-sm text-white/50">{currentProgram.dj} · {currentProgram.tipo}</div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <button
                            onClick={togglePlay}
                           
                            aria-label={isPlaying || isBuffering ? 'Detener radio' : 'Reproducir radio'}
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-[#0B0D12] shadow-xl transition hover:scale-105"
                          >
                            {isPlaying || isBuffering ? <Pause className="h-7 w-7 fill-current" /> : <Play className="ml-1 h-7 w-7 fill-current" />}
                          </button>

                          <div className="min-w-[180px] flex-1">
                            <div className="flex items-center justify-between text-xs text-white/45">
                              <span>{isBuffering ? 'Conectando…' : audioError ? 'Sin señal' : isPlaying ? 'Reproduciendo en vivo' : 'Listo para escuchar'}</span>
                              <span>{stream.server}</span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                              <div className={`h-full rounded-full bg-gradient-to-r from-[#FFD23F] to-[#F0386B] transition-all ${isPlaying ? 'w-full animate-pulse' : 'w-1/3'}`} />
                            </div>
                          </div>

                          <button
                            onClick={() => setMuted(v => !v)}
                            className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/70 hover:bg-white/10 hover:text-white"
                            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
                          >
                            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                          </button>
                          <input
                            aria-label="Volumen"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={muted ? 0 : volume}
                            onChange={e => { setMuted(false); setVolume(Number(e.target.value)); }}
                            className="hidden w-24 accent-[#FFD23F] sm:block"
                          />
                        </div>

                        {audioError && (
                          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <div>
                              <b>{audioError === 'failed' ? 'No pudimos conectar con la señal.' : 'No pudimos conectar con este servidor.'}</b>
                              <div className="mt-0.5 text-xs text-amber-100/70">
                                {audioError === 'failed'
                                  ? 'Revisa tu conexión o prueba con el reproductor web.'
                                  : 'Probando automáticamente con el servidor de respaldo…'}
                              </div>
                            </div>
                          </div>
                        )}

                        <audio
                          ref={audioRef}
                          preload="none"
                          onPlaying={() => { setIsPlaying(true); setIsBuffering(false); setAudioError(false); }}
                          onPause={() => setIsPlaying(false)}
                          onWaiting={() => setIsBuffering(true)}
                          onCanPlay={() => setIsBuffering(false)}
                          onError={handleAudioError}
                          onEnded={handleAudioError}
                        />
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <Wifi className="h-4 w-4 text-emerald-400" />
                          Señal y respaldo
                        </div>
                        <p className="mt-2 text-sm leading-5 text-white/45">
                          Dos servidores disponibles para mantener la transmisión activa.
                        </p>

                        <div className="mt-4 space-y-2">
                          {STREAMS.map((item, index) => (
                            <button
                              key={item.server}
                              onClick={() => switchStream(index)}
                              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                                streamIndex === index ? 'border-[#FFD23F]/30 bg-[#FFD23F]/10' : 'border-white/10 bg-black/10 hover:bg-white/5'
                              }`}
                            >
                              <span className="text-xs font-semibold">{item.name}</span>
                              <span className={`text-[10px] font-bold ${streamIndex === index ? 'text-[#FFD23F]' : 'text-white/40'}`}>{item.server}</span>
                            </button>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button onClick={() => openPlayer(BACKUP_PLAYERS[0].url)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold hover:bg-white/15">
                            Reproductor web <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={copyStream} className="rounded-xl border border-white/10 px-3 py-2.5 text-white/60 hover:bg-white/10" title="Copiar stream">
                            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {heroStats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <Icon className="h-5 w-5 text-[#FFD23F]" />
                      <div className="mt-3 text-xl font-black">{value}</div>
                      <div className="text-xs text-white/40">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#FFD23F]">En programación</div>
                        <h2 className="mt-1 text-xl font-black">{currentProgram.nombre}</h2>
                      </div>
                      <Clock className="h-6 w-6 text-white/30" />
                    </div>
                    <p className="mt-3 text-sm text-white/50">{currentProgram.hora} · {currentProgram.dj}</p>
                    <button onClick={() => setActiveTab('programacion')} className="mt-4 flex items-center gap-1 text-sm font-bold text-[#FFD23F] hover:gap-2">
                      Ver programación <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#25141d] to-[#12141a] p-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#F0386B]">Participa</div>
                    <h2 className="mt-1 text-xl font-black">Pide tu canción</h2>
                    <p className="mt-2 text-sm text-white/50">Envía un saludo y dinos qué quieres escuchar.</p>
                    <button onClick={() => setActiveTab('solicitudes')} className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-black text-[#0B0D12] hover:bg-white/90">
                      Hacer solicitud
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <h2 className="text-lg font-black">Síguenos</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      ['Instagram', Instagram, 'bg-white/10 hover:bg-white/15'],
                      ['Facebook', Facebook, 'bg-white/10 hover:bg-white/15'],
                      ['X / Twitter', Twitter, 'bg-white/10 hover:bg-white/15']
                    ].map(([name, Icon, color]) => (
                      <a key={name} href="#" onClick={e => e.preventDefault()} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${color} hover:opacity-90`}>
                        <Icon className="h-4 w-4" /> {name}
                      </a>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-sm text-white/45">
                    <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> contacto@radiocolmena.com</span>
                    <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> +57 300 123 4567</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'programacion' && (
              <Panel title="Programación diaria" icon={Calendar} subtitle="Consulta los espacios y sus horarios.">
                <div className="grid gap-3">
                  {PROGRAMS.map((prog) => (
                    <div key={prog.nombre} className={`rounded-2xl border p-4 transition ${currentProgram.nombre === prog.nombre ? 'border-[#FFD23F]/30 bg-[#FFD23F]/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-white/10 p-3"><Clock className="h-5 w-5 text-[#FFD23F]" /></div>
                          <div><h3 className="font-black">{prog.nombre}</h3><p className="text-sm text-white/45">{prog.hora} · {prog.tipo}</p></div>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70">{prog.dj}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {activeTab === 'locutores' && (
              <Panel title="Nuestros locutores" icon={Mic} subtitle="Las voces detrás de Radio Colmena.">
                <div className="grid gap-4 sm:grid-cols-2">
                  {SPEAKERS.map(person => (
                    <div key={person.nombre} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5">
                      <div className="grid h-16 w-16 place-items-center bg-gradient-to-br from-[#FFD23F] to-[#F0386B] font-display text-xl font-extrabold text-[#0B0D12]" style={{ clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }}>{initials(person.nombre)}</div>
                      <h3 className="mt-4 text-xl font-black">{person.nombre}</h3>
                      <p className="mt-1 text-sm font-semibold text-[#FFD23F]">{person.programa}</p>
                      <p className="mt-2 text-sm text-white/45">{person.especialidad}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {activeTab === 'solicitudes' && (
              <Panel title="Pide tu canción" icon={Music} subtitle="Mándanos tu canción, artista y saludo.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tu nombre"><input value={songRequest.name} onChange={e => setSongRequest({...songRequest, name: e.target.value})} placeholder="¿Cómo te llamas?" /></Field>
                  <Field label="Canción"><input value={songRequest.song} onChange={e => setSongRequest({...songRequest, song: e.target.value})} placeholder="Nombre de la canción" /></Field>
                  <Field label="Artista"><input value={songRequest.artist} onChange={e => setSongRequest({...songRequest, artist: e.target.value})} placeholder="Nombre del artista" /></Field>
                  <Field label="Mensaje"><input value={songRequest.message} onChange={e => setSongRequest({...songRequest, message: e.target.value})} placeholder="Un saludo (opcional)" /></Field>
                </div>
                <button onClick={submitRequest} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD23F] to-[#F0386B] px-5 py-3.5 font-black text-[#0B0D12] hover:brightness-105">
                  <Send className="h-4 w-4" /> Enviar solicitud
                </button>
                <p role="status" className={`mt-3 text-center text-sm font-semibold text-emerald-300 transition-opacity ${requestSent ? 'opacity-100' : 'opacity-0'}`}>
                  ¡Solicitud recibida! La escucharemos pronto en Radio Colmena.
                </p>
              </Panel>
            )}

            {activeTab === 'concursos' && (
              <Panel title="Concursos y sorteos" icon={Gift} subtitle="Participa y vive Radio Colmena.">
                <div className="rounded-2xl border border-[#FFD23F]/20 bg-gradient-to-br from-[#FFD23F]/15 to-[#F0386B]/10 p-6">
                  <span className="text-xs font-black uppercase tracking-wider text-[#FFD23F]">Concurso destacado</span>
                  <h3 className="mt-2 text-2xl font-black">Concurso del mes</h3>
                  <p className="mt-2 text-white/60">Escucha la emisora, encuentra la palabra clave y participa por nuestros premios.</p>
                  <div className="mt-5 rounded-xl bg-black/20 p-4 text-sm text-white/65">
                    <b className="text-white">Cómo participar</b>
                    <ol className="mt-2 list-decimal space-y-1 pl-5">
                      <li>Síguenos en nuestras redes.</li>
                      <li>Escucha la transmisión en vivo.</li>
                      <li>Participa en el chat cuando se anuncie la dinámica.</li>
                    </ol>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><b className="flex items-center gap-2"><Radio className="h-4 w-4 text-[#FFD23F]" /> Oyente del día</b><p className="mt-2 text-sm text-white/45">Participa en el chat y podrás recibir sorpresas.</p></div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><b className="flex items-center gap-2"><Music className="h-4 w-4 text-[#F0386B]" /> Adivina la canción</b><p className="mt-2 text-sm text-white/45">Participa durante nuestros espacios especiales.</p></div>
                </div>
              </Panel>
            )}
          </section>

          <aside className="lg:sticky lg:top-[118px] lg:self-start">
            <div className="flex h-[560px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#10131a]/95 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <div>
                  <div className="flex items-center gap-2 text-lg font-black"><MessageSquare className="h-5 w-5 text-[#FFD23F]" /> Chat en vivo</div>
                  <div className="mt-1 text-xs text-white/55">Comparte tus saludos con la comunidad</div>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">ONLINE</span>
              </div>

              {!userName ? (
                <div className="flex flex-1 flex-col justify-center p-6">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10"><Users className="h-7 w-7 text-[#FFD23F]" /></div>
                  <h3 className="mt-5 text-center text-xl font-black">Únete al chat</h3>
                  <p className="mt-2 text-center text-sm text-white/40">Escribe tu nombre para saludar y conversar mientras escuchas.</p>
                  <input value={nameDraft} maxLength={24} aria-label="Tu nombre" onChange={e => setNameDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && confirmName()} placeholder="Tu nombre" className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-white/25 focus:border-[#FFD23F]/50" />
                  <button onClick={confirmName} className="mt-3 w-full rounded-xl bg-white py-3 font-black text-[#0B0D12] hover:bg-white/90">Entrar al chat</button>
                </div>
              ) : (
                <>
                  <div ref={chatRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                    {messages.map((msg, idx) => (
                      <div key={`${msg.time}-${idx}`} className="rounded-2xl border border-white/5 bg-white/[0.04] p-3">
                        <div className="flex justify-between gap-2"><span className="text-sm font-bold text-[#FFD23F]">{msg.user}</span><span className="text-[10px] text-white/30">{msg.time}</span></div>
                        <p className="mt-1 text-sm leading-5 text-white/75">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 p-4">
                    <div className="flex gap-2">
                      <input value={newMessage} maxLength={280} aria-label="Mensaje" onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Escribe un mensaje…" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-white/25 focus:border-[#FFD23F]/50" />
                      <button onClick={sendMessage} aria-label="Enviar mensaje" className="rounded-xl bg-gradient-to-r from-[#FFD23F] to-[#F0386B] px-3 text-[#0B0D12]"><Send className="h-4 w-4" /></button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#05070a] py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-sm text-white/50 sm:px-6 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-2"><Logo className="h-6 w-6" /> © 2026 Radio Colmena · Todos los derechos reservados</span>
          <span>Transmitiendo desde Colombia para el mundo</span>
        </div>
      </footer>
    </div>
  );
}

function Logo({ className = 'h-11 w-11' }) {
  return (
    <svg viewBox="0 0 512 512" className={className} role="img" aria-label="Radio Colmena">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD23F" />
          <stop offset="1" stopColor="#F0386B" />
        </linearGradient>
      </defs>
      <path d="M256 36 L448 146 V366 L256 476 L64 366 V146 Z" fill="url(#cg)" />
      <g fill="#0B0D12">
        {[[148, 226, 60], [192, 188, 136], [236, 150, 212], [280, 188, 136], [324, 226, 60]].map(([x, y, h]) => (
          <rect key={x} x={x} y={y} width="26" height={h} rx="13" />
        ))}
      </g>
    </svg>
  );
}

function Equalizer({ on }) {
  return <span className={`eq ${on ? 'on' : ''}`} aria-hidden="true"><span /><span /><span /><span /><span /></span>;
}

function initials(name) {
  return name.replace('DJ ', '').trim().slice(0, 2).toUpperCase();
}

function Panel({ title, icon: Icon, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-[#FFD23F]/10 p-3"><Icon className="h-5 w-5 text-[#FFD23F]" /></div>
        <div><h2 className="text-2xl font-black">{title}</h2><p className="mt-1 text-sm text-white/40">{subtitle}</p></div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold text-white/70">{label}</span>{React.cloneElement(children, { className: 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[#FFD23F]/50 transition ' + (children.props.className || '') })}</label>;
}
