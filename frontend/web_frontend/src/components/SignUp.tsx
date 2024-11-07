import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Link,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState, FormEvent } from 'react';
import { buildPath } from '../utils/api';

interface SignUpProps {
  onSwitchToLogin: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error on change
    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
      general: undefined,
    }));

    setSuccessMessage(null);
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordMinLength = 8;

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < passwordMinLength) {
      errors.password = `Password must be at least ${passwordMinLength} characters`;
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      const payload = {
        login: formData.username,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      const response = await fetch(buildPath('register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Signup successful:', result);
        setSuccessMessage('Account created successfully. Please log in.');
        setFormData({
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
        });
        setFormErrors({});
      } else {
        setFormErrors((prev) => ({
          ...prev,
          general: result.error || 'Signup failed',
        }));
      }
    } catch (err) {
      console.error('Sign Up error:', err);
      setFormErrors((prev) => ({
        ...prev,
        general: 'An error occurred. Please try again.',
      }));
    }
  };

  return (
    <Box
      p={8}
      maxW="md"
      w="full"
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg='black'
    >
      <form onSubmit={handleSignUp}>
        <Stack spacing={4}>
          <Heading as="h2" size="lg" textAlign="center">
            Sign Up
          </Heading>

          <FormControl isInvalid={!!formErrors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              focusBorderColor="gold"
            />
            {formErrors.username && (
              <FormErrorMessage>{formErrors.username}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!formErrors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              focusBorderColor="gold"
            />
            {formErrors.email && (
              <FormErrorMessage>{formErrors.email}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!formErrors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              focusBorderColor="gold"
            />
            {formErrors.password && (
              <FormErrorMessage>{formErrors.password}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!formErrors.firstName}>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <Input
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              focusBorderColor="gold"
            />
            {formErrors.firstName && (
              <FormErrorMessage>{formErrors.firstName}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!formErrors.lastName}>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              focusBorderColor="gold"
            />
            {formErrors.lastName && (
              <FormErrorMessage>{formErrors.lastName}</FormErrorMessage>
            )}
          </FormControl>

          {formErrors.general && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {formErrors.general}
            </Text>
          )}

          {successMessage && (
            <Text color="green.500" fontSize="sm" textAlign="center">
              {successMessage}
            </Text>
          )}

          <Button type="submit" w="full">
            Sign Up
          </Button>

          <Text textAlign="center">
            Already have an account?{' '}
            <Link color="gold" onClick={onSwitchToLogin}>
              Log in
            </Link>
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default SignUp;
