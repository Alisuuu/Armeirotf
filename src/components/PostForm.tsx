import React, { useState } from 'react';

interface PostFormProps {
  onSubmit: (formData: { weaponName: string; imageUrl: string }) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
  const [weaponName, setWeaponName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Adicionar validação de dados
    onSubmit({ weaponName, imageUrl });
    setWeaponName('');
    setImageUrl('');
  };
  
  const formStyle: React.CSSProperties = {
    marginBottom: '24px',
    padding: '16px',
    border: '1px solid #444',
    borderRadius: '8px',
    backgroundColor: '#2d2d2d',
  };

  const inputStyle: React.CSSProperties = {
    width: 'calc(100% - 20px)',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #555',
    backgroundColor: '#18181b',
    color: 'white'
  };
  
  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#9147ff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  };


  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Nova Classe de Arma</h3>
      <input
        type="text"
        placeholder="Nome da Arma"
        value={weaponName}
        onChange={(e) => setWeaponName(e.target.value)}
        style={inputStyle}
        required
      />
      <input
        type="text"
        placeholder="URL da Imagem da Classe"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={inputStyle}
        required
      />
      <button type="submit" style={buttonStyle}>Publicar</button>
    </form>
  );
};

export default PostForm;
