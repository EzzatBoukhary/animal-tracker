import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Link,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useState, FormEvent } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { buildPath } from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignUp, onSwitchToForgotPassword }) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setFormErrors({});
    setSuccessMessage(null);

    try {
      const payload = {
        login: formData.username,
        password: formData.password,
      };

      const response = await fetch(buildPath('login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      const error = result.error as String
      if (response.ok && !error) {
        console.log('Login successful:', result);
        setSuccessMessage('Login successful! Redirecting...');
        setSuccessMessage(result.error)
        const user = { firstName: result.firstName, lastName: result.lastName, id: result.id };
        localStorage.setItem('user_data', JSON.stringify(user));
        navigate('/home', { replace: true });
      } else {
        setFormErrors((prev) => ({
          ...prev,
          general: result.error || 'Login failed',
        }));
      }
    } catch (err) {
      console.error('Login error:', err);
      setFormErrors((prev) => ({
        ...prev,
        general: 'An error occurred. Please try again.'+err,
      }));
    } finally {
      setIsSubmitting(false);
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
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <Heading as="h2" size="lg" textAlign="center">
            Login
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

          <FormControl isInvalid={!!formErrors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                focusBorderColor="gold"
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </InputRightElement>
            </InputGroup>
            {formErrors.password && (
              <FormErrorMessage>{formErrors.password}</FormErrorMessage>
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

          <Button
            type="submit"
            w="full"
            isLoading={isSubmitting}
            loadingText="Logging in"
          >
            Login
          </Button>

          <Flex justify="space-between">
            <Link onClick={onSwitchToForgotPassword}>
              Forgot Password?
            </Link>
            <Link onClick={onSwitchToSignUp}>
              No account? Sign Up
            </Link>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};

export default Login;
