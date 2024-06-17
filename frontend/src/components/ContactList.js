import React, { useEffect, useState } from 'react';
import '../components/TripStyles.css';

function ContactListForm() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostLikes, setSelectedPostLikes] = useState(0);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false); // 추가: 좋아요 로딩 상태
  const [liked, setLiked] = useState(false); // 추가: 좋아요 상태

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setPosts(result);
      } else {
        setError(result.error || 'Error fetching posts');
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchPostDetails = async (postId) => {
    const token = localStorage.getItem('token');
    setIsLoadingLikes(true); // 좋아요 로딩 시작
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSelectedPost(result);
        fetchLikes(postId); // Fetch likes when fetching post details
        fetchLikeStatus(postId); // Fetch like status when fetching post details
      } else {
        setError(result.error || 'Error fetching post details');
        setIsLoadingLikes(false); // 좋아요 로딩 종료
      }
    } catch (error) {
      setError(error.message);
      setIsLoadingLikes(false); // 좋아요 로딩 종료
    }
  };

  const fetchLikes = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSelectedPostLikes(result.likes);
      } else {
        setError(result.error || 'Error fetching likes');
      }
      setIsLoadingLikes(false); // 좋아요 로딩 종료
    } catch (error) {
      setError(error.message);
      setIsLoadingLikes(false); // 좋아요 로딩 종료
    }
  };

  const fetchLikeStatus = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/posts/${postId}/like-status`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setLiked(result.liked);
      } else {
        setError(result.error || 'Error fetching like status');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchLikes(postId);
        fetchLikeStatus(postId); // 업데이트 후 좋아요 상태 새로 고침
      } else {
        const result = await response.json();
        setError(result.error || 'Error liking/unliking post');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(null);
          setSelectedPostLikes(0);
        }
      } else {
        const result = await response.json();
        setError(result.error || 'Error deleting post');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = async (postId) => {
    const title = prompt('새 제목을 입력하세요:');
    const content = prompt('새 내용을 입력하세요:');

    if (title && content) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
          fetchPosts();
          if (selectedPost && selectedPost.id === postId) {
            fetchPostDetails(postId);
          }
        } else {
          const result = await response.json();
          setError(result.error || 'Error updating post');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="trip">
      <h1>게시글 목록</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="tripcard-container">
        {posts.map((post) => (
          <div key={post.id} className="tripcard">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => fetchPostDetails(post.id)}>상세 보기</button>
            <button onClick={() => handleEdit(post.id)}>수정</button>
            <button onClick={() => handleDelete(post.id)}>삭제</button>
          </div>
        ))}
      </div>
      {selectedPost && (
        <div className="post-details">
          <h2>게시글 상세 내용</h2>
          <h3>{selectedPost.title}</h3>
          <p>{selectedPost.content}</p>
          <button onClick={() => handleLike(selectedPost.id)}>
            <img
              id="like-icon"
              src={liked
                ? 'https://cdn-icons-png.flaticon.com/512/833/833472.png'
                : 'https://cdn-icons-png.flaticon.com/512/833/833300.png'}
              alt="like icon"
              style={{ width: '24px', height: '24px' }}
            />
          </button>
          <p>Likes: {isLoadingLikes ? 'Loading...' : selectedPostLikes}</p>
        </div>
      )}
    </div>
  );
}

export default ContactListForm;
