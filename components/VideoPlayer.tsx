'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VideoPlayerProps {
  animeId: number;
  episode: number;
  title: string;
  animeTitle: string;
  image?: string;
  trailerId?: string | null;
  totalEpisodes: number;
}

export default function VideoPlayer({ animeId, episode, title, animeTitle, image, trailerId, totalEpisodes }: VideoPlayerProps) {
  const [lang, setLang] = useState<'sub' | 'dub'>('sub');
  const [server, setServer] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoSkipIntro, setAutoSkipIntro] = useState(true);
  const [autoNext, setAutoNext] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('anibyte-player-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.autoPlay === 'boolean') setAutoPlay(parsed.autoPlay);
        if (typeof parsed.autoSkipIntro === 'boolean') setAutoSkipIntro(parsed.autoSkipIntro);
        if (typeof parsed.autoNext === 'boolean') setAutoNext(parsed.autoNext);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('anibyte-player-settings', JSON.stringify({ autoPlay, autoSkipIntro, autoNext }));
  }, [autoPlay, autoSkipIntro, autoNext]);

  const servers = [
    { name: 'MegaPlay 1', url: `https://megaplay.buzz/stream/mal/${animeId}/${episode}/${lang}` },
    { name: 'MegaPlay 2', url: `https://megaplay.buzz/embed/mal/${animeId}/${episode}/${lang}` },
    { name: 'VidSrc', url: `https://vidsrc.cc/v2/embed/anime/${animeId}/${episode}/${lang}` },
    { name: 'VidLink', url: `https://vidlink.pro/anime/${animeId}/${episode}/${lang}` },
    { name: 'Ninja', url: `https://ninjasheild.stream/map/animemal/${animeId}/${episode}/${lang}` },
    { name: 'DropFile', url: `https://dropfile.cc/player/tv/mal-${animeId}/${episode}/1?audio=${lang}&lang=en` },
  ];

  const getEmbedUrl = () => {
    const baseUrl = servers[server].url;
    if (server === 2) {
      const params = new URLSearchParams();
      params.set('autoPlay', autoPlay ? '1' : '0');
      params.set('autoSkipIntro', autoSkipIntro ? '1' : '0');
      return baseUrl + '?' + params.toString();
    }
    return baseUrl;
  };

  const embedUrl = getEmbedUrl();
  const nextEp = episode < totalEpisodes ? episode + 1 : null;

  return (
    <div className="w-full">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title={`${animeTitle} Episode ${episode} - Video Player`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-1">
            <button
              onClick={() => setLang('sub')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                lang === 'sub' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sub
            </button>
            <button
              onClick={() => setLang('dub')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                lang === 'dub' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Dub
            </button>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-gray-400">
            HD
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-gray-400 uppercase">
            {lang === 'sub' ? 'Japanese' : 'English'}
          </span>
          <div className="flex items-center gap-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-1 overflow-x-auto max-w-full">
            {servers.map((s, i) => (
              <button
                key={i}
                onClick={() => setServer(i)}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  server === i ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <a
            href={`https://nyaa.si/?q=${encodeURIComponent(animeTitle)}+Episode+${episode}&c=1_2`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl hover:bg-[var(--bg-card)] hover:text-white transition-all"
            title="Download episode from Nyaa.si"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
          <a
            href={`https://nyaa.si/?q=${encodeURIComponent(animeTitle)}+Episode+${episode}+English+Subtitles&c=1_3`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl hover:bg-[var(--bg-card)] hover:text-white transition-all"
            title="Download subtitles from Nyaa.si"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
          </a>
          <a
            href={`/watch/${animeId}?ep=${episode}`}
            className="p-2 rounded-xl hover:bg-[var(--bg-card)] hover:text-white transition-all"
            title="Direct link to this episode"
            aria-label="Copy episode link"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </a>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`relative w-9 h-5 rounded-full transition-colors ${autoPlay ? 'bg-emerald-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${autoPlay ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className="text-xs text-gray-400 font-medium">Auto-play</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            onClick={() => setAutoSkipIntro(!autoSkipIntro)}
            className={`relative w-9 h-5 rounded-full transition-colors ${autoSkipIntro ? 'bg-emerald-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${autoSkipIntro ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className="text-xs text-gray-400 font-medium">Auto-skip intro</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            onClick={() => setAutoNext(!autoNext)}
            className={`relative w-9 h-5 rounded-full transition-colors ${autoNext ? 'bg-emerald-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${autoNext ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className="text-xs text-gray-400 font-medium">Auto-next</span>
        </label>
        {autoNext && nextEp && (
          <Link
            href={`/watch/${animeId}?ep=${nextEp}`}
            className="ml-auto px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
          >
            Next Episode &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
