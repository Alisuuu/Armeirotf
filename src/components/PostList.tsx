import React from 'react';
import PostCard, { Post } from './PostCard';

interface PostListProps {
  posts: Post[];
  onLike: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onLike }) => {
  if (posts.length === 0) {
    return <p>Nenhuma classe de arma encontrada.</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={onLike} />
      ))}
    </div>
  );
};

export default PostList;