import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import HeaderComponent from './components/HeaderComponent.jsx'

import ArchievesComponent from './components/archieves/ArchievesComponent.jsx'
import BacklogsComponent from './components/backlogs/BacklogsComponent.jsx'
import DashboardComponent from './components/dashboard/DashboardComponent.jsx'
import RoomsComponent from './components/rooms/RoomsComponent.jsx'
import UsersComponent from './components/users/UsersComponent.jsx'

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardComponent/>,
  },
  {
    path: '/users',
    element: <UsersComponent/>
  },
  {
    path: '/backlogs',
    element: <BacklogsComponent/>
  },
  {
    path: '/archieves',
    element: <ArchievesComponent/>
  },
  {
    path: '/rooms',
    element: <RoomsComponent/>
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeaderComponent/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
