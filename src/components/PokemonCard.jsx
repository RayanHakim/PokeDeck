import React from 'react';

const typeColors = {
  fire: 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  water: 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  grass: 'bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.3)]',
  electric: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
  poison: 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  flying: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
  bug: 'bg-lime-500/20 text-lime-400 border-lime-500/40 shadow-[0_0_15px_rgba(132,204,22,0.3)]',
  normal: 'bg-slate-400/20 text-slate-300 border-slate-400/40',
  ground: 'bg-amber-700/20 text-amber-500 border-amber-700/40',
  fairy: 'bg-pink-500/20 text-pink-400 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]',
  psychic: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  fighting: 'bg-orange-600/20 text-orange-500 border-orange-600/40',
  rock: 'bg-stone-500/20 text-stone-400 border-stone-500/40',
  ghost: 'bg-violet-700/20 text-violet-400 border-violet-700/40 shadow-[0_0_15px_rgba(109,40,217,0.3)]',
  ice: 'bg-cyan-300/20 text-cyan-300 border-cyan-300/40',
  dragon: 'bg-blue-700/20 text-blue-500 border-blue-700/40',
  dark: 'bg-zinc-800/20 text-zinc-400 border-zinc-800/40',
  steel: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
};

const glowColors = {
  fire: 'group-hover:shadow-red-500/20',
  water: 'group-hover:shadow-blue-500/20',
  grass: 'group-hover:shadow-green-500/20',
  electric: 'group-hover:shadow-yellow-500/20',
  poison: 'group-hover:shadow-purple-500/20',
};

export default function PokemonCard({ pokemon, onClick }) {
  const hp = pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
  const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
  const mainType = pokemon.types[0].type.name;

  return (
    <div 
      onClick={() => onClick && onClick(pokemon)}
      className={`group relative bg-slate-900/60 backdrop-blur-xl rounded-[1.8rem] md:rounded-[2.5rem] p-4 md:p-6 transition-all duration-500 cursor-pointer border border-white/5 hover:border-white/20 hover:-translate-y-2 md:hover:-translate-y-4 flex flex-col items-center overflow-hidden shadow-2xl ${glowColors[mainType] || 'group-hover:shadow-yellow-500/10'}`}
    >
      {/* Efek Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Dinamis Gradient Glow (Desktop Only Interaction) */}
      <div className="hidden md:block absolute -inset-24 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>

      {/* Header: ID & HP (Disesuaikan untuk Mobile) */}
      <div className="w-full flex justify-between items-center mb-1 md:mb-2 z-10">
        <div className="flex flex-col">
          <span className="text-[8px] md:text-[10px] font-black text-slate-500 tracking-tighter uppercase italic">Pokedex</span>
          <span className="text-white font-mono text-xs md:text-sm font-black">#{String(pokemon.id).padStart(3, '0')}</span>
        </div>
        <div className="bg-red-500/10 backdrop-blur-md text-red-500 text-[8px] md:text-[10px] px-2 md:px-3 py-0.5 md:py-1 rounded-full font-black border border-red-500/20">
          HP {hp}
        </div>
      </div>

      {/* Pokemon Image Area */}
      <div className="relative w-full aspect-square flex items-center justify-center my-2 md:my-4">
        {/* Aura Dinamis (Ukuran lebih kecil di mobile) */}
        <div className="absolute w-24 h-24 md:w-40 md:h-40 bg-white/5 rounded-full blur-2xl md:blur-3xl group-hover:scale-125 md:group-hover:scale-150 transition-transform duration-700"></div>
        
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default} 
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] md:drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500 ease-out"
          alt={pokemon.name}
        />
      </div>
      
      {/* Name Section */}
      <div className="text-center z-10 mb-2 md:mb-4">
        <h2 className="text-xl md:text-3xl font-black capitalize text-white tracking-tighter group-hover:tracking-normal transition-all duration-300">
          {pokemon.name}
        </h2>
        <div className="h-0.5 md:h-1 w-0 group-hover:w-full bg-yellow-400 mx-auto transition-all duration-500 rounded-full mt-0.5"></div>
      </div>
      
      {/* Type Badges (Mobile: Lebih kecil agar muat 2 baris jika perlu) */}
      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6 justify-center z-10">
        {pokemon.types.map(t => (
          <span 
            key={t.type.name} 
            className={`px-2.5 md:px-4 py-1 rounded-lg md:rounded-2xl text-[8px] md:text-[10px] uppercase font-black tracking-widest border transition-all duration-300 ${typeColors[t.type.name] || 'bg-slate-700 text-slate-300'}`}
          >
            {t.type.name}
          </span>
        ))}
      </div>
      
      {/* Stats Dashboard - Glassmorphism Style */}
      <div className="w-full mt-auto grid grid-cols-2 gap-2 md:gap-4 p-2.5 md:p-4 bg-white/5 rounded-[1.2rem] md:rounded-[1.8rem] border border-white/10 backdrop-blur-md z-10">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[7px] md:text-[9px] text-slate-400 uppercase font-black mb-0.5">Atk</span>
          <span className="text-sm md:text-lg font-black text-white">{attack}</span>
        </div>
        <div className="flex flex-col items-center justify-center border-l border-white/10 pl-1 md:pl-2">
          <span className="text-[7px] md:text-[9px] text-slate-400 uppercase font-black mb-0.5">Exp</span>
          <span className="text-sm md:text-lg font-black text-slate-100">{pokemon.base_experience || '---'}</span>
        </div>
      </div>
    </div>
  );
}