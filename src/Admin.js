import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Check, Copy, Trash2, LogOut, Music, MessageSquare, ArrowLeft } from 'lucide-react';
import { app, db, firebaseEnabled, subscribeChat } from './firebase';

const auth = firebaseEnabled ? getAuth(app) : null;

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Bogota' }).format(date)
    : '';

const card = 'rounded-2xl border border-white/10 bg-white/[0.04] p-4';
const brandBtn = 'rounded-xl bg-gradient-to-r from-[#FFD23F] to-[#F0386B] px-5 py-3 font-bold text-[#0B0D12] disabled:opacity-60';
const input = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#FFD23F]/50';

export default function Admin() {
  const [user, setUser] = useState(undefined); // undefined = comprobando sesión
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);
  const [requests, setRequests] = useState([]);
  const [chat, setChat] = useState([]);
  const [denied, setDenied] = useState(false);
  const [notice, setNotice] = useState('');
  const [tab, setTab] = useState('solicitudes');
  const [filter, setFilter] = useState('pendientes');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    document.title = 'Panel · Radio Colmena';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => (auth ? onAuthStateChanged(auth, setUser) : undefined), []);

  useEffect(() => {
    if (!user) return undefined;
    setDenied(false);
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'), limit(200));
    const stopRequests = onSnapshot(
      q,
      (snap) => setRequests(snap.docs.map((d) => {
        const data = d.data({ serverTimestamps: 'estimate' });
        return { id: d.id, ...data, date: data.createdAt ? data.createdAt.toDate() : null };
      })),
      () => setDenied(true)
    );
    const stopChat = subscribeChat(setChat, () => {});
    return () => { stopRequests(); stopChat(); };
  }, [user]);

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      setLoginError('Correo o contraseña incorrectos.');
    } finally {
      setBusy(false);
    }
  };

  const run = async (action) => {
    try {
      await action();
      setNotice('');
    } catch (error) {
      setNotice('No se pudo completar la acción. Revisa tus permisos en las reglas de Firestore.');
    }
  };

  const togglePlayed = (r) => run(() => updateDoc(doc(db, 'requests', r.id), { played: !r.played }));
  const removeRequest = (r) => window.confirm(`¿Borrar la solicitud de "${r.song}"?`) && run(() => deleteDoc(doc(db, 'requests', r.id)));
  const removeMessage = (m) => window.confirm(`¿Borrar el mensaje de ${m.user}?`) && run(() => deleteDoc(doc(db, 'chat', m.id)));

  const copyText = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      setNotice('No se pudo copiar.');
    }
  };

  const pending = requests.filter((r) => !r.played).length;
  const shown = requests.filter((r) => (filter === 'todas' ? true : filter === 'pendientes' ? !r.played : r.played));

  const shell = (children) => (
    <div className="hive-bg min-h-screen bg-[#0B0D12] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">{children}</div>
    </div>
  );

  if (!firebaseEnabled) {
    return shell(<div className={card}>Firebase no está configurado. Carga las variables <code>REACT_APP_FIREBASE_…</code> y vuelve a desplegar.</div>);
  }
  if (user === undefined) return shell(<p className="text-white/50">Comprobando sesión…</p>);

  if (user === null) {
    return shell(
      <form onSubmit={login} className={`${card} mx-auto mt-16 max-w-sm space-y-4`}>
        <h1 className="font-display text-2xl font-extrabold">Panel de Radio Colmena</h1>
        <p className="text-sm text-white/50">Acceso solo para el equipo.</p>
        <input className={input} type="email" autoComplete="username" placeholder="Correo" aria-label="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" autoComplete="current-password" placeholder="Contraseña" aria-label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {loginError && <p role="alert" className="text-sm text-amber-300">{loginError}</p>}
        <button type="submit" disabled={busy} className={`${brandBtn} w-full`}>{busy ? 'Entrando…' : 'Entrar'}</button>
      </form>
    );
  }

  return shell(
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Panel de Radio Colmena</h1>
          <p className="text-sm text-white/50">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { window.location.hash = ''; }} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Ver la web
          </button>
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </header>

      {denied && (
        <div role="alert" className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <b>Esta cuenta no tiene permiso para ver las solicitudes.</b>
          <p className="mt-1">Pega este identificador en <code>isAdmin()</code> dentro de las reglas de Firestore y publícalas:</p>
          <code className="mt-2 block break-all rounded-lg bg-black/30 p-2">{user.uid}</code>
        </div>
      )}
      {notice && <p role="alert" className="mb-4 text-sm text-amber-300">{notice}</p>}

      <nav className="mb-5 flex gap-2">
        {[['solicitudes', Music, `Solicitudes${pending ? ` (${pending})` : ''}`], ['chat', MessageSquare, 'Chat']].map(([id, Icon, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${tab === id ? 'bg-gradient-to-r from-[#FFD23F] to-[#F0386B] text-[#0B0D12]' : 'border border-white/10 text-white/70 hover:bg-white/10'}`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </nav>

      {tab === 'solicitudes' && (
        <section className="space-y-3">
          <div className="flex gap-2 text-sm">
            {['pendientes', 'ya sonaron', 'todas'].map((f) => (
              <button key={f} onClick={() => setFilter(f === 'ya sonaron' ? 'sonaron' : f)} className={`rounded-full px-3 py-1 capitalize ${(filter === 'sonaron' ? 'ya sonaron' : filter) === f ? 'bg-white/15 font-bold' : 'text-white/50 hover:text-white'}`}>{f}</button>
            ))}
          </div>
          {shown.length === 0 && <p className="py-10 text-center text-white/40">No hay solicitudes aquí.</p>}
          {shown.map((r) => (
            <article key={r.id} className={`${card} ${r.played ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-lg font-extrabold">{r.song}</div>
                  <div className="truncate text-sm text-[#FFD23F]">{r.artist || 'Artista no indicado'}</div>
                </div>
                <time className="shrink-0 text-xs text-white/40">{formatDate(r.date)}</time>
              </div>
              <p className="mt-2 text-sm text-white/60">De <b className="text-white/80">{r.name}</b>{r.message ? ` · “${r.message}”` : ''}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => togglePlayed(r)} className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/15">
                  <Check className="h-3.5 w-3.5" /> {r.played ? 'Marcar pendiente' : 'Ya sonó'}
                </button>
                <button onClick={() => copyText(r.id, [r.artist, r.song].filter(Boolean).join(' - '))} className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/15">
                  <Copy className="h-3.5 w-3.5" /> {copiedId === r.id ? '¡Copiado!' : 'Copiar para buscar en Mixxx'}
                </button>
                <button onClick={() => removeRequest(r)} aria-label="Borrar solicitud" className="ml-auto rounded-lg p-1.5 text-white/40 hover:bg-red-500/20 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {tab === 'chat' && (
        <section className="space-y-2">
          {chat.length === 0 && <p className="py-10 text-center text-white/40">El chat está vacío.</p>}
          {[...chat].reverse().map((m) => (
            <div key={m.id} className={`${card} flex items-start justify-between gap-3 py-3`}>
              <div className="min-w-0 text-sm">
                <b className="text-[#FFD23F]">{m.user}</b> <span className="text-xs text-white/40">{m.time}</span>
                <p className="break-words text-white/80">{m.text}</p>
              </div>
              <button onClick={() => removeMessage(m)} aria-label="Borrar mensaje" className="shrink-0 rounded-lg p-1.5 text-white/40 hover:bg-red-500/20 hover:text-red-300">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
