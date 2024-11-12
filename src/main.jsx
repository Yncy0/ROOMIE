import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter , Link, RouterProvider } from 'react-router-dom'
import './index.css'

import ArchievesPage from './pages/ArchievesPage.jsx'
import BacklogsPage from './pages/BacklogsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import Root from './pages/Root.jsx'
import RoomsAdd from './components/rooms/RoomsAdd'
import RoomsDescription from './components/rooms/RoomsDescription'
import RoomsEdit from './components/rooms/RoomsEdit'

const router = createBrowserRouter([
  { path: '/',
    element: <Root/>,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage/>,
      },

      {
        path: 'users',
        element: <UsersPage/>
      },

      {
        path: 'backlogs',
        element: <BacklogsPage/>
      },

      {
        path: 'archieves',
        element: <ArchievesPage/>
      },
      {
        path: 'rooms',
        element: <RoomsPage/>,
      },
      {
        path: 'rooms_add',
        element: <RoomsAdd/>
      },
      {
        path: 'rooms_edit',
        element: <RoomsEdit/>
      },
      {
        path: 'rooms_description',
        element: <RoomsDescription/>
      },

    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true}}/>
  </StrictMode>,
)
