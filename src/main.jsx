import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter , Link, RouterProvider } from 'react-router-dom'
import './index.css'
import HeaderComponent from './components/HeaderComponent.jsx'

import ArchievesPage from './pages/ArchievesPage.jsx'
import BacklogsPage from './pages/BacklogsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import NavBarComponent from './components/navigation/NavBarComponent.jsx'
import Root from './pages/Root.jsx'
import RoomsAdd from './components/rooms/RoomsAdd'
import RoomsDescription from './components/rooms/RoomsDescription'

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
      //NOTE: Temporary Solution
      {
        path: 'rooms_add',
        element: <RoomsAdd/>
      },
      {
        path: 'rooms/rooms_description',
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
