import React, { useState } from 'react';
import "./app.css";

const RECETAS = [
  {
    id: 1,
    titulo: 'Panettone casero',
    imagen: 'img1.png',
    tiempo: '2h 30m',
    dificultad: 'Media',
    tags: ['Postre','Tradicional']
  },
  {
    id: 2,
    titulo: 'Pernil navideño',
    imagen: 'img2.png',
    tiempo: '5h',
    dificultad: 'Alta',
    tags: ['Plato fuerte','Carnes']
  },
  {
    id: 3,
    titulo: 'Ensalada agridulce',
    imagen: 'img3.png',
    tiempo: '20m',
    dificultad: 'Baja',
    tags: ['Acompañante','Vegetariano']
  },
  {
    id: 4,
    titulo: 'Galletas de jengibre',
    imagen: 'img4.png',
    tiempo: '45m',
    dificultad: 'Baja',
    tags: ['Postre','Galletas']
  },
  {
    id: 5,
    titulo: 'Especial falu',
    imagen: 'img5.png',
    tiempo: '20m',
    dificultad: 'Baja',
    tags: ['Postre','Vegetariano']
  }
];

export default function RecetasNavidenas() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const recetasFiltradas = RECETAS.filter(receta => {
    const coincideBusqueda =
      receta.titulo.toLowerCase().includes(search.toLowerCase());

    const coincideFiltro =
      filter === 'all' ||
      receta.tags.some(tag =>
        tag.toLowerCase().includes(filter)
      );

    return coincideBusqueda && coincideFiltro;
  });

  return (
    <div className="rn-page">
      <header className="rn-header">
        <div className="rn-header-inner">
          <h1 className="rn-title">Recetas Navideñas</h1>
          <p className="rn-subtitle">
            Ideas festivas para tu mesa — probalas y adaptalas a tu gusto
          </p>
        </div>
      </header>

      <main className="rn-main">
        <section className="rn-controls">
          <input
            className="rn-search"
            placeholder="Buscar receta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rn-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="postre">Postres</option>
            <option value="plato">Platos fuertes</option>
            <option value="acompanante">Acompañantes</option>
          </select>
        </section>

        <section className="rn-grid">
          {recetasFiltradas.map(receta => (
            <article key={receta.id} className="rn-card">
              <div className="rn-card-top">
                <div className="rn-card-badge">{receta.tags[0]}</div>
                <h2 className="rn-card-title">{receta.titulo}</h2>
              </div>

              <div className="rn-card-image">
                <img src={receta.imagen} alt={receta.titulo} />
              </div>

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

        <footer className="rn-footer">
          © {new Date().getFullYear()} — Nochebuena en tu cocina
        </footer>
      </main>
    </div>
  );
}
