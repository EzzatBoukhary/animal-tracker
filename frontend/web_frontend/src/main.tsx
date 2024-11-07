import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import myRouter from './routes';
import { ChakraProvider } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom';
import customTheme2 from './theme';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {localStorage.setItem('chakra-ui-color-mode', 'dark')}
    <ChakraProvider theme={customTheme2}>
      <RouterProvider router={myRouter}/>      
    </ChakraProvider>
  </StrictMode>,
)