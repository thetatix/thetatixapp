import Navbar from '@/components/Navbar'
import DynamicModal from '@/components/DynamicModal'
import { DataProvider } from '@/context/DataContext'

export default function Layout({ children }) {
  return (
    <>
    <DataProvider>
      <DynamicModal active={true} status="loading" message="Successfully created event." closeable={true} />
      <Navbar />
      {children}
      </DataProvider>
    </>
    
  )
}
