import React, { useState, useEffect } from "react";
// App.jsx o RecetasNavidenas.jsx (donde lo necesités)
import "./app.css";


// RecetasNavidenas.jsx
// Página completa en un solo archivo React (JSX) estilada con Tailwind.
// - Exporta un componente por defecto
// - Incluye: búsqueda, filtros, detalle en modal, favoritos, imprimir/descargar receta,
//   generador simple de receta a partir de ingredientes (simulado), y un formulario para agregar recetas.

export default function RecetasNavidenas() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [query, setQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterTime, setFilterTime] = useState("all");
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("fav_recetas");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    difficulty: "Fácil",
    time: 30,
  });

  useEffect(() => {
    localStorage.setItem("fav_recetas", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(id) {
    setFavorites((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function filtered() {
    return recipes
      .filter((r) => r.title.toLowerCase().includes(query.toLowerCase()) || r.ingredients.toLowerCase().includes(query.toLowerCase()))
      .filter((r) => (filterDifficulty === "all" ? true : r.difficulty === filterDifficulty))
      .filter((r) => {
        if (filterTime === "all") return true;
        if (filterTime === "<30") return r.time < 30;
        if (filterTime === "30-60") return r.time >= 30 && r.time <= 60;
        return r.time > 60;
      });
  }

  function addRecipe(e) {
    e.preventDefault();
    const id = Date.now().toString(36);
    const recipe = {
      id,
      ...newRecipe,
      ingredients: newRecipe.ingredients.trim(),
      steps: newRecipe.steps.trim(),
    };
    setRecipes((s) => [recipe, ...s]);
    setShowAdd(false);
    setNewRecipe({ title: "", description: "", ingredients: "", steps: "", difficulty: "Fácil", time: 30 });
  }

  function downloadRecipe(r) {
    const content = `\n${r.title}\n\nDescripción:\n${r.description}\n\nIngredientes:\n${r.ingredients}\n\nPasos:\n${r.steps}\n\nTiempo: ${r.time} min\nDificultad: ${r.difficulty}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printRecipe(r) {
    const w = window.open("", "_blank", "width=800,height=600");
    w.document.write(`<html><head><title>${r.title}</title><link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css\" rel=\"stylesheet\"/></head><body class=\"p-6\"><h1 style=\"font-family: system-ui;\">${r.title}</h1><h3>Descripción</h3><p>${r.description}</p><h3>Ingredientes</h3><pre>${r.ingredients}</pre><h3>Pasos</h3><pre>${r.steps}</pre></body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 500);
  }

  // Generador simple de receta a partir de lista de ingredientes
  function generateFromIngredients(ingText) {
    // algoritmo simple: busca recetas existentes que compartan ingredientes y compone una nueva sugerencia
    const ings = ingText
      .split(/,|\n|;/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (ings.length === 0) return null;

    // puntuación por coincidencia
    const scores = recipes.map((r) => {
      const rings = r.ingredients.toLowerCase();
      const matchCount = ings.reduce((acc, ing) => (rings.includes(ing) ? acc + 1 : acc), 0);
      return { id: r.id, match: matchCount, r };
    });

    scores.sort((a, b) => b.match - a.match);
    const best = scores[0];

    // si no coincidencias relevantes, devolver plantilla simple
    if (!best || best.match === 0) {
      return {
        title: `Galletas Navideñas improvisadas`,
        description: `Una receta rápida usando lo que tenés.`,
        ingredients: ingText,
        steps: `1. Mezclá los ingredientes.\n2. Formá bolitas.\n3. Horneá 12-15 minutos.`,
        difficulty: "Fácil",
        time: 30,
      };
    }

    // construir versión combinada
    const base = best.r;
    return {
      title: `${base.title} - Versión rápida`,
      description: base.description + " (adaptada a tus ingredientes)",
      ingredients: Array.from(new Set([...base.ingredients.split(/,|\n/).map(s => s.trim()).filter(Boolean), ...ings])).join('\n'),
      steps: base.steps,
      difficulty: base.difficulty,
      time: Math.max(20, Math.floor(base.time * 0.8)),
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-rose-900 text-slate-100 p-6 font-sans">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Recetas Navideñas</h1>
          <p className="text-sm opacity-80 mt-1">Inspirá, cociná y compartí el espíritu navideño.</p>
        </div>
        <div className="flex gap-3 items-center">
          <input
            aria-label="Buscar recetas"
            className="rounded-md px-3 py-2 text-slate-900"
            placeholder="Buscar por nombre o ingrediente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="px-3 py-2 bg-amber-400 text-slate-900 rounded-md font-semibold" onClick={() => setShowAdd(true)}>
            + Añadir receta
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 bg-white/5 rounded-2xl p-4 space-y-4">
          <h3 className="font-semibold">Filtros</h3>

          <div>
            <label className="text-sm block mb-1">Dificultad</label>
            <select className="w-full rounded-md text-slate-900 p-2" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
              <option value="all">Todas</option>
              <option>Fácil</option>
              <option>Media</option>
              <option>Difícil</option>
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">Tiempo</label>
            <select className="w-full rounded-md text-slate-900 p-2" value={filterTime} onChange={(e) => setFilterTime(e.target.value)}>
              <option value="all">Cualquiera</option>
              <option value="<30">Menos de 30 min</option>
              <option value="30-60">30 - 60 min</option>
              <option value=">60">Más de 60 min</option>
            </select>
          </div>

          <div>
            <h4 className="font-medium">Generador desde ingredientes</h4>
            <IngredientGenerator onGenerate={(r) => setSelected(r)} />
          </div>

          <div>
            <h4 className="font-medium">Favoritas</h4>
            {favorites.length === 0 ? (
              <p className="text-sm opacity-80">Aún no tenés favoritas.</p>
            ) : (
              <ul className="space-y-2">
                {favorites.map((fid) => {
                  const r = recipes.find((x) => x.id === fid);
                  if (!r) return null;
                  return (
                    <li key={fid} className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span>{r.title}</span>
                      <button className="text-amber-300" onClick={() => setSelected(r)}>
                        Ver
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        <section className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered().map((r) => (
              <article key={r.id} className="bg-white/5 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{r.title}</h3>
                    <p className="text-sm opacity-80 mt-1 line-clamp-3">{r.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xs bg-white/10 px-2 py-1 rounded">{r.difficulty}</div>
                    <div className="text-xs bg-white/10 px-2 py-1 rounded">{r.time} min</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1 bg-amber-400 text-slate-900 rounded" onClick={() => setSelected(r)}>
                    Ver
                  </button>
                  <button className="px-2 py-1 bg-white/5 rounded" onClick={() => toggleFavorite(r.id)}>
                    {favorites.includes(r.id) ? '💖' : '🤍'}
                  </button>
                  <button className="px-2 py-1 bg-white/5 rounded" onClick={() => downloadRecipe(r)}>Descargar</button>
                  <button className="px-2 py-1 bg-white/5 rounded" onClick={() => printRecipe(r)}>Imprimir</button>
                </div>
              </article>
            ))}

            {filtered().length === 0 && (
              <div className="col-span-full text-center text-slate-200/80 p-6 bg-white/6 rounded">No se encontraron recetas — probá otra búsqueda.</div>
            )}
          </div>
        </section>
      </main>

      {/* Modal detalle */}
      {selected && (
        <DetailModal recipe={selected} onClose={() => setSelected(null)} onToggleFav={() => toggleFavorite(selected.id)} onDownload={() => downloadRecipe(selected)} onPrint={() => printRecipe(selected)} isFav={selected.id && favorites.includes(selected.id)} />
      )}

      {/* Modal añadir receta simple */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Añadir receta</h2>
            <form onSubmit={addRecipe} className="space-y-3">
              <input required placeholder="Título" className="w-full p-2 rounded text-slate-900" value={newRecipe.title} onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })} />
              <input placeholder="Descripción" className="w-full p-2 rounded text-slate-900" value={newRecipe.description} onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })} />
              <textarea required placeholder="Ingredientes (separados por comas o nuevas líneas)" className="w-full p-2 rounded text-slate-900" value={newRecipe.ingredients} onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })} />
              <textarea required placeholder="Pasos" className="w-full p-2 rounded text-slate-900" value={newRecipe.steps} onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })} />
              <div className="flex gap-2">
                <select className="p-2 rounded text-slate-900" value={newRecipe.difficulty} onChange={(e) => setNewRecipe({ ...newRecipe, difficulty: e.target.value })}>
                  <option>Fácil</option>
                  <option>Media</option>
                  <option>Difícil</option>
                </select>
                <input type="number" className="p-2 rounded text-slate-900" value={newRecipe.time} onChange={(e) => setNewRecipe({ ...newRecipe, time: Number(e.target.value) })} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-3 py-2 bg-white/5 rounded" onClick={() => setShowAdd(false)}>Cancelar</button>
                <button className="px-3 py-2 bg-amber-400 rounded text-slate-900">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto mt-12 text-center text-sm opacity-80">Hecho con ❤️ para la temporada. Podés personalizar estilos y añadir persistencia en servidor.</footer>
    </div>
  );
}


// --- COMPONENTES AUXILIARES ---

function IngredientGenerator({ onGenerate }) {
  const [text, setText] = useState("");
  function handleGen() {
    const r = generateFromLocal(text);
    onGenerate(r);
  }
  // versión local simple (no accede al componente padre)
  function generateFromLocal(ing) {
    const ings = ing.split(/,|\n|;/).map(s => s.trim()).filter(Boolean);
    if (ings.length === 0) return null;
    return {
      id: 'generated',
      title: `Receta rápida con ${ings[0]}`,
      description: `Adaptada a los ingredientes que tenés: ${ings.slice(0,3).join(', ')}`,
      ingredients: ings.join('\n'),
      steps: `1. Mezclar\n2. Cocinar\n3. Servir`,
      difficulty: 'Fácil',
      time: 25
    };
  }
  return (
    <div className="space-y-2">
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Ej: harina, mantequilla, azúcar, canela" className="w-full p-2 rounded text-slate-900"></textarea>
      <div className="flex gap-2">
        <button onClick={handleGen} className="px-3 py-1 bg-emerald-400 rounded text-slate-900">Generar</button>
        <button onClick={() => { setText(''); onGenerate(null); }} className="px-3 py-1 bg-white/5 rounded">Limpiar</button>
      </div>
    </div>
  );
}

function DetailModal({ recipe, onClose, onToggleFav, onDownload, onPrint, isFav }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-3xl w-full p-6 overflow-auto">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{recipe.title}</h2>
            <p className="text-sm opacity-80 mt-1">{recipe.description}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onToggleFav} className="px-3 py-1 bg-white/5 rounded">{isFav ? '💖 Favorita' : '🤍 Favorita'}</button>
            <button onClick={onDownload} className="px-3 py-1 bg-white/5 rounded">Descargar</button>
            <button onClick={onPrint} className="px-3 py-1 bg-white/5 rounded">Imprimir</button>
            <button onClick={onClose} className="px-3 py-1 bg-rose-500 rounded">Cerrar</button>
          </div>
        </div>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold">Ingredientes</h3>
            <pre className="whitespace-pre-wrap mt-2 bg-white/5 p-3 rounded">{recipe.ingredients}</pre>
          </div>
          <div>
            <h3 className="font-semibold">Pasos</h3>
            <pre className="whitespace-pre-wrap mt-2 bg-white/5 p-3 rounded">{recipe.steps}</pre>
          </div>
        </section>

        <div className="mt-6 flex gap-4 text-sm opacity-80">
          <div>Dificultad: {recipe.difficulty}</div>
          <div>Tiempo: {recipe.time} min</div>
        </div>
      </div>
    </div>
  );
}

// --- DATOS DE EJEMPLO ---
const initialRecipes = [
  {
    id: "r1",
    title: "Galletas de mantequilla y canela",
    description: "Galletas tradicionales navideñas, crujientes por fuera y tiernas por dentro.",
    ingredients: `250g mantequilla\n200g azúcar\n2 huevos\n450g harina\n1 cdta canela\n1 cdta polvo de hornear`,
    steps: `1. Batir mantequilla con azúcar.\n2. Añadir huevos.\n3. Incorporar harina, canela y polvo de hornear.\n4. Formar y hornear 12-15 min a 180°C.`,
    difficulty: "Fácil",
    time: 40,
  },
  {
    id: "r2",
    title: "Panettone casero (versión corta)",
    description: "Una versión simplificada del clásico panettone italiano, ideal para compartir.",
    ingredients: `500g harina\n200ml leche tibia\n100g azúcar\n2 huevos\n100g mantequilla\nRalladura de naranja\nFrutas confitadas al gusto`,
    steps: `1. Mezclar ingredientes secos y húmedos.\n2. Amasar 10 min.\n3. Reposar 1 hora.\n4. Añadir frutas y hornear 40-50 min a 170°C.`,
    difficulty: "Media",
    time: 120,
  },
  {
    id: "r3",
    title: "Salsa de arándanos rápida",
    description: "Perfecta para acompañar pavos o postres.",
    ingredients: `300g arándanos\n150g azúcar\nRalladura de naranja\nJugo de 1 naranja`,
    steps: `1. Hervir todos los ingredientes 10-12 minutos hasta espesar.`,
    difficulty: "Fácil",
    time: 20,
  },
  {
    id: "r4",
    title: "Tronco de Navidad (Brazo gitano)",
    description: "Postre espectacular para la mesa navideña.",
    ingredients: `4 huevos\n120g harina\n120g azúcar\nCrema para rellenar\nCobertura de chocolate`,
    steps: `1. Batir huevos y azúcar al punto.\n2. Agregar harina con cuidado.\n3. Hornear 10 min.\n4. Rellenar y enrollar.\n5. Cubrir con chocolate.`,
    difficulty: "Media",
    time: 60,
  }
];
