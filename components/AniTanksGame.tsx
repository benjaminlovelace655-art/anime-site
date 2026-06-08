'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const MAP_W = 2000;
const MAP_H = 2000;
const TANK_RADIUS = 18;
const TURRET_LEN = 28;
const BULLET_RADIUS = 4;
const MAX_BOTS = 8;
const RESPAWN_TIME = 3000;

interface Tank {
  id: string; x: number; y: number; angle: number; turretAngle: number;
  hp: number; maxHp: number; speed: number; kills: number; deaths: number;
  isBot: boolean; name: string; cooldown: number; bulletSpeed: number; damage: number;
  color: string; powerupTimer: number; baseSpeed: number; baseDamage: number; baseBulletSpeed: number;
}

interface Bullet { x: number; y: number; vx: number; vy: number; owner: string; damage: number; life: number; }
interface PowerUp { x: number; y: number; type: 'health' | 'speed' | 'damage' | 'shield'; respawnAt: number; }

interface Wall { x: number; y: number; w: number; h: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number; }
interface DamageText { x: number; y: number; text: string; color: string; life: number; vy: number; }
interface KillFeedItem { text: string; time: number; }

interface LeaderboardEntry { id: string; name: string; kills: number; deaths: number; isPlayer: boolean; color: string; }

const BOT_COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#14b8a6', '#a855f7'];
const BOT_NAMES = ['Titan', 'Viper', 'Storm', 'Shadow', 'Blitz', 'Fury', 'Omega', 'Nova', 'Raven', 'Cobra', 'Apex', 'Ghost', 'Sniper', 'Blaze', 'Crusher', 'Havoc', 'Frost', 'Ember', 'Wraith', 'Jinx'];

function randomBotName() {
  return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)] + Math.floor(Math.random() * 100);
}
function dist(a: { x: number; y: number }, b: { x: number; y: number }) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }
function rectOverlap(a: Wall, b: Wall) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function rand(min: number, max: number) { return min + Math.random() * (max - min); }

function createWalls(): Wall[] {
  const walls: Wall[] = [];
  const candidates: Wall[] = [];
  for (let i = 0; i < 30; i++) {
    candidates.push({ x: rand(100, MAP_W - 200), y: rand(100, MAP_H - 200), w: rand(40, 120), h: rand(40, 120) });
  }
  candidates.sort(() => Math.random() - 0.5);
  for (const w of candidates) {
    let overlap = false;
    for (const existing of walls) { if (rectOverlap(w, { ...existing, w: existing.w + 40, h: existing.h + 40 })) { overlap = true; break; } }
    if (!overlap && walls.length < 12) walls.push(w);
  }
  return walls;
}

class AudioManager {
  ctx: AudioContext | null = null;
  init() { if (!this.ctx) this.ctx = new AudioContext(); if (this.ctx.state === 'suspended') this.ctx.resume(); }
  play(type: 'shoot' | 'hit' | 'explosion' | 'powerup' | 'bounce') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain); gain.connect(this.ctx.destination);
    const now = this.ctx.currentTime;
    switch (type) {
      case 'shoot':
        osc.type = 'square'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
        gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.1); break;
      case 'hit':
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now); osc.stop(now + 0.15); break;
      case 'explosion':
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(120, now); osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now); osc.stop(now + 0.4);
        { const o2 = this.ctx.createOscillator(); const g2 = this.ctx.createGain();
          o2.type = 'square'; o2.frequency.setValueAtTime(60, now); o2.frequency.exponentialRampToValueAtTime(15, now + 0.3);
          g2.gain.setValueAtTime(0.1, now); g2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          o2.connect(g2); g2.connect(this.ctx.destination); o2.start(now); o2.stop(now + 0.35); }
        break;
      case 'powerup':
        osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.linearRampToValueAtTime(800, now + 0.15);
        gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now); osc.stop(now + 0.25); break;
      case 'bounce':
        osc.type = 'sine'; osc.frequency.setValueAtTime(300, now); osc.frequency.linearRampToValueAtTime(600, now + 0.05);
        gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now); osc.stop(now + 0.08); break;
    }
  }
}

export default function AniTanksGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ kills: 0, deaths: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [started, setStarted] = useState(false);
  const [killFeed, setKillFeed] = useState<KillFeedItem[]>([]);
  const gameRef = useRef<{ stop: () => void } | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef({ x: 0, y: 0, down: false });
  const animRef = useRef<number>(0);
  const joystickRef = useRef({ active: false, dx: 0, dy: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const audioRef = useRef(new AudioManager());
  const wallsRef = useRef<Wall[]>([]);

  const addKillFeed = useCallback((text: string) => {
    const now = Date.now();
    setKillFeed(prev => [...prev.slice(-4), { text, time: now }]);
    setTimeout(() => setKillFeed(prev => prev.filter(f => f.time !== now)), 4000);
  }, []);

  const startGame = useCallback(() => {
    setGameOver(false);
    setScore({ kills: 0, deaths: 0 });
    setStarted(true);
    setKillFeed([]);
    audioRef.current.init();
    wallsRef.current = createWalls();

    const player: Tank = {
      id: 'player', x: MAP_W / 2, y: MAP_H / 2, angle: 0, turretAngle: 0,
      hp: 100, maxHp: 100, speed: 2.5, kills: 0, deaths: 0, isBot: false,
      name: 'You', cooldown: 0, bulletSpeed: 7, damage: 20, color: '#10b981',
      powerupTimer: 0, baseSpeed: 2.5, baseDamage: 20, baseBulletSpeed: 7,
    };

    const bots: Tank[] = [];
    const bullets: Bullet[] = [];
    const powerups: PowerUp[] = [];
    const particles: Particle[] = [];
    const damageTexts: DamageText[] = [];
    let isDead = false;
    let deathTimer = 0;
    let screenShake = 0;

    function spawnParticles(x: number, y: number, color: string, count: number, speed: number) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = rand(0.5, speed);
        particles.push({
          x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
          life: rand(15, 40), maxLife: 40, color, size: rand(2, 5),
        });
      }
    }

    function addDamageText(x: number, y: number, text: string, color: string) {
      damageTexts.push({ x, y, text, color, life: 40, vy: -1.5 });
    }

    function collidesWithWall(x: number, y: number, r: number): boolean {
      for (const w of wallsRef.current) {
        const cx = Math.max(w.x, Math.min(x, w.x + w.w));
        const cy = Math.max(w.y, Math.min(y, w.y + w.h));
        if (Math.hypot(x - cx, y - cy) < r) return true;
      }
      return false;
    }

    function clampWithWalls(x: number, y: number, r: number): { x: number; y: number } {
      return {
        x: clamp(x, r, MAP_W - r),
        y: clamp(y, r, MAP_H - r),
      };
    }

    function spawnBot() {
      if (bots.length >= MAX_BOTS) return;
      const baseSpeed = rand(1.5, 2.3);
      const baseDamage = rand(12, 20);
      const baseBulletSpeed = rand(5, 7);
      let x: number, y: number;
      let attempts = 0;
      do {
        x = rand(100, MAP_W - 100);
        y = rand(100, MAP_H - 100);
        attempts++;
      } while ((dist({ x, y }, player) < 300 || collidesWithWall(x, y, TANK_RADIUS + 20)) && attempts < 50);
      bots.push({
        id: 'bot-' + Math.random().toString(36).slice(2, 6),
        x, y, angle: Math.random() * Math.PI * 2, turretAngle: Math.random() * Math.PI * 2,
        hp: 80, maxHp: 80, speed: baseSpeed, kills: 0, deaths: 0, isBot: true,
        name: randomBotName(), cooldown: 0, bulletSpeed: baseBulletSpeed, damage: baseDamage,
        color: BOT_COLORS[Math.floor(Math.random() * BOT_COLORS.length)],
        powerupTimer: 0, baseSpeed, baseDamage, baseBulletSpeed,
      });
      spawnParticles(x, y, '#10b981', 8, 3);
    }

    for (let i = 0; i < 6; i++) spawnBot();

    function spawnPowerUp() {
      if (powerups.length >= 6) return;
      const types: PowerUp['type'][] = ['health', 'speed', 'damage', 'shield'];
      let x: number, y: number, attempts = 0;
      do { x = rand(100, MAP_W - 100); y = rand(100, MAP_H - 100); attempts++; }
      while (collidesWithWall(x, y, 20) && attempts < 30);
      powerups.push({ x, y, type: types[Math.floor(Math.random() * types.length)], respawnAt: 0 });
    }
    for (let i = 0; i < 4; i++) spawnPowerUp();

    function getTank(id: string) { return id === 'player' ? player : bots.find(b => b.id === id); }

    function updateLeaderboard() {
      const entries: LeaderboardEntry[] = [
        { id: player.id, name: player.name, kills: player.kills, deaths: player.deaths, isPlayer: true, color: player.color },
        ...bots.map(b => ({ id: b.id, name: b.name, kills: b.kills, deaths: b.deaths, isPlayer: false, color: b.color })),
      ];
      entries.sort((a, b) => b.kills - a.kills || a.deaths - b.deaths);
      setLeaderboard(entries);
    }

    function gameLoop() {
      const now = Date.now();
      if (screenShake > 0) screenShake *= 0.85;
      if (screenShake < 0.5) screenShake = 0;

      if (!isDead) {
        const k = keysRef.current;
        const js = joystickRef.current;
        let dx = 0, dy = 0;
        if (k.has('w') || k.has('arrowup') || js.dy < -0.2) dy = -1;
        if (k.has('s') || k.has('arrowdown') || js.dy > 0.2) dy = 1;
        if (k.has('a') || k.has('arrowleft') || js.dx < -0.2) dx = -1;
        if (k.has('d') || k.has('arrowright') || js.dx > 0.2) dx = 1;
        if (dx || dy) {
          player.angle = Math.atan2(dy, dx);
          const nx = player.x + Math.cos(player.angle) * player.speed;
          const ny = player.y + Math.sin(player.angle) * player.speed;
          if (!collidesWithWall(nx, ny, TANK_RADIUS)) { player.x = nx; player.y = ny; }
          const clamped = clampWithWalls(player.x, player.y, TANK_RADIUS);
          player.x = clamped.x; player.y = clamped.y;
          spawnParticles(player.x - Math.cos(player.angle) * TANK_RADIUS, player.y - Math.sin(player.angle) * TANK_RADIUS, player.color, 1, 0.5);
        }

        const m = mouseRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const worldX = (m.x - rect.left) * (canvas.width / rect.width) + player.x - canvas.width / 2;
          const worldY = (m.y - rect.top) * (canvas.height / rect.height) + player.y - canvas.height / 2;
          player.turretAngle = Math.atan2(worldY - player.y, worldX - player.x);
        }

        if (player.cooldown > 0) player.cooldown--;
        const shooting = m.down || js.active;
        if (shooting && player.cooldown <= 0) {
          const bx = player.x + Math.cos(player.turretAngle) * TURRET_LEN;
          const by = player.y + Math.sin(player.turretAngle) * TURRET_LEN;
          if (!collidesWithWall(bx, by, BULLET_RADIUS)) {
            bullets.push({ x: bx, y: by, vx: Math.cos(player.turretAngle) * player.bulletSpeed, vy: Math.sin(player.turretAngle) * player.bulletSpeed, owner: 'player', damage: player.damage, life: 120 });
            player.cooldown = 12;
            audioRef.current.play('shoot');
            spawnParticles(bx, by, '#fbbf24', 3, 2);
          }
        }

        if (player.powerupTimer > 0) player.powerupTimer--;
        if (player.powerupTimer === 0 && player.speed > player.baseSpeed) {
          player.speed = player.baseSpeed; player.damage = player.baseDamage; player.bulletSpeed = player.baseBulletSpeed;
        }
      }

      for (const bot of bots) {
        if (bot.hp <= 0) continue;
        if (bot.powerupTimer > 0) bot.powerupTimer--;
        if (bot.powerupTimer === 0 && bot.speed > bot.baseSpeed) {
          bot.speed = bot.baseSpeed; bot.damage = bot.baseDamage; bot.bulletSpeed = bot.baseBulletSpeed;
        }

        const d = dist(bot, player);
        let hasThreat = false;
        for (const b of bullets) {
          if (b.owner === bot.id) continue;
          const futureDist = dist({ x: bot.x + b.vx * 10, y: bot.y + b.vy * 10 }, { x: b.x + b.vx * 10, y: b.y + b.vy * 10 });
          if (futureDist < 100) { hasThreat = true; break; }
        }

        if (d < 500 && player.hp > 0 && !isDead) {
          const targetAngle = Math.atan2(player.y - bot.y, player.x - bot.x);
          bot.turretAngle = targetAngle;
          if (hasThreat && d < 200) {
            const evadeAngle = targetAngle + Math.PI / 2 * (Math.random() > 0.5 ? 1 : -1);
            bot.angle = evadeAngle;
            bot.x += Math.cos(evadeAngle) * bot.speed * 1.2;
            bot.y += Math.sin(evadeAngle) * bot.speed * 1.2;
          } else if (d > 180) {
            bot.angle = targetAngle;
            const nx = bot.x + Math.cos(targetAngle) * bot.speed;
            const ny = bot.y + Math.sin(targetAngle) * bot.speed;
            if (!collidesWithWall(nx, ny, TANK_RADIUS)) { bot.x = nx; bot.y = ny; }
            const clamped = clampWithWalls(bot.x, bot.y, TANK_RADIUS);
            bot.x = clamped.x; bot.y = clamped.y;
          } else {
            bot.angle = targetAngle;
          }
          if (bot.cooldown <= 0 && d < 600) {
            const bx = bot.x + Math.cos(bot.turretAngle) * TURRET_LEN;
            const by = bot.y + Math.sin(bot.turretAngle) * TURRET_LEN;
            if (!collidesWithWall(bx, by, BULLET_RADIUS)) {
              bullets.push({ x: bx, y: by, vx: Math.cos(bot.turretAngle) * bot.bulletSpeed, vy: Math.sin(bot.turretAngle) * bot.bulletSpeed, owner: bot.id, damage: bot.damage, life: 120 });
              bot.cooldown = 20 + Math.random() * 15;
            }
          }
        } else {
          bot.angle += (Math.random() - 0.5) * 0.1;
          const nx = bot.x + Math.cos(bot.angle) * bot.speed * 0.5;
          const ny = bot.y + Math.sin(bot.angle) * bot.speed * 0.5;
          if (!collidesWithWall(nx, ny, TANK_RADIUS)) { bot.x = nx; bot.y = ny; }
          const clamped = clampWithWalls(bot.x, bot.y, TANK_RADIUS);
          bot.x = clamped.x; bot.y = clamped.y;
        }
        bot.x = clamp(bot.x, TANK_RADIUS, MAP_W - TANK_RADIUS);
        bot.y = clamp(bot.y, TANK_RADIUS, MAP_H - TANK_RADIUS);
        if (bot.cooldown > 0) bot.cooldown--;
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx; b.y += b.vy; b.life--;
        if (b.x < 0 || b.x > MAP_W || b.y < 0 || b.y > MAP_H || b.life <= 0) { bullets.splice(i, 1); continue; }
        let hitWall = false;
        for (const w of wallsRef.current) {
          if (b.x >= w.x && b.x <= w.x + w.w && b.y >= w.y && b.y <= w.y + w.h) { hitWall = true; spawnParticles(b.x, b.y, '#666', 5, 2); audioRef.current.play('bounce'); break; }
        }
        if (hitWall) { bullets.splice(i, 1); continue; }

        let hit = false;
        if (b.owner !== 'player' && player.hp > 0 && !isDead) {
          if (dist(b, player) < TANK_RADIUS + BULLET_RADIUS) {
            player.hp -= b.damage; hit = true; audioRef.current.play('hit');
            spawnParticles(b.x, b.y, player.color, 6, 3);
            addDamageText(player.x, player.y - 20, `-${b.damage}`, '#ef4444');
            screenShake = 4;
            if (player.hp <= 0) {
              player.hp = 0; isDead = true; deathTimer = now + RESPAWN_TIME; player.deaths++;
              const owner = getTank(b.owner); if (owner) owner.kills++;
              setScore(s => ({ ...s, deaths: player.deaths })); setGameOver(true); updateLeaderboard();
              spawnParticles(player.x, player.y, player.color, 30, 6); audioRef.current.play('explosion'); screenShake = 10;
              addKillFeed(`${owner ? owner.name : 'Unknown'} eliminated You`);
            }
          }
        }
        if (!hit && b.owner !== 'player') {
          for (const bot of bots) {
            if (bot.hp <= 0 || bot.id === b.owner) continue;
            if (dist(b, bot) < TANK_RADIUS + BULLET_RADIUS) {
              bot.hp -= b.damage; hit = true; audioRef.current.play('hit');
              spawnParticles(b.x, b.y, bot.color, 6, 3);
              addDamageText(bot.x, bot.y - 20, `-${b.damage}`, '#ff6b6b');
              screenShake = 2;
              if (bot.hp <= 0) {
                bot.deaths++; player.kills++; setScore(s => ({ ...s, kills: player.kills })); updateLeaderboard();
                spawnParticles(bot.x, bot.y, bot.color, 30, 6); audioRef.current.play('explosion'); screenShake = 8;
                addKillFeed(`You eliminated ${bot.name}`);
                setTimeout(spawnBot, 3000);
              }
              break;
            }
          }
        }
        if (hit) { bullets.splice(i, 1); }
      }

      for (const bot of bots) {
        if (bot.hp <= 0) continue;
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          if (b.owner === bot.id) continue;
          if (dist(b, bot) < TANK_RADIUS + BULLET_RADIUS) {
            bot.hp -= b.damage; audioRef.current.play('hit');
            spawnParticles(b.x, b.y, bot.color, 6, 3);
            addDamageText(bot.x, bot.y - 20, `-${b.damage}`, '#ff6b6b');
            screenShake = 2;
            if (bot.hp <= 0) {
              bot.deaths++; const owner = getTank(b.owner); if (owner) owner.kills++;
              if (b.owner === 'player') { player.kills++; setScore(s => ({ ...s, kills: player.kills })); }
              updateLeaderboard();
              spawnParticles(bot.x, bot.y, bot.color, 30, 6); audioRef.current.play('explosion'); screenShake = 8;
              addKillFeed(`${owner ? owner.name : 'Unknown'} eliminated ${bot.name}`);
              setTimeout(spawnBot, 3000);
            }
            bullets.splice(i, 1); break;
          }
        }
      }

      for (const pu of powerups) {
        if (pu.respawnAt > now) continue;
        if (!isDead && dist(pu, player) < TANK_RADIUS + 16) {
          const types = pu.type;
          if (types === 'health') { player.hp = Math.min(player.maxHp, player.hp + 40); }
          else if (types === 'speed') { player.speed = player.baseSpeed * 1.6; player.powerupTimer = 300; }
          else if (types === 'damage') { player.damage = player.baseDamage * 2; player.bulletSpeed = player.baseBulletSpeed * 1.4; player.powerupTimer = 300; }
          else if (types === 'shield') { player.hp = Math.min(player.maxHp, player.hp + 60); player.powerupTimer = 60; }
          pu.respawnAt = now + 8000;
          audioRef.current.play('powerup');
          spawnParticles(pu.x, pu.y, '#10b981', 15, 4);
          addKillFeed(`You picked up ${types}`);
        }
        for (const bot of bots) {
          if (bot.hp <= 0) continue;
          if (pu.respawnAt > now) continue;
          if (dist(pu, bot) < TANK_RADIUS + 16) {
            if (pu.type === 'health') { bot.hp = Math.min(bot.maxHp, bot.hp + 40); }
            else if (pu.type === 'speed') { bot.speed = bot.baseSpeed * 1.6; bot.powerupTimer = 300; }
            else if (pu.type === 'damage') { bot.damage = bot.baseDamage * 2; bot.bulletSpeed = bot.baseBulletSpeed * 1.4; bot.powerupTimer = 300; }
            else if (pu.type === 'shield') { bot.hp = Math.min(bot.maxHp, bot.hp + 60); bot.powerupTimer = 60; }
            pu.respawnAt = now + 8000;
            audioRef.current.play('powerup');
            spawnParticles(pu.x, pu.y, bot.color, 15, 4);
          }
        }
      }

      draw(player, bots, bullets, powerups, particles, damageTexts, isDead, now);
      drawMinimap(player, bots, powerups);

      if (isDead && now >= deathTimer) {
        isDead = false; player.hp = player.maxHp; player.x = MAP_W / 2; player.y = MAP_H / 2; setGameOver(false);
        spawnParticles(player.x, player.y, player.color, 15, 4);
      }

      animRef.current = requestAnimationFrame(gameLoop);
    }

    function draw(player: Tank, bots: Tank[], bullets: Bullet[], powerups: PowerUp[], particles: Particle[], damageTexts: DamageText[], isDead: boolean, now: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = canvas.width, H = canvas.height;
      const shakeX = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
      const shakeY = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
      const camX = player.x - W / 2 + shakeX;
      const camY = player.y - H / 2 + shakeY;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(-camX, -camY);

      ctx.strokeStyle = '#16213e';
      ctx.lineWidth = 1;
      for (let x = 0; x <= MAP_W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, MAP_H); ctx.stroke(); }
      for (let y = 0; y <= MAP_H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(MAP_W, y); ctx.stroke(); }

      ctx.strokeStyle = '#0f3460';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, MAP_W, MAP_H);

      for (const w of wallsRef.current) {
        ctx.fillStyle = '#2a2a4a';
        ctx.shadowColor = '#0f3460';
        ctx.shadowBlur = 10;
        ctx.fillRect(w.x, w.y, w.w, w.h);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#3a3a6a';
        ctx.lineWidth = 2;
        ctx.strokeRect(w.x, w.y, w.w, w.h);
        ctx.fillStyle = '#3a3a5a';
        ctx.fillRect(w.x + 4, w.y + 4, w.w - 8, w.h - 8);
      }

      for (const pu of powerups) {
        if (pu.respawnAt > now) continue;
        const c = pu.type === 'health' ? '#10b981' : pu.type === 'speed' ? '#f59e0b' : pu.type === 'damage' ? '#ef4444' : '#8b5cf6';
        const pulse = Math.sin(now / 200) * 0.3 + 0.7;
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

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vx *= 0.98; p.vy *= 0.98; p.life--;
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        if (p.life <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      for (const b of bullets) {
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(b.x, b.y, BULLET_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(b.x - b.vx * 0.3, b.y - b.vy * 0.3, BULLET_RADIUS * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      const allTanks = isDead ? bots : [player, ...bots];
      for (const tank of allTanks) {
        if (tank.hp <= 0) continue;
        const isP = !tank.isBot;
        ctx.save();
        ctx.translate(tank.x, tank.y);

        const tColor = isP ? '#10b981' : tank.color;
        const dColor = isP ? '#047857' : '#3a1a1a';

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

        if (tank.powerupTimer > 0) {
          ctx.fillStyle = tColor;
          ctx.globalAlpha = 0.3 + Math.sin(now / 100) * 0.2;
          ctx.beginPath();
          ctx.arc(0, 0, TANK_RADIUS + 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        ctx.restore();
      }

      for (let i = damageTexts.length - 1; i >= 0; i--) {
        const dt = damageTexts[i];
        dt.y += dt.vy; dt.life--;
        const alpha = dt.life / 40;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = dt.color;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dt.text, dt.x, dt.y);
        if (dt.life <= 0) damageTexts.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      ctx.restore();

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, 160, 28);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`K: ${player.kills}  D: ${player.deaths}`, 8, 6);

      if (isDead) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 40px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ELIMINATED', W / 2, H / 2 - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '16px monospace';
        ctx.fillText('Respawning...', W / 2, H / 2 + 30);
      }
    }

    function drawMinimap(player: Tank, bots: Tank[], powerups: PowerUp[]) {
      const canvas = minimapRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const W = canvas.width, H = canvas.height;
      const sX = W / MAP_W, sY = H / MAP_H;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, W, H);

      for (const w of wallsRef.current) {
        ctx.fillStyle = '#2a2a4a';
        ctx.fillRect(w.x * sX, w.y * sY, w.w * sX, w.h * sY);
      }

      for (const pu of powerups) {
        if (pu.respawnAt > Date.now()) continue;
        ctx.fillStyle = pu.type === 'health' ? '#10b981' : pu.type === 'speed' ? '#f59e0b' : pu.type === 'damage' ? '#ef4444' : '#8b5cf6';
        ctx.fillRect(pu.x * sX - 1, pu.y * sY - 1, 3, 3);
      }

      for (const bot of bots) {
        if (bot.hp <= 0) continue;
        ctx.fillStyle = bot.color;
        ctx.fillRect(bot.x * sX - 2, bot.y * sY - 2, 4, 4);
      }

      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(player.x * sX, player.y * sY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    animRef.current = requestAnimationFrame(gameLoop);
    gameRef.current = { stop: () => { if (animRef.current) cancelAnimationFrame(animRef.current); } };
  }, [addKillFeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    const handleMouseMove = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    const handleMouseDown = (e: MouseEvent) => { if (e.button === 0) mouseRef.current.down = true; };
    const handleMouseUp = (e: MouseEvent) => { if (e.button === 0) mouseRef.current.down = false; };
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current.add(e.key.toLowerCase()); if (e.key.toLowerCase() === ' ' || e.key === 'Tab') e.preventDefault(); };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
    const handleContextMenu = (e: Event) => e.preventDefault();

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      lastTouchRef.current = { x: t.clientX, y: t.clientY };
      mouseRef.current.x = t.clientX;
      mouseRef.current.y = t.clientY;
      if (t.clientX < window.innerWidth / 2) {
        joystickRef.current.active = true;
      } else {
        mouseRef.current.down = true;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      mouseRef.current.x = t.clientX;
      mouseRef.current.y = t.clientY;
      if (joystickRef.current.active) {
        const dx = t.clientX - lastTouchRef.current.x;
        const dy = t.clientY - lastTouchRef.current.y;
        const maxDist = 50;
        const d = Math.hypot(dx, dy);
        if (d > maxDist) { joystickRef.current.dx = dx / d; joystickRef.current.dy = dy / d; }
        else { joystickRef.current.dx = dx / maxDist; joystickRef.current.dy = dy / maxDist; }
        lastTouchRef.current = { x: t.clientX, y: t.clientY };
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 0) { joystickRef.current = { active: false, dx: 0, dy: 0 }; mouseRef.current.down = false; }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('contextmenu', handleContextMenu);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('contextmenu', handleContextMenu);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      if (gameRef.current?.stop) gameRef.current.stop();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative flex-1 min-h-0">
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
        {started && (
          <>
            <div className="absolute top-3 left-3 z-20 text-xs font-mono text-emerald-400 bg-black/60 px-2 py-1 rounded-lg pointer-events-none">
              K: {score.kills} D: {score.deaths}
            </div>
            <div className="absolute bottom-20 left-3 z-20 space-y-1 pointer-events-none">
              {killFeed.map((item, i) => (
                <div key={item.time} className="text-[10px] font-mono bg-black/70 px-2 py-1 rounded text-gray-300" style={{ animation: 'feedFadeIn 0.3s ease-out' }}>
                  {item.text}
                </div>
              ))}
            </div>
            <div className="absolute top-3 right-3 z-20 w-48 max-h-60 overflow-y-auto rounded-lg bg-black/70 border border-[var(--border)] p-2 text-[10px] font-mono pointer-events-none">
              <div className="text-[var(--accent)] font-bold mb-1 text-xs">Leaderboard</div>
              {leaderboard.slice(0, 10).map((e, i) => (
                <div key={e.id} className={`flex justify-between gap-1 ${e.isPlayer ? 'text-emerald-400' : 'text-gray-300'}`}>
                  <span className="truncate">{i + 1}. {e.name}</span>
                  <span className="shrink-0">{e.kills}K / {e.deaths}D</span>
                </div>
              ))}
            </div>
          </>
        )}
        <canvas
          ref={minimapRef}
          width={160}
          height={160}
          className="absolute bottom-3 right-3 rounded-lg border border-[var(--border)] opacity-70 hover:opacity-100 transition-opacity"
        />
      </div>
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-emerald-400">AniTanks</h2>
            <p className="text-sm text-gray-400">WASD move · Mouse aim · Click shoot</p>
            <p className="text-xs text-gray-500">Mobile: touch left side to move · touch right side to fire</p>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
            >
              Play Now
            </button>
          </div>
        </div>
      )}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 pointer-events-none">
          <div className="text-center space-y-3 bg-black/80 rounded-2xl p-6 border border-red-500/20">
            <p className="text-red-400 font-bold text-lg">Eliminated!</p>
            <p className="text-gray-400 text-sm">Kills: {score.kills} · Deaths: {score.deaths}</p>
            <p className="text-gray-500 text-xs">Respawning...</p>
          </div>
        </div>
      )}
      <style>{`@keyframes feedFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
