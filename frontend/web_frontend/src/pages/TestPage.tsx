import React, { useEffect } from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  // Check if user data is stored in localStorage
  const userData = JSON.parse(localStorage.getItem('user_data') || 'null');

  useEffect(() => {
    // If no user data, redirect to the auth page
    if (!userData) {
      navigate('/auth', { replace: true });
    }
  }, [navigate, userData]);

  const handleLogout = () => {
    // Clear user data and navigate to the auth page
    localStorage.removeItem('user_data');
    navigate('/auth', { replace: true });
  };

  return (
    <Box
      p={8}
      maxW="lg"
      mx="auto"
      mt={10}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg='black'
      color='white'
      textAlign="center"
    >
      <Heading as="h2" size="xl" mb={4}>
        Test Page
      </Heading>
      {userData ? (
        <>
          <Text fontSize="lg" mb={6}>
            Welcome, {userData.firstName} {userData.lastName}!
          </Text>
          <Button onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <Text fontSize="lg" mb={6}>
          Redirecting to Auth Page...
        </Text>
      )}
    </Box>
  );
};

export default TestPage;
