import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  Text,
  VStack,
  Box,
  Flex,
} from '@chakra-ui/react';
import MapView from './MapView';
import { Post } from '../types';
import { formatPostedDate } from '../utils/dateUtils';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  showMap?: boolean; // shows/hides the map location
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, post, showMap = true }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent
        bg="gray.900"
        color="white"
        border="2px solid gray"
        boxShadow="lg"
        borderRadius="lg"
      >
        <ModalHeader>Post Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex mb={4} direction={{ base: 'column', md: 'row' }} gap={4} align="stretch">
            <VStack flex="1" align="stretch" spacing={4} borderRadius="md">

              {/* Post Image */}
              <Image
                src={post.photo}
                alt={post.description}
                objectFit="contain"
                maxHeight="400px"
                borderRadius="lg"
              />

              {/* Animal name */}
              <Text fontWeight="bold">
                <Text as="span" color="yellow.400" textDecoration="underline">
                  Animal Name:
                </Text>{' '}
                {post.animal}
              </Text>

              {/* Spotted (time) ago */}
              <Text fontWeight="bold">
                <Text as="span" color="yellow.400" textDecoration="underline">
                  Spotted:
                </Text>{' '}
                {formatPostedDate(post.postedDate)} by {post.username}
              </Text>
            </VStack>

            {/* Second Column */}
            <VStack flex="1" align="stretch" spacing={4} w="100%">

              {/* Description header */}
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="yellow.400"
                textDecoration="underline"
                textAlign="center"
              >
                Description:
              </Text>

              {/* Description text box */}
              <Box
                maxHeight={showMap ? '100px' : '200px'} // Adjust height based if map is shown or not
                overflowY="auto"
                p={2}
              >
                <Text>{post.description}</Text>
              </Box>

              {/* Map header and map view */}
              {showMap && (
                <>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="yellow.400"
                    textDecoration="underline"
                    textAlign="center"
                  >
                    Map Location:
                  </Text>
                  <Box flex="1" minHeight="250px" border="2px solid gray" borderRadius="lg" overflow="hidden">
                    <MapView location={post.location} />
                  </Box>
                </>
              )}
            </VStack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
