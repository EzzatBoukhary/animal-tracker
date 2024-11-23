import React from 'react'
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from '@chakra-ui/react'
import {
    FiHome,
    FiMenu,
    FiChevronDown,
    FiLogOut,
    FiMap,
    FiFilePlus,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { FaCircleUser } from 'react-icons/fa6'

interface LinkItemProps {
    name: string
    icon: IconType
    href: string
  }
  
  interface NavItemProps extends FlexProps {
    icon: IconType
    children: React.ReactNode
    href?: string
    active?: boolean
  }
  

interface MobileProps extends FlexProps {
    onOpen: () => void
    title: string
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

// Sidebar bar items
const LinkItems: Array<LinkItemProps> = [
    { name: 'Posts', icon: FiHome, href: '/home' },
    { name: 'New Post', icon: FiFilePlus, href: '/post' },
    { name: 'Map', icon: FiMap, href: '/map' },
    { name: 'Log out', icon: FiLogOut, href: '/auth' },
  ]
  

// Sidebar content component
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const location = useLocation()
    return (
        <Box
            bg='brightGold'
            w={{ base: 'full', md: 40 }}
            pos="fixed"
            h="full"
            {...rest}>
            <CloseButton color='black' display={{ base: 'flex', md: 'none' }} onClick={onClose} />

            {LinkItems.map((link) => (
                <NavItem
                key={link.name}
                icon={link.icon}
                href={link.href}
                active={location.pathname === link.href}>
                {link.name}
              </NavItem>
            ))}
        </Box>
    )
}

// Navigation item component
const NavItem = ({ icon, children, href, active, ...rest }: NavItemProps) => {
    return (
      <Box
        as="a"
        href={href || '#'}
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}>
        <Flex
          direction="column" 
          align="center"
          p="4"
          mx="0"
          my="2"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={active ? 'brand.600' : 'transparent'}
          color='black'
          _hover={{
            bg: 'brand.500',
          }}
          {...rest}>
          {icon && (
            <Icon
              mb="2"
              fontSize="24"
              as={icon}
            />
          )}
          <Text fontFamily='Kreon' fontWeight='bold' fontSize="lg">{children}</Text>
        </Flex>
        {/* Black Divider */}
        <Box height="1px" bg="black" mx="0" />
      </Box>
    )
  }
  

// Mobile navigation (header) component
const MobileNav = ({ onOpen, title, ...rest }: MobileProps) => {
    return (
        <Flex
            position="fixed"
            top="0"
            left={{ base: '0', md: '0' }}
            right="0"
            height="20"
            alignItems="center"
            bg='brightGold'
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            px={{ base: 4, md: 4 }}
            zIndex="1000" // stays above other elements
            {...rest}>

            {/* Menu button for mobile view */}
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="ghost"
                margin={2}
                aria-label="open menu"
                color='black'
                icon={<FiMenu />}
            />

            {/* Page Title */}
            <Text
                display="flex"
                fontSize="3xl"
                fontFamily="Kreon"
                fontWeight="bold"
                color='black'
                textAlign={{ base: 'center', md: 'left' }}
                pl={{md: '20'}}
                flex="1">
                {title}
            </Text>


            {/* Right side icons */}
            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                            <HStack color='black'>
                                <FaCircleUser size={40}/>
                                {/* <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="md">Ezzat Boukhary</Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box> */}
                            </HStack>
                        </MenuButton>
                        <MenuList
                            borderColor='gray.700'>
                            <MenuItem>Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    )
}

interface SidebarWithHeaderProps {
    children: ReactNode
    title: string
}

// Main component
const SidebarWithHeader: React.FC<SidebarWithHeaderProps> = ({ children, title }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'black')}>
            
            {/* Sidebar */}
            <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />

            {/* Drawer for mobile view */}
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>

            {/* Header */}
            <MobileNav onOpen={onOpen} title={title} />

            {/* Main content area */}
            <Box
                ml={{ base: '0', md: '40' }} // Sidebar width away
                mt='20'
                p="4">
                {children}
            </Box>
        </Box>
    )
}

export default SidebarWithHeader
