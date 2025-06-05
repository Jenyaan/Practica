// Comments.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PREFIX } from '../../../api/API';
import CommentData, { type PropsCommentData } from './BookComment';


interface CommentsProps {
  bookId: number;
}

const Comments: React.FC<CommentsProps> = ({ bookId }) => {
  const [comments, setComments] = useState<PropsCommentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${PREFIX}/api/v1/books/${bookId}/comments`);
        setComments(response.data.data);
      } catch (error) {
        console.error('Помилка при завантаженні коментарів:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [bookId]);

  if (loading) return <p>Завантаження коментарів...</p>;
  if (comments.length === 0) return <p>Коментарі відсутні.</p>;

  return ( 
    <div>
      {comments.map(comment => (
        <CommentData  key={comment.id} data={comment} />
      ))}
    </div>
  );
};

export default Comments;
