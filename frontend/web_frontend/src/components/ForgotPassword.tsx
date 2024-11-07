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

interface ForgotPasswordProps {
  onSwitchToLogin: () => void;
}

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
  general?: string;
}
interface ForgotPasswordProps {
  onSwitchToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleForgotPassword = async (event: FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setFormErrors({});
    setSuccessMessage(null);

    try {
      const payload = {
        email: formData.email,
      };

      const response = await fetch(buildPath('forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Forgot Password successful:', result);
        setSuccessMessage('Password reset link sent to your email.');
        setFormData({ email: '' });
      } else {
        setFormErrors((prev) => ({
          ...prev,
          general: result.error || 'Failed to send reset link',
        }));
      }
    } catch (err) {
      console.error('Forgot Password error:', err);
      setFormErrors((prev) => ({
        ...prev,
        general: 'An error occurred. Please try again.',
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
      <form onSubmit={handleForgotPassword}>
        <Stack spacing={4}>
          <Heading as="h2" size="lg" textAlign="center">
            Forgot Password
          </Heading>
          <Text fontSize="sm" textAlign="center" color="gray.500">
            Enter your email to receive password reset instructions.
          </Text>

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
            loadingText="Sending..."
          >
            Send Reset Link
          </Button>

          <Link onClick={onSwitchToLogin} textAlign="center">
            Back to Login
          </Link>
        </Stack>
      </form>
    </Box>
  );
};

export default ForgotPassword;
