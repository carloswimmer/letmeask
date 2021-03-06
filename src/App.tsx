import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './hooks/auth'

import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'
import { Room } from './pages/Room'
import { AdminRoom } from './pages/AdminRoom'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
          <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
