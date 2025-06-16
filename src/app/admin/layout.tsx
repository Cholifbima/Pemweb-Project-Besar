import { AdminProvider } from '@/contexts/AdminContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  )
}

export const metadata = {
  title: 'Admin Panel - DoaIbu Store',
  description: 'Admin dashboard untuk mengelola DoaIbu Store',
} 