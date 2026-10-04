// Función serverless de Vercel: consulta Shoutcast (http) y responde por https a la web.
const SOURCE = process.env.STATS_URL || 'http://uk14freenew.listen2myradio.com:22602/7.html';

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

module.exports = async (req, res) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    // Shoutcast v1 solo responde a agentes que empiezan por "Mozilla"
    const r = await fetch(SOURCE, { headers: { 'User-Agent': 'Mozilla/5.0 (RadioColmena)' }, signal: controller.signal });
    if (!r.ok) throw new Error(`estado ${r.status}`);
    const text = (await r.text()).replace(/<[^>]*>/g, '').trim();
    // Formato 7.html: oyentes, estado, pico, máximo, únicos, bitrate, canción
    const parts = text.split(',');
    if (parts.length < 7) throw new Error('formato inesperado');
    const [current, status, peak, , , bitrate, ...song] = parts;

    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');
    res.status(200).json({
      live: status.trim() === '1',
      listeners: Number(current),
      peak: Number(peak),
      bitrate: Number(bitrate),
      song: decode(song.join(',').trim())
    });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'sin datos' });
  } finally {
    clearTimeout(timer);
  }
};
