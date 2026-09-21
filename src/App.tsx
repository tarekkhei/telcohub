import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AgentProvider } from './context/AgentContext'
import { AppStateProvider } from './context/AppStateContext'
import { AIInsights } from './pages/AIInsights'
import { CommandCenter } from './pages/CommandCenter'
import { ConnectorDetail } from './pages/ConnectorDetail'
import { ExceptionDetail } from './pages/ExceptionDetail'
import { ExceptionPacks } from './pages/ExceptionPacks'
import { Exceptions } from './pages/Exceptions'
import { Investigations } from './pages/Investigations'
import { Knowledge } from './pages/Knowledge'
import { Marketplace } from './pages/Marketplace'
import { OperationalBlueprint } from './pages/OperationalBlueprint'
import { Reports } from './pages/Reports'
import { ResolutionMemory } from './pages/ResolutionMemory'
import { Resolve } from './pages/Resolve'
import { RootCauses } from './pages/RootCauses'
import { Services } from './pages/Services'
import { Settings } from './pages/Settings'

function RedirectToConnectedSystem() {
  const { id } = useParams()
  return <Navigate to={`/connected-systems/${id}`} replace />
}

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
              <Route path="investigate" element={<Investigations />} />
              <Route path="resolve" element={<Resolve />} />
              <Route path="connected-systems" element={<Marketplace />} />
              <Route path="connected-systems/:id" element={<ConnectorDetail />} />
              <Route path="insights" element={<Reports />} />
              <Route path="settings" element={<Settings />} />

              <Route path="investigations" element={<Navigate to="/investigate" replace />} />
              <Route path="integrations" element={<Navigate to="/connected-systems" replace />} />
              <Route path="integrations/:id" element={<RedirectToConnectedSystem />} />
              <Route path="reports" element={<Navigate to="/insights" replace />} />
              <Route path="marketplace" element={<Navigate to="/connected-systems" replace />} />
              <Route path="marketplace/:id" element={<RedirectToConnectedSystem />} />
              <Route path="data-sources" element={<Navigate to="/connected-systems" replace />} />

              <Route path="ai-insights" element={<AIInsights />} />
              <Route path="services" element={<Services />} />
              <Route path="operational-blueprint" element={<OperationalBlueprint />} />
              <Route path="exception-packs" element={<ExceptionPacks />} />
              <Route path="root-causes" element={<RootCauses />} />
              <Route path="resolution-memory" element={<ResolutionMemory />} />
              <Route path="knowledge" element={<Knowledge />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AgentProvider>
      </BrowserRouter>
    </AppStateProvider>
  )
}
