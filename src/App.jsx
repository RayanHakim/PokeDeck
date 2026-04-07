import { useState, useEffect } from 'react';
import * as api from './services/pokemonApi';
import PokemonCard from './components/PokemonCard';
import PokemonModal from './components/PokemonModal';

// --- DATA REGION ---
const REGIONS = [
  { name: 'Kanto', limit: 151, offset: 0 },
  { name: 'Johto', limit: 100, offset: 151 },
  { name: 'Hoenn', limit: 135, offset: 251 },
  { name: 'Sinnoh', limit: 107, offset: 386 },
  { name: 'Unova', limit: 156, offset: 493 },
  { name: 'Kalos', limit: 72, offset: 649 },
];

function App() {
  // --- STATES ---
  const [activeTab, setActiveTab] = useState('pokemon'); 
  const [pokemonList, setPokemonList] = useState([]);
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  
  const [currentRegion, setCurrentRegion] = useState(REGIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('id'); 
  
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  
  // State untuk Sidebar (Default terbuka di PC, tertutup di HP)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  // --- 1. FETCH DATA AWAL ---
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [pTypes, pItems] = await Promise.all([
          api.getPokemonTypes(),
          api.getItemsList(60)
        ]);
        setTypes(pTypes);
        setItems(pItems);
      } catch (err) {
        console.error("Gagal load static data", err);
      }
    };
    loadStaticData();

    // Listener untuk resize window
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 2. FETCH DATA POKEMON PER REGION ---
  useEffect(() => {
    const loadPokemonByRegion = async () => {
      setLoading(true);
      try {
        const data = await api.getPokemonList(currentRegion.limit, currentRegion.offset);
        setPokemonList(data);
      } catch (err) {
        console.error("Gagal load pokemon", err);
      } finally {
        setLoading(false);
      }
    };
    loadPokemonByRegion();
  }, [currentRegion]);

  // --- 3. LOGIKA FILTER & SORTING ---
  const filteredPokemon = pokemonList
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || p.types.some(t => t.type.name === selectedType);
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.id - b.id; 
    });

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans selection:bg-yellow-400 selection:text-black overflow-hidden relative">
      
      {/* --- OVERLAY UNTUK HP --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-80 bg-slate-900 border-r border-slate-800 shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col transition-all duration-300 ease-in-out lg:relative 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-80'}`} // Kunci: lg:-ml-80 menarik sidebar keluar dari layar PC
      >
        
        {/* Tombol Close (Mobile/Desktop) */}
        <button 
          className="absolute top-4 right-4 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
          onClick={() => setIsSidebarOpen(false)}
          title="Tutup Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Header Logo di Sidebar */}
        <div className="p-8 pb-4 shrink-0 mt-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 rounded-full"></div>
            <h1 className="relative text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 tracking-tighter uppercase italic">
              PokeDeck
            </h1>
          </div>
          <p className="text-slate-500 mt-2 font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
             <span className="text-yellow-500">|</span> React + Vite
          </p>
        </div>

        {/* Area Scrollable Sidebar */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700">
          
          {/* Main Tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button 
              onClick={() => { setActiveTab('pokemon'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} 
              className={`flex-1 py-3 rounded-xl font-black text-xs transition-all duration-300 ${activeTab === 'pokemon' ? 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-950 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-white'}`}
            >
              🐾 POKEMON
            </button>
            <button 
              onClick={() => { setActiveTab('items'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} 
              className={`flex-1 py-3 rounded-xl font-black text-xs transition-all duration-300 ${activeTab === 'items' ? 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-950 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-white'}`}
            >
              🎒 ITEMS
            </button>
          </div>

          {activeTab === 'pokemon' && (
            <>
              {/* Region Selector */}
              <div>
                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 px-2">📍 Select Region</h3>
                <div className="grid grid-cols-2 gap-2">
                  {REGIONS.map(reg => (
                    <button
                      key={reg.name}
                      onClick={() => {
                        setCurrentRegion(reg);
                        setSelectedType('all');
                        if(window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`px-3 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 border ${
                        currentRegion.name === reg.name 
                        ? 'bg-yellow-400 text-slate-950 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' 
                        : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {reg.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 px-2">↕ Sort Order</h3>
                <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                  <button 
                    onClick={() => setSortBy('id')} 
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${sortBy === 'id' ? 'bg-slate-800 text-yellow-400 shadow-md ring-1 ring-yellow-400/30' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    # Number
                  </button>
                  <button 
                    onClick={() => setSortBy('name')} 
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${sortBy === 'name' ? 'bg-slate-800 text-yellow-400 shadow-md ring-1 ring-yellow-400/30' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    🔤 Abjad
                  </button>
                </div>
              </div>

              {/* Element Filter */}
              <div>
                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 px-2">✨ Element Filter</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedType('all')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all duration-300 ${
                      selectedType === 'all' 
                      ? 'bg-slate-100 text-slate-900 border-transparent shadow-lg' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    All Elements
                  </button>
                  {types.map(t => (
                    <button 
                      key={t.name}
                      onClick={() => setSelectedType(t.name)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase border transition-all duration-300 ${
                        selectedType === t.name 
                        ? 'bg-yellow-400 text-slate-900 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]' 
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black relative transition-all duration-300">
        
        {/* Top Header & Search Bar */}
        <header className="shrink-0 p-4 md:p-6 flex items-center gap-4 z-10 backdrop-blur-md bg-slate-950/50 border-b border-slate-800/50">
          
          {/* Tombol Hamburger (Buka Sidebar) */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 md:p-4 bg-slate-800 rounded-2xl border border-slate-700 text-yellow-400 hover:bg-slate-700 transition-colors shadow-lg group"
              title="Buka Filter"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Search Bar */}
          <div className="flex-1 relative group max-w-4xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <input 
              type="text" 
              placeholder={activeTab === 'pokemon' ? `Cari di ${currentRegion.name}...` : "Cari Items..."} 
              className="relative w-full p-4 pl-6 md:p-5 md:pl-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 focus:border-yellow-400/50 outline-none transition-all shadow-xl text-base md:text-lg placeholder:text-slate-500 focus:ring-2 focus:ring-yellow-400/20"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xl md:text-2xl text-slate-500 group-focus-within:text-yellow-400 transition-colors">🔍</div>
          </div>
        </header>

        {/* Scrollable Data Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-800 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
              </div>
              <p className="text-yellow-400/80 font-mono text-sm uppercase animate-pulse tracking-widest">Loading {currentRegion.name}...</p>
            </div>
          ) : (
            <div className="max-w-[100rem] mx-auto">
              {activeTab === 'pokemon' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8 animate-fadeIn pb-10">
                  {filteredPokemon.length > 0 ? (
                    filteredPokemon.map(p => (
                      <PokemonCard key={p.id} pokemon={p} onClick={setSelectedPokemon} />
                    ))
                  ) : (
                    <div className="col-span-full py-32 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-700/50 backdrop-blur-sm">
                       <p className="text-slate-500 font-mono uppercase tracking-widest text-sm">Tidak ada Pokemon yang ditemukan.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6 animate-fadeIn pb-10">
                   {items.map(i => (
                     <div key={i.id} className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50 flex flex-col items-center group hover:bg-slate-800 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-yellow-500/30 transition-all duration-300">
                        <div className="w-16 h-16 bg-slate-950 rounded-full p-3 mb-4 shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-yellow-400/5 blur-md group-hover:bg-yellow-400/20 transition-all"></div>
                            <img src={i.sprites.default} className="w-full h-full object-contain relative z-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" alt={i.name} />
                        </div>
                        <p className="text-[11px] md:text-xs font-black uppercase tracking-tighter text-center text-slate-200 line-clamp-1">{i.name.replace(/-/g, ' ')}</p>
                        <div className="mt-3 px-3 py-1 bg-slate-900 rounded-xl border border-slate-800/80 w-full text-center">
                          <p className="text-[9px] text-yellow-500 font-black uppercase tracking-widest">Cost: {i.cost || 'Free'}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL DETAIL */}
      {selectedPokemon && <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />}
    </div>
  );
}

export default App;