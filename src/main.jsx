import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import './index.css'
import HeaderComponent from './components/HeaderComponent.jsx'

import ArchievesPage from './pages/ArchievesPage.jsx'
import BacklogsPage from './pages/BacklogsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import NavBarComponent from './components/navigation/NavBarComponent.jsx'
import Root from './Root.jsx'

const router = createBrowserRouter([
  { path: '/',
    element: <Root/>,
    children: [
      {
        path: 'dashboard',
        basename:'dashboard' ,
        element: <DashboardPage/>,
      },
      {
        path: 'users',
        basename: 'users',
        element: <UsersPage/>
      },
      {
        path: 'backlogs',
        basename: 'users',
        element: <BacklogsPage/>
      },
      {
        path: 'archieves',
        basename: 'users',
        element: <ArchievesPage/>
      },
      {
        path: 'rooms',
        basename: 'users',
        element: <RoomsPage/>
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <HeaderComponent/> */}
    {/* <NavBarComponent/> */}
    <RouterProvider router={router} future={{ v7_startTransition: true}}/>
  </StrictMode>,
)
