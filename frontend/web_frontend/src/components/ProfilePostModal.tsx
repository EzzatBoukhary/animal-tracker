import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  Text,
  VStack,
  Box,
  Flex,
  Button,
  useToast,
} from '@chakra-ui/react';
import MapView from './MapView';
import { Post } from '../types';
import { formatPostedDate } from '../utils/dateUtils';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  showMap?: boolean; // shows/hides the map location
  onDelete: (postId: string) => Promise<void>; // Callback to handle post deletion
}

const ProfilePostModal: React.FC<PostModalProps> = ({ isOpen, onClose, post, showMap = true, onDelete }) => {
  const toast = useToast();

  // Handle the delete action when the delete button is clicked
  const handleDelete = async () => {
    try {
      // Call onDelete with the post's ID
      await onDelete(post._id); // Ensure you use the correct ID field here
      toast({
        title: 'Post deleted.',
        description: 'The post has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      toast({
        title: 'Error deleting post.',
        description: 'An error occurred while trying to delete the post. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
              <Image
                src={post.photo}
                alt={post.description}
                objectFit="contain"
                maxHeight="400px"
                borderRadius="lg"
              />
              <Text fontWeight="bold">
                <Text as="span" color="yellow.400" textDecoration="underline">
                  Animal Name:
                </Text>{' '}
                {post.animal}
              </Text>
              <Text fontWeight="bold">
                <Text as="span" color="yellow.400" textDecoration="underline">
                  Spotted:
                </Text>{' '}
                {formatPostedDate(post.postedDate)} by {post.username}
              </Text>
            </VStack>
            <VStack flex="1" align="stretch" spacing={4} w="100%">
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="yellow.400"
                textDecoration="underline"
                textAlign="center"
              >
                Description:
              </Text>
              <Box
                maxHeight={showMap ? '100px' : '200px'}
                overflowY="auto"
                p={2}
              >
                <Text>{post.description}</Text>
              </Box>
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
        <ModalFooter>
          <Button colorScheme="red" onClick={handleDelete}>
            Delete Post
          </Button>
          <Button ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfilePostModal;
