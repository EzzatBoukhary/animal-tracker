import React from 'react';
import { VStack, Radio, RadioGroup, Text, Button } from '@chakra-ui/react';

interface FiltersProps {
  animals: string[];
  selectedAnimals: string[];
  onSelect: (animal: string) => void;
  onClear: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  animals,
  selectedAnimals,
  onSelect,
  onClear,
}) => {
  const handleRadioChange = (animal: string) => {
    onSelect(animal);
  };

  return (
    <VStack align="stretch" spacing={3} p={4} bg="gray.700" borderRadius="md">
      <Text fontSize="lg" fontWeight="bold" mb={2} color="gray.100">
        Filters
      </Text>
      <RadioGroup
        value={selectedAnimals[0] || ''}
        onChange={handleRadioChange}
      >
        <VStack align="stretch" spacing={2}>
          {animals.map((animal) => (
            <Radio key={animal} value={animal} colorScheme="brand">
              {animal}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
      {selectedAnimals.length > 0 && (
        <Button variant="ghost" colorScheme="red" onClick={onClear}>
          Clear Filters
        </Button>
      )}
    </VStack>
  );
};

export default Filters;
