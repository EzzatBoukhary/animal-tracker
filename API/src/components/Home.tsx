import React, { useEffect, useState } from 'react';

type Post = {
    username: string;
    location: { latitude: number; longitude: number };
    photo: string;
    description: string;
    animal: string;
    postedDate: string;
};

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

    const searchPosts = async (animal: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/searchPosts?animal=${animal}`);
            const data = await response.json();
            setPosts(data); // Update your posts state with the filtered posts
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    };

    function viewList(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/list';
    };

    return (
        <div>

            <input
                type="text"
                placeholder="Search by animal type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => searchPosts(searchQuery)}>Search</button>
            <button type="button" id="gridView" className="buttons"
                onClick={viewList}> Switch to list </button>

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

