'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const MAP_W = 2000;
const MAP_H = 2000;
const TANK_RADIUS = 18;
const TURRET_LEN = 28;
const BULLET_RADIUS = 4;

interface NetPlayer {
  id: string; x: number; y: number; angle: number; turretAngle: number;
  hp: number; maxHp: number; name: string; kills: number; deaths: number;
}
interface NetBullet { x: number; y: number; id: string; }
interface NetPowerUp { x: number; y: number; type: string; }
interface KillFeedItem { text: string; time: number; }

export default function AniTanksMultiplayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const myIdRef = useRef<string>('');
  const playersRef = useRef<Map<string, NetPlayer>>(new Map());
  const bulletsRef = useRef<NetBullet[]>([]);
  const powerupsRef = useRef<NetPowerUp[]>([]);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Connecting...');
  const [serverUrl, setServerUrl] = useState('');
  const [showSetup, setShowSetup] = useState(true);
  const [leaderboard, setLeaderboard] = useState<{ id: string; name: string; kills: number; deaths: number; isMe: boolean }[]>([]);
  const [killFeed, setKillFeed] = useState<KillFeedItem[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef({ x: 0, y: 0, down: false });
  const animRef = useRef<number>(0);
  const inputIntervalRef = useRef<number>(0);
  const [myStats, setMyStats] = useState({ kills: 0, deaths: 0 });

  const addKillFeed = useCallback((text: string) => {
    const now = Date.now();
    setKillFeed(prev => [...prev.slice(-4), { text, time: now }]);
    setTimeout(() => setKillFeed(prev => prev.filter(f => f.time !== now)), 4000);
  }, []);

  const connect = useCallback((url: string) => {
    setShowSetup(false);
    setStatus('Connecting...');
    setConnected(false);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('Connected! Waiting for players...');
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case 'init':
            myIdRef.current = data.id;
            setConnected(true);
            setStatus('In game');
            break;
          case 'state':
            playersRef.current.clear();
            data.players.forEach((p: NetPlayer) => playersRef.current.set(p.id, p));
            bulletsRef.current = data.bullets || [];
            powerupsRef.current = data.powerups || [];
            const my = data.players.find((p: NetPlayer) => p.id === myIdRef.current);
            if (my) setMyStats({ kills: my.kills, deaths: my.deaths });
            const lb = (data.players as NetPlayer[])
              .sort((a, b) => b.kills - a.kills || a.deaths - b.deaths)
              .map(p => ({ id: p.id, name: p.name, kills: p.kills, deaths: p.deaths, isMe: p.id === myIdRef.current }));
            setLeaderboard(lb);
            break;
          case 'playerJoin':
            addKillFeed(`${data.name} joined the game`);
            break;
          case 'playerDeath':
            addKillFeed(`${data.killerName || 'Unknown'} eliminated ${data.id === myIdRef.current ? 'You' : 'someone'}`);
            break;
          case 'kill':
            addKillFeed('You got a kill!');
            break;
          case 'playerLeave':
            playersRef.current.delete(data.id);
            addKillFeed('A player left');
            break;
          case 'powerupCollected':
            break;
          case 'respawn':
            break;
        }
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
      setStatus('Disconnected');
    };

    ws.onerror = () => {
      setStatus('Connection failed');
    };
  }, [addKillFeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.width, H = canvas.height;
      const me = playersRef.current.get(myIdRef.current);
      if (!me) { ctx.clearRect(0, 0, W, H); animRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      const camX = me.x - W / 2;
      const camY = me.y - H / 2;

      ctx.save();
      ctx.translate(-camX, -camY);

      ctx.strokeStyle = '#16213e';
      ctx.lineWidth = 1;
      for (let x = 0; x <= MAP_W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, MAP_H); ctx.stroke(); }
      for (let y = 0; y <= MAP_H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(MAP_W, y); ctx.stroke(); }
      ctx.strokeStyle = '#0f3460';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, MAP_W, MAP_H);

      for (const pu of powerupsRef.current) {
        const c = pu.type === 'health' ? '#10b981' : pu.type === 'speed' ? '#f59e0b' : pu.type === 'damage' ? '#ef4444' : '#8b5cf6';
        const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.fillStyle = c;
        ctx.shadowColor = c;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(pu.x, pu.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pu.type === 'health' ? '+' : pu.type === 'speed' ? '>' : pu.type === 'damage' ? 'X' : 'O', pu.x, pu.y);
        ctx.restore();
      }

      for (const b of bulletsRef.current) {
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(b.x, b.y, BULLET_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const [, tank] of playersRef.current) {
        if (tank.hp <= 0) continue;
        const isMe = tank.id === myIdRef.current;
        const tColor = isMe ? '#10b981' : '#ef4444';
        const dColor = isMe ? '#047857' : '#3a1a1a';

        ctx.save();
        ctx.translate(tank.x, tank.y);

        ctx.fillStyle = '#111';
        ctx.shadowColor = tColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, TANK_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = dColor;
        ctx.beginPath();
        ctx.arc(0, 0, TANK_RADIUS - 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = tColor;
        ctx.save();
        ctx.rotate(tank.angle);
        ctx.fillRect(-8, -4, 16, 8);
        ctx.restore();

        ctx.save();
        ctx.rotate(tank.turretAngle);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, -2.5, TURRET_LEN, 5);
        ctx.fillStyle = tColor;
        ctx.beginPath();
        ctx.arc(TURRET_LEN - 2, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(tank.name, 0, -TANK_RADIUS - 6);

        const hpW = 30, hpH = 4;
        ctx.fillStyle = '#333';
        ctx.fillRect(-hpW / 2, -TANK_RADIUS - 14, hpW, hpH);
        ctx.fillStyle = tank.hp / tank.maxHp > 0.5 ? '#10b981' : tank.hp / tank.maxHp > 0.25 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(-hpW / 2, -TANK_RADIUS - 14, hpW * (tank.hp / tank.maxHp), hpH);

        ctx.restore();
      }

      ctx.restore();

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, 160, 28);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`K: ${myStats.kills}  D: ${myStats.deaths}`, 8, 6);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current.add(e.key.toLowerCase()); if (e.key.toLowerCase() === ' ' || e.key === 'Tab') e.preventDefault(); };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
    const handleMouseMove = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    const handleMouseDown = (e: MouseEvent) => { if (e.button === 0) mouseRef.current.down = true; };
    const handleMouseUp = (e: MouseEvent) => { if (e.button === 0) mouseRef.current.down = false; };
    const handleContextMenu = (e: Event) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    inputIntervalRef.current = window.setInterval(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = mouseRef.current.x - rect.left - rect.width / 2;
      const mouseY = mouseRef.current.y - rect.top - rect.height / 2;
      ws.send(JSON.stringify({
        type: 'input',
        keys: { w: keysRef.current.has('w'), a: keysRef.current.has('a'), s: keysRef.current.has('s'), d: keysRef.current.has('d'), arrowup: keysRef.current.has('arrowup'), arrowdown: keysRef.current.has('arrowdown'), arrowleft: keysRef.current.has('arrowleft'), arrowright: keysRef.current.has('arrowright') },
        mouse: { x: mouseX, y: mouseY },
        shooting: mouseRef.current.down,
      }));
    }, 1000 / 60);

    return () => {
      ro.disconnect();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(inputIntervalRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [myStats.kills, myStats.deaths]);

  if (showSetup) {
    const defaultUrl = 'wss://anitanks-server-production.up.railway.app';
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
        <div className="text-center space-y-4 max-w-md px-4">
          <h2 className="text-3xl font-bold text-emerald-400">AniTanks Online</h2>
          <p className="text-sm text-gray-400">Connect to a multiplayer server to play with others</p>
          <input
            type="text"
            value={serverUrl}
            onChange={e => setServerUrl(e.target.value)}
            placeholder={defaultUrl}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--accent)] transition-all"
          />
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => connect(serverUrl || defaultUrl)}
              className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
            >
              Connect
            </button>
            <button
              onClick={() => window.location.href = '/anitanks'}
              className="px-6 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-gray-300 font-medium hover:border-[var(--accent)] transition-all"
            >
              Play Offline
            </button>
          </div>
          <p className="text-xs text-gray-600">Host your own server from <a href="https://github.com/benjaminlovelace655-art/anitanks-server" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-light)]">GitHub</a> or deploy to Railway/Render</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative flex-1 min-h-0">
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
        {!connected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">{status}</p>
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </div>
        )}
        {connected && (
          <>
            <div className="absolute top-3 left-3 z-20 text-xs font-mono text-emerald-400 bg-black/60 px-2 py-1 rounded-lg pointer-events-none">
              K: {myStats.kills} D: {myStats.deaths}
            </div>
            <div className="absolute bottom-20 left-3 z-20 space-y-1 pointer-events-none">
              {killFeed.map(item => (
                <div key={item.time} className="text-[10px] font-mono bg-black/70 px-2 py-1 rounded text-gray-300" style={{ animation: 'feedFadeIn 0.3s ease-out' }}>
                  {item.text}
                </div>
              ))}
            </div>
            <div className="absolute top-3 right-3 z-20 w-48 max-h-60 overflow-y-auto rounded-lg bg-black/70 border border-[var(--border)] p-2 text-[10px] font-mono pointer-events-none">
              <div className="text-[var(--accent)] font-bold mb-1 text-xs">Leaderboard</div>
              {leaderboard.slice(0, 10).map((e, i) => (
                <div key={e.id} className={`flex justify-between gap-1 ${e.isMe ? 'text-emerald-400' : 'text-gray-300'}`}>
                  <span className="truncate">{i + 1}. {e.name}</span>
                  <span className="shrink-0">{e.kills}K / {e.deaths}D</span>
                </div>
              ))}
            </div>
          </>
        )}
      <style>{`@keyframes feedFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </div>
  );
}
