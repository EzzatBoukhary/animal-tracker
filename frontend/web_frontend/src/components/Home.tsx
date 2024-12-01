import React, { useEffect, useState } from 'react';
import { Box, Grid, Image, Text, useDisclosure, Flex, useBreakpointValue } from '@chakra-ui/react';
import { Post } from '../types';
import PostModal from '../components/PostModal';
import Filters from '../components/Filters';
import { formatPostedDate } from '../utils/dateUtils';
import { buildPath } from '../utils/api';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isSticky = useBreakpointValue({ base: false, md: true });

  const animalFilters = ['Cat', 'Deer', 'Raccoon', 'Squirrel', 'Bird', 'Reptile', 'Fish', 'Bug', 'Other'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = buildPath('getPosts');
        if (selectedAnimals.length > 0) {
          const animal = selectedAnimals[0];
          url = buildPath(`searchPosts?animal=${animal}`);
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [selectedAnimals]);

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

  return (
    <Flex p={4} minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Box
        w={{ base: 'full', md: '200px' }}
        mr={{ base: 0, md: 4 }}
        mb={{ base: 4, md: 0 }}
        position={isSticky ? 'sticky' : 'static'}
        top={isSticky ? '86px' : undefined}
        alignSelf="start"
      >
        <Filters
          animals={animalFilters}
          selectedAnimals={selectedAnimals}
          onSelect={handleSelectFilter}
          onClear={handleClearFilters}
        />
      </Box>

      <Box flex="1">
        {posts.length === 0 ? (
          <Text>No posts found for the selected filters.</Text>
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
                    {formatPostedDate(post.postedDate)} By {post.username || 'Unknown'}
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Box>

      {selectedPost && <PostModal isOpen={isOpen} onClose={closeModal} post={selectedPost} showMap={true} />}
    </Flex>
  );
};

export default Home;
