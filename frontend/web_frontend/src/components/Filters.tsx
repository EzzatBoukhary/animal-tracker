import React from 'react'
import { VStack, Checkbox, Text, Button } from '@chakra-ui/react'

interface FiltersProps {
  animals: string[]
  selectedAnimals: string[]
  onSelect: (animal: string) => void
  onDeselect: (animal: string) => void
  onClear: () => void
}

const Filters: React.FC<FiltersProps> = ({
  animals,
  selectedAnimals,
  onSelect,
  onDeselect,
  onClear,
}) => {
  const handleCheckboxChange = (animal: string, isChecked: boolean) => {
    if (isChecked) {
      onSelect(animal)
    } else {
      onDeselect(animal)
    }
  }

  return (
    <VStack align="stretch" spacing={3} p={4} bg='gray.700' borderRadius="md">
      <Text fontSize="lg" fontWeight="bold" mb={2} color='gray.100'>
        Filters
      </Text>
      {animals.map((animal) => (
        <Checkbox
          key={animal}
          isChecked={selectedAnimals.includes(animal)}
          onChange={(e) => handleCheckboxChange(animal, e.target.checked)}
          colorScheme="brand"
        >
          {animal}
        </Checkbox>
      ))}
      {selectedAnimals.length > 0 && (
        <Button variant="ghost" colorScheme="red" onClick={onClear}>
          Clear Filters
        </Button>
      )}
    </VStack>
  )
}

export default Filters
