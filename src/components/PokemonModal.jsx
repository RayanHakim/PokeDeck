import React, { useEffect, useState } from 'react';
import { getPokemonSpecies, getEvolutionChain } from '../services/pokemonApi';

export default function PokemonModal({ pokemon, onClose }) {
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState(null);
  const [loadingExtra, setLoadingExtra] = useState(true);

  // 1. Lifecycle: Mengambil data tambahan (deskripsi & evolusi) saat modal dibuka
  useEffect(() => {
    const fetchExtraData = async () => {
      setLoadingExtra(true);
      try {
        // Ambil data species untuk mendapatkan flavor text dan URL rantai evolusi
        const speciesData = await getPokemonSpecies(pokemon.id);
        setSpecies(speciesData);
        
        if (speciesData && speciesData.evolution_chain) {
          // Ambil data urutan evolusi berdasarkan URL dari data species
          const evoData = await getEvolutionChain(speciesData.evolution_chain.url);
          setEvolution(evoData);
        }
      } catch (error) {
        console.error("Gagal memuat detail tambahan:", error);
      } finally {
        // Delay kecil untuk transisi loading yang lebih halus
        setTimeout(() => setLoadingExtra(false), 400);
      }
    };
    fetchExtraData();
  }, [pokemon]);

  // 2. Helper: Fungsi rekursif untuk mengubah objek 'chain' API menjadi Array nama satu jalur
  const getEvolutionLine = (chain) => {
    let line = [];
    let currentStep = chain;
    while (currentStep) {
      line.push(currentStep.species.name);
      currentStep = currentStep.evolves_to[0]; // Mengambil evolusi tahap berikutnya
    }
    return line;
  };

  // 3. Filter: Mencari deskripsi berbahasa Inggris dan membersihkan karakter format aneh
  const description = species?.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  )?.flavor_text.replace(/[\f\n\r]/g, ' ');

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-sm animate-fadeIn">
      {/* Overlay: Klik di luar konten modal untuk menutup */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Container: Responsif (Slide up di mobile, centered di desktop) */}
      <div className="bg-slate-900 border-t md:border border-slate-800 w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl relative z-10 animate-slideUp">
        
        {/* Mobile Indicator: Garis kecil penanda modal bisa di-swipe */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-4 md:hidden"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-800/50 backdrop-blur-md rounded-full hover:bg-red-500 transition-all text-white z-20 group"
        >
          <span className="group-hover:rotate-90 transition-transform">✕</span>
        </button>

        <div className="p-6 md:p-12 pt-10 md:pt-12">
          {/* Section: Artwork & Identitas Utama */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            
            <div className="relative group w-full md:w-auto flex justify-center shrink-0">
              <div className="absolute inset-0 bg-yellow-400/20 blur-[80px] rounded-full scale-75 animate-pulse"></div>
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-slate-950/40 rounded-[2.5rem] md:rounded-[3rem] p-6 flex items-center justify-center relative border border-white/5 backdrop-blur-2xl shadow-inner overflow-hidden">
                <img 
                  src={pokemon.sprites.other['official-artwork'].front_default} 
                  className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-float z-10"
                  alt={pokemon.name}
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col gap-1">
                <span className="text-yellow-400 font-mono font-black tracking-[0.4em] uppercase text-xs md:text-sm">
                  #{String(pokemon.id).padStart(3, '0')}
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase italic leading-tight md:leading-[0.9] tracking-tighter text-white drop-shadow-md break-words">
                  {pokemon.name}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start my-4 md:my-6">
                {pokemon.types.map(t => (
                  <span key={t.type.name} className="px-5 py-1.5 bg-white/5 rounded-xl text-[10px] md:text-[12px] font-black uppercase border border-white/10 tracking-widest shadow-lg">
                    {t.type.name}
                  </span>
                ))}
              </div>
              
              {/* Box Deskripsi: Menampilkan skeleton saat loading atau teks deskripsi jika sudah ada */}
              <div className="relative min-h-[60px] bg-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 border border-white/5 shadow-inner">
                {loadingExtra ? (
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-800 rounded-full animate-pulse w-full"></div>
                    <div className="h-3 bg-slate-800 rounded-full animate-pulse w-5/6"></div>
                  </div>
                ) : (
                  <p className="text-slate-300 text-sm md:text-lg leading-relaxed italic font-medium">
                    "{description || "No official data recorded for this entry."}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Grafik Statistik Batang (Base Stats) */}
          <div className="mt-10 md:mt-16">
             <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-500 whitespace-nowrap">Core Statistics</h3>
                <div className="h-[1px] w-full bg-slate-800"></div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
               {pokemon.stats.map(s => (
                 <div key={s.stat.name} className="bg-slate-950/40 p-5 md:p-6 rounded-[1.8rem] md:rounded-[2.2rem] border border-white/5 transition-all hover:bg-slate-950/60 group">
                   <p className="text-[8px] md:text-[10px] text-slate-500 uppercase font-black mb-1 md:mb-2 tracking-widest group-hover:text-yellow-400 transition-colors">
                     {s.stat.name.replace('-', ' ')}
                   </p>
                   <div className="flex items-center gap-3 md:gap-4">
                     <span className="text-xl md:text-3xl font-mono font-bold text-slate-100">{s.base_stat}</span>
                     <div className="flex-1 h-1.5 md:h-2.5 bg-slate-800 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-yellow-500 to-yellow-200 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(250,204,21,0.3)]" 
                         style={{ width: `${Math.min((s.base_stat / 160) * 100, 100)}%` }}
                       ></div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Section: Alur Evolusi (Mapped from line array) */}
          <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-slate-800/50 pb-4">
             <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8 text-center md:text-left">
               Genetic Evolution Line
             </h3>
             
             {loadingExtra ? (
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-24 md:w-32 h-10 md:h-14 bg-slate-800 rounded-xl md:rounded-2xl animate-pulse"></div>
                 ))}
               </div>
             ) : (
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-8">
                 {evolution ? getEvolutionLine(evolution.chain).map((name, index, arr) => (
                   <React.Fragment key={name}>
                     {/* Badge untuk tiap nama Pokemon dalam rantai evolusi */}
                     <div className={`px-5 md:px-10 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-black uppercase tracking-tighter transition-all duration-300 transform text-xs md:text-lg ${
                       name === pokemon.name 
                       ? 'bg-yellow-400 text-slate-900 scale-105 md:scale-115 shadow-[0_10px_40px_rgba(250,204,21,0.5)] md:rotate-[-2deg]' 
                       : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:border-slate-500'
                     }`}>
                       {name}
                     </div>
                     {/* Icon panah: Hanya muncul jika bukan elemen terakhir dalam array */}
                     {index < arr.length - 1 && (
                       <div className="text-slate-700 font-bold animate-pulse text-sm md:text-xl">→</div>
                     )}
                   </React.Fragment>
                 )) : <p className="text-slate-500 italic text-xs md:text-sm">No evolution data found.</p>}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}