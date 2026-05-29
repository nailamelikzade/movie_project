import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

function MainPage({ movies, searchQuery, setSearchQuery, fetchMovies, favorites, addToFavorites, listName, setListName, saveFavoriteList }) {
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    
    const trimmedQuery = searchQuery.trim();

   
    if (trimmedQuery === "") {
      alert("Zəhmət olmasa axtarış sözü yazın!");
      return;
    }

   
    if (trimmedQuery.length < 3) {
      alert("Zəhmət olmasa ən azı 3 simvoldan ibarət axtarış sözü yazın (Məs: 1994, Iron Man 3)");
      return;
    }

    fetchMovies(trimmedQuery);
  };

  return (
    <div className="main-container">
      <header className="header-banner">
        <h1>Movie</h1>
      </header>

      {}
      <form className="search-section" onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder="Search" 
          className="search-input" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="purple-btn">Search</button>
      </form>

      <div className="content-grid">
        {}
        <div className="movies-container">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                
                {}
                <div className="poster-wrapper">
                  {movie.Poster && movie.Poster !== "N/A" ? (
                    <img 
                      src={movie.Poster} 
                      alt={movie.Title} 
                      className="movie-poster" 
                      onError={(e) => {
                        
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {}
                  <div 
                    className="custom-placeholder" 
                    style={{ display: (movie.Poster && movie.Poster !== "N/A") ? 'none' : 'flex' }}
                  >
                    <span>🎬 No Poster</span>
                  </div>
                </div>

                {}
                <div className="movie-info">
                  <h2>{movie.Title}</h2>
                  <p>Year: {movie.Year}</p>
                  <button className="purple-btn" onClick={() => addToFavorites(movie)}>
                    + Favorite
                  </button>
                </div>

              </div>
            ))
          ) : (
            <p className="no-results">Film tapılmadı. Yenidən axtarın.</p>
          )}
        </div>

        {}
        <div className="favorites-panel">
          <div className="fav-added-list">
            {favorites.map((fav, index) => (
              <p key={index} className="fav-item-name">• {fav.Title}</p>
            ))}
          </div>

          <div className="fav-box">
            <input 
              type="text" 
              placeholder="Favorites list name" 
              className="fav-input" 
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
            
            {}
            <button 
              className={favorites.length === 0 || !listName.trim() ? "grey-btn" : "purple-btn full-width"} 
              disabled={favorites.length === 0 || !listName.trim()}
              onClick={saveFavoriteList}
              style={{ 
                marginBottom: '12px',
                cursor: (favorites.length === 0 || !listName.trim()) ? 'not-allowed' : 'pointer' 
              }}
            >
              Add To Favorite List
            </button>
            
            {}
            <button 
              className="purple-btn full-width"
              onClick={() => navigate('/list')}
            >
              Look At Favorite List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function ListPage({ savedLists, deleteMovieFromSavedList, deleteWholeList }) {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div className="standalone-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <button className="close-page-btn" onClick={() => navigate('/')}>×</button>
        
        <h1 style={{ textAlign: 'center', color: '#7b007b', marginBottom: '10px' }}>Bütün Sevimli Siyahılarım</h1>

        {savedLists && savedLists.length > 0 ? (
          savedLists.map((list) => (
            <div key={list.id} className="standalone-content-box" style={{ marginBottom: '20px', position: 'relative' }}>
              
              {}
              <button 
                onClick={() => deleteWholeList(list.id)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '16px' }}
                title="Siyahını sil"
              >
                Siyahını Sil 🗑️
              </button>

              <h2 className="standalone-list-title">{list.name}</h2>
              
              <div className="standalone-movies-list">
                {list.movies.length > 0 ? (
                  list.movies.map((movie) => (
                    <div key={movie.imdbID} className="standalone-movie-row">
                      <span className="standalone-movie-title">{movie.Title}</span>
                      <div className="standalone-row-actions">
                        <a 
                          href={`https://www.imdb.com/title/${movie.imdbID}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="imdb-link-btn"
                        >
                          IMDB
                        </a>
                        <button 
                          className="delete-item-btn"
                          onClick={() => deleteMovieFromSavedList(list.id, movie.imdbID)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{textAlign: 'center', padding: '10px', color: '#999'}}>Bu siyahıda film qalmadı.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="standalone-content-box">
            <p style={{textAlign: 'center', padding: '40px', color: '#777', fontSize: '18px'}}>
              Hələ heç bir sevimli film siyahısı yaradılmayıb.
            </p>
          </div>
        )}

        <div className="standalone-footer">
          <button className="movies-redirect-btn" onClick={() => navigate('/')}>Movies</button>
        </div>

      </div>
    </div>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [favorites, setFavorites] = useState([]);
  const [listName, setListName] = useState('');
  
  const [savedLists, setSavedLists] = useState([]); 

  const fetchMovies = async (title) => {
    try {
      const res = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=e42e9906`);
      const data = await res.json();
      if (data.Response === "True" && data.Search) {
        setMovies(data.Search.slice(0, 10));
      } else {
        setMovies([]);
      }
    } catch (error) {
      setMovies([]);
    }
  };

  useEffect(() => {
    const defaultMovieIDs = ['tt0111161', 'tt0468569', 'tt1375666', 'tt0137523', 'tt0109830', 'tt0120737', 'tt0076759', 'tt0944947'];
    const loadInitialMovies = async () => {
      try {
        const requests = defaultMovieIDs.map(id => fetch(`https://www.omdbapi.com/?i=${id}&apikey=e42e9906`).then(res => res.json()));
        const results = await Promise.all(requests);
        const validMovies = results.filter(movie => movie.Response !== "False");
        setMovies(validMovies);
      } catch (error) {}
    };
    loadInitialMovies();
  }, []);

  const addToFavorites = (movie) => {
    if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  const saveFavoriteList = () => {
    if (!listName.trim()) {
      alert("Zəhmət olmasa siyahı adı yazın!");
      return;
    }
    
    const newList = {
      id: Date.now(),
      name: listName,
      movies: favorites
    };

    setSavedLists([...savedLists, newList]); 
    alert(`"${listName}" siyahısı yaradıldı!`);

    setFavorites([]);  
    setListName('');   
  };

  const deleteMovieFromSavedList = (listId, imdbID) => {
    setSavedLists(savedLists.map(list => {
      if (list.id === listId) {
        return { ...list, movies: list.movies.filter(m => m.imdbID !== imdbID) };
      }
      return list;
    }));
  };

  const deleteWholeList = (listId) => {
    setSavedLists(savedLists.filter(list => list.id !== listId));
  };

  return (
    <Routes>
      <Route path="/" element={<MainPage movies={movies} searchQuery={searchQuery} setSearchQuery={setSearchQuery} fetchMovies={fetchMovies} favorites={favorites} addToFavorites={addToFavorites} listName={listName} setListName={setListName} saveFavoriteList={saveFavoriteList} />} />
      <Route path="/list" element={<ListPage savedLists={savedLists} deleteMovieFromSavedList={deleteMovieFromSavedList} deleteWholeList={deleteWholeList} />} />
    </Routes>
  );
}