import React, { useEffect, useState } from 'react';

type Post = {
    username: string;
    location: { latitude: number; longitude: number };
    photo: string;
    description: string;
    animal: string;
    postedDate: string;
};

const HomeListView: React.FC = () => {
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

    const searchPosts = async (animal: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/searchPosts?animal=${animal}`);
            const data = await response.json();
            setPosts(data); // Update your posts state with the filtered posts
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    };

    function viewGrid(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/home';
    };

    return (
        <div className="home-page">
            <input
                type="text"
                placeholder="Search by animal type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => searchPosts(searchQuery)}>Search</button>
            <button type="button" id="gridView" className="buttons"
                onClick={viewGrid}> Switch to grid </button>


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

export default HomeListView;