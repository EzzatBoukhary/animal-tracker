//import React { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import { Box, useDisclosure, Flex, useBreakpointValue } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PostModal from '../components/PostModal';
import Filters from '../components/Filters';
import { buildPath } from '../utils/api';

type Post = {
    _id: string;
    location: { latitude: number; longitude: number };
    photo: string;
    description: string;
    animal: string;
    postedDate: string;
    userName: string; // optional, for displaying the post creator
};

const Map: React.FC = () => {

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

    const ucfCoordinates = { lat: 28.6024, lng: -81.2001 };

    const customMarker = new L.Icon({
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
        iconSize: [24, 36],
        iconAnchor: [12, 36],
    });

  return (

  <Flex p={4} minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Box
        w={{ base: 'full', md: '350px' }}
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

      <Box 
            bg="black"
            width="200vh" 
            height="80vh" 
            //position="fixed"
            //top="81"
            //left="200"
            position="relative"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            padding="20px"
            boxShadow="lg"
        >
            <MapContainer center={ucfCoordinates} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {posts.map(post => (
                    <Marker
                        key={post._id}
                        position={[post.location.latitude, post.location.longitude]}
                        icon={customMarker}
                        eventHandlers={{ click: () => openModal(post) }}
                        >
                        
                    </Marker>
                ))}
            </MapContainer>
        </Box>

      {selectedPost && <PostModal isOpen={isOpen} onClose={closeModal} post={selectedPost} showMap={false} />}
    </Flex>
  );
};

export default Map;