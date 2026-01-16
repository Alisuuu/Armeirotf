import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import PostList from './components/PostList';
import { Post } from './components/PostCard';
import PostForm from './components/PostForm';

// Inicializa o Firebase
initializeApp(firebaseConfig);

// TODO: Substituir pela URL do seu backend quando for para produção
const API_BASE_URL = 'http://localhost:8080';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const appStyle: React.CSSProperties = {
    backgroundColor: '#18181b',
    color: 'white',
    padding: '20px',
    height: '100vh',
    overflowY: 'auto'
  };

  const searchInputStyle: React.CSSProperties = {
    width: 'calc(100% - 22px)',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #555',
    backgroundColor: '#2d2d2d',
    color: 'white'
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) throw new Error('Falha ao buscar posts.');
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, { method: 'POST' });
      if (!response.ok) throw new Error('Falha ao curtir.');
      // Atualiza o estado local para refletir a curtida imediatamente
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const handleCreatePost = async (formData: { weaponName: string; imageUrl: string }) => {
    try {
      // TODO: O username deve vir do usuário autenticado pela Twitch/Firebase
      const username = 'usuarioteste'; 
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, username }),
      });
      if (!response.ok) throw new Error('Falha ao criar post.');
      const newPost = await response.json();
      setPosts([newPost, ...posts]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      fetchPosts(); // Se a busca for vazia, carrega todos os posts
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/search?term=${searchTerm}`);
      if (!response.ok) throw new Error('Falha ao buscar.');
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  return (
    <div style={appStyle}>
      <h1>Ranking de Classes</h1>
      <PostForm onSubmit={handleCreatePost} />
      
      <form onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Buscar por arma ou usuário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </form>

      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      
      <PostList posts={posts} onLike={handleLike} />
    </div>
  );
}

export default App;