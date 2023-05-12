import Navbar from '@/components/Navbar'
import Prueba from '@/components/Prueba'

import { DataProvider } from '../context/DataContext'

export default function Layout({ children }) {
  return (
    <>
    <DataProvider>

    

      <Navbar />

      {children}
      </DataProvider>
    </>
    
  )
}
