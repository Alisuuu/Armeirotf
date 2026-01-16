import React from 'react';

// Define a interface para os dados de um post
export interface Post {
  id: string;
  weaponName: string;
  username: string;
  imageUrl: string;
  likes: number;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#2d2d2d',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    marginBottom: '12px',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#9147ff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={cardStyle}>
      <img src={post.imageUrl} alt={`Classe da ${post.weaponName}`} style={imageStyle} />
      <h3>{post.weaponName}</h3>
      <p>por: {post.username}</p>
      <p>Curtidas: {post.likes}</p>
      <button onClick={() => onLike(post.id)} style={buttonStyle}>
        Curtir
      </button>
    </div>
  );
};

export default PostCard;