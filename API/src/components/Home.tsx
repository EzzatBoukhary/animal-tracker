import React, { useEffect, useState } from 'react';

type Post = {
    username: string;
    location: { latitude: number; longitude: number };
    photo: string;
    description: string;
    animal: string;
    postedDate: string;
};

/* THIS CODE IMPLEMENTS LIST VIEW */

/*const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); // For search input


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getPosts'); // Ensure this URL is correct
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }

                const text = await response.text(); // Get raw response as text
                console.log("Raw response:", text); // Log the response for inspection

                const data = JSON.parse(text); // Now try to parse the text as JSON
                console.log("Fetched posts:", data);
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    function newPost(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/post';
    };
    function viewProfile(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/profile';
    };

    const searchPosts = async (animal: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/searchPosts?animal=${animal}`);
            const data = await response.json();
            setPosts(data); // Update your posts state with the filtered posts
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    };

    return (
        <div className="home-page">
            <button type="button" id="newPostButton" className="buttons"
                onClick={newPost}> Post </button>
            <button type="button" id="newPostButton" className="buttons"
                onClick={viewProfile}> Profile </button>

            <input
                type="text"
                placeholder="Search by animal type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => searchPosts(searchQuery)}>Search</button>


            {posts.map((post, index) => (
                <div key={index} className="post">
                    <div className="post-header">
                        <h3>{post.username}</h3>
                        <p>{new Date(post.postedDate).toLocaleString()}</p>
                    </div>
                    <img src={post.photo} alt="Uploaded" className="post-image" />
                    <div className="post-info">
                        <p><strong>Location:</strong> Lat {post.location.latitude}, Lng {post.location.longitude}</p>
                        <p><strong>Animal:</strong> {post.animal}</p>
                        <p><strong>Description:</strong> {post.description}</p>
                    </div>
                </div>
            ))}
            
        </div>
    );
};

export default Home;*/

/* THIS CODE IMPLEMENTS GRID VIEW */

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); 
    const [selectedPost, setSelectedPost] = useState<Post | null>(null); 

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/getPosts`);
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const openPopup = (post: Post) => {
        setSelectedPost(post);
    };

    const closePopup = () => {
        setSelectedPost(null);
    };

    function newPost(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/post';
    };
    function viewProfile(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/profile';
    };

    const searchPosts = async (animal: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/searchPosts?animal=${animal}`);
            const data = await response.json();
            setPosts(data); // Update your posts state with the filtered posts
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    };

    return (
        <div>

            <button type="button" id="newPostButton" className="buttons"
                onClick={newPost}> Post </button>
            <button type="button" id="newPostButton" className="buttons"
                onClick={viewProfile}> Profile </button>

            <input
                type="text"
                placeholder="Search by animal type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => searchPosts(searchQuery)}>Search</button>
            <h1>Photo Feed</h1>
            <div className="grid">
                {posts.map(post => (
                    <div key={post._id} className="grid-item" onClick={() => openPopup(post)}>
                        <img src={post.photo} alt={post.description} className="photo" />
                    </div>
                ))}
            </div>

            {selectedPost && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closePopup}>X</button>
                        <img src={selectedPost.photo} alt={selectedPost.description} className="popup-photo" />
                        <div className="popup-details">
                            <p><strong>Location:</strong> Lat {selectedPost.location.latitude}, Lng {selectedPost.location.longitude}</p>
                            <p><strong>Caption:</strong> {selectedPost.description}</p>
                            <p><strong>Animal Type:</strong> {selectedPost.animal}</p>
                            <p><strong>Date:</strong> {new Date(selectedPost.postedDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;

