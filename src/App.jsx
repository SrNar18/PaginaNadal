import React from 'react';
import "./app.css";


const RECETAS = [
  {
    id: 1,
    titulo: 'Panettone casero',
    descripcion: 'Esponjoso y con frutas confitadas — ideal para compartir.',
    tiempo: '2h 30m',
    dificultad: 'Media',
    tags: ['Postre','Tradicional']
  },
  {
    id: 2,
    titulo: 'Pernil navideño',
    descripcion: 'Asado lento con adobo cítrico y hierbas.',
    tiempo: '5h',
    dificultad: 'Alta',
    tags: ['Plato fuerte','Carnes']
  },
  {
    id: 3,
    titulo: 'Ensalada agridulce de manzana',
    descripcion: 'Fresca, con nueces y aliño cremoso.',
    tiempo: '20m',
    dificultad: 'Baja',
    tags: ['Acompañante','Vegetariano']
  },
  {
    id: 4,
    titulo: 'Galletas de jengibre',
    descripcion: 'Crujientes por fuera y suaves por dentro.',
    tiempo: '45m',
    dificultad: 'Baja',
    tags: ['Postre','Galletas']
  }
];

export default function RecetasNavidenas() {
  return (
    <div className="rn-page">
      <header className="rn-header">
        <div className="rn-header-inner">
          <h1 className="rn-title">Recetas Navideñas</h1>
          <p className="rn-subtitle">Ideas festivas para tu mesa — probalas y adaptalas a tu gusto</p>
        </div>
      </header>

      <main className="rn-main">
        <section className="rn-controls">
          <input className="rn-search" placeholder="Buscar receta..." aria-label="Buscar receta" />
          <select className="rn-filter" aria-label="Filtrar por categoría">
            <option value="all">Todas</option>
            <option value="postre">Postres</option>
            <option value="plato">Platos fuertes</option>
            <option value="acompanante">Acompañantes</option>
          </select>
        </section>

        <section className="rn-grid" aria-live="polite">
          {RECETAS.map(receta => (
            <article key={receta.id} className="rn-card">
              <div className="rn-card-top">
                <div className="rn-card-badge">{receta.tags[0]}</div>
                <h2 className="rn-card-title">{receta.titulo}</h2>
              </div>

              <p className="rn-card-desc">{receta.descripcion}</p>

              <ul className="rn-card-meta">
                <li>⏱ {receta.tiempo}</li>
                <li>⚙️ {receta.dificultad}</li>
              </ul>

              <div className="rn-card-tags">
                {receta.tags.map((t, i) => (
                  <span key={i} className="rn-tag">{t}</span>
                ))}
              </div>

              <div className="rn-card-actions">
                <button className="rn-btn rn-btn-primary">Ver receta</button>
                <button className="rn-btn rn-btn-ghost">Añadir a favoritos</button>
              </div>
            </article>
          ))}
        </section>

        <footer className="rn-footer">© {new Date().getFullYear()} — Nochebuena en tu cocina</footer>
      </main>
    </div>
  );
}

