import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AgentProvider } from './context/AgentContext'
import { AppStateProvider } from './context/AppStateContext'
import { AIInsights } from './pages/AIInsights'
import { CommandCenter } from './pages/CommandCenter'
import { ExceptionDetail } from './pages/ExceptionDetail'
import { Exceptions } from './pages/Exceptions'
import { Investigations } from './pages/Investigations'
import { Knowledge } from './pages/Knowledge'
import { Reports } from './pages/Reports'
import { RootCauses } from './pages/RootCauses'
import { Services } from './pages/Services'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <AgentProvider>
          <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<CommandCenter />} />
            <Route path="exceptions" element={<Exceptions />} />
            <Route path="exceptions/:id" element={<ExceptionDetail />} />
            <Route path="investigations" element={<Investigations />} />
            <Route path="services" element={<Services />} />
            <Route path="root-causes" element={<RootCauses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="insights" element={<AIInsights />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          </Routes>
        </AgentProvider>
      </BrowserRouter>
    </AppStateProvider>
  )
}
