import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Image,
    Text,
    Flex,
    useDisclosure,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Post } from '../types'; // Define or import the Post type
import ProfilePostModal from '../components/ProfilePostModal'; // Modal component for detailed post view
import Filters from '../components/Filters'; // Component for animal filters
import { formatPostedDate } from '../utils/dateUtils'; // Utility for formatting dates
import { buildPath } from '../utils/api'; // Utility for API paths

const Profile: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isSticky = useBreakpointValue({ base: false, md: true });

    // Extract user data from localStorage
    const _ud = localStorage.getItem('user_data');
    const ud = JSON.parse(_ud || '{}');
    const userId = ud.id;
    const firstName = ud.firstName || 'User';

    const animalFilters = ['Squirrel', 'Cat', 'Bird', 'Rabbit', 'Dog', 'Alligator', 'Deer'];

    // Fetch user posts
    /*useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch(buildPath(`getUserPosts/${userId}`));
                if (!response.ok) throw new Error('Failed to fetch user posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, [userId]);

    // Update filtered posts based on selected filters
    useEffect(() => {
        if (selectedAnimals.length > 0) {
            setFilteredPosts(posts.filter(post => selectedAnimals.includes(post.animal)));
        } else {
            setFilteredPosts(posts); // Show all posts if no filters are selected
        }
    }, [selectedAnimals, posts]);*/

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

    const openModal = (post: Post) => {
        setSelectedPost(post);
        onOpen();
    };

    const closeModal = () => {
        setSelectedPost(null);
        onClose();
    };

    const handleSelectFilter = (animal: string) => {
        setSelectedAnimals([animal]);
    };

    const handleClearFilters = () => {
        setSelectedAnimals([]);
    };

    const deletePost = async (postId: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/deletePost/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            // Update state to remove the deleted post
            setPosts(posts.filter((post) => post._id !== postId));

            console.log('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error; // Rethrow the error for the `PostModal` to handle
        }
    };

    return (
            <Flex direction={{ base: 'column', md: 'row' }} p={4} minH="100vh">
                {/* Filters Section */}
                {/*<Box
                    w={{ base: '100%', md: '250px' }}
                    p={4}
                    
                >
                    <Filters
                        animals={animalFilters}
                        selectedAnimals={selectedAnimals}
                        onSelect={handleSelectFilter}
                        onClear={handleClearFilters}
                    />
                </Box>*/}

                <Box>
                {/* Posts Section */}
    
                    {setPosts.length === 0 ? (
                        <Text>No posts found for the selected filters.</Text>
                    ) : (
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                            {filteredPosts.map(post => (
                                <Box
                                    key={post._id}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    cursor="pointer"
                                    onClick={() => openModal(post)}
                                    _hover={{ boxShadow: 'lg' }}
                                >
                                    <Image
                                        src={post.photo}
                                        alt={post.description}
                                        boxSize="100%"
                                        objectFit="cover"
                                    />
                                    <Box p={4}>
                                        <Text fontWeight="bold">{post.animal}</Text>
                                        <Text>{formatPostedDate(post.postedDate)}</Text>
                                    </Box>
                                </Box>
                            ))}
                        </Grid>
                    )}
                </Box>

                <Box flex="1">
        {posts.length === 0 ? (
          <Text>No posts found.</Text>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            {posts.map((post) => (
              <Box
                key={post._id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                cursor="pointer"
                onClick={() => openModal(post)}
                _hover={{ boxShadow: 'lg' }}
              >
                <Box
                  position="relative"
                  p={2}
                  mx="auto"
                  mt={4}
                  w={{ base: '100%', md: '369px' }}
                  h={{ base: 'auto', md: '312px' }}
                  overflow="hidden"
                >
                  <Image
                    src={post.photo}
                    alt={post.description}
                    boxSize="100%"
                    objectFit="cover"
                    borderRadius="65px"
                    loading="lazy"
                  />
                </Box>
                <Box p={4} textAlign="center">
                  <Text fontSize="lg" color="white">
                    <Text as="span" textDecoration="underline">
                      Spotted:
                    </Text>{' '}
                    {formatPostedDate(post.postedDate)} 
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Box>
    
                {/* Post Modal */}
                {selectedPost && (
                    <ProfilePostModal
                        isOpen={isOpen}
                        onClose={closeModal}
                        post={selectedPost}
                        showMap={true}
                        onDelete={deletePost}
                    />
                )}
            </Flex>
        );
    };
    
    export default Profile;
