import React, { useEffect, useState } from 'react';

type Post = {
    _id: string;
    location: { latitude: number; longitude: number };
    photo: string;
    description: string;
    animal: string;
    postedDate: string;
};

const Profile: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Controlled search input
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/getUserPosts/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch user posts');

                const data = await response.json();
                console.log("Fetched posts data:", data);
                setPosts(data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, [userId]);

    const openPopup = (post: Post) => {
        setSelectedPost(post);
    };

    const closePopup = () => {
        setSelectedPost(null);
    };

    useEffect(() => {
        // Filter posts whenever searchQuery changes
        setFilteredPosts(
            posts.filter(post => post.animal.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, posts]);

    return (
        <div>
            <h1>{firstName}'s Profile</h1>

            <input
                type="text"
                placeholder="Search by animal type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            />

            <div className="grid">
                {filteredPosts.map(post => (
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

export default Profile;