import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter , Link, RouterProvider } from 'react-router-dom'
import './index.css'
import HeaderComponent from './components/HeaderComponent.jsx'



import ArchievesPage from './pages/ArchievesPage.jsx'
import BacklogsPage from './pages/BacklogsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'
import SchedulePage from './pages/SchedulePage'
import UserSchedulePage from './pages/UserSchedulePage'
import UsersPage from './pages/UsersPage.jsx'
import UserInfoSched from './components/users/userInfoSched'
import UserAdd from './components/users/UserAdd'
import UserEdit from './components/users/userEdit'
import NavBarComponent from './components/navigation/NavBarComponent.jsx'
import Root from './pages/Root.jsx'
import RoomsAdd from './components/rooms/RoomsAdd'










const router = createBrowserRouter([
  { path: '/',
    element: <Root/>,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage/>,
      },
      {
        path: 'schedule',
        element: <SchedulePage/>,
      },
      {
        path: 'User Schedule',
        element: <UserSchedulePage/>,
      },

      {
        path: 'users',
        element: <UsersPage/>
      },
      {
        path: 'user_info_sched',
        element: <UserInfoSched/>
      },
      {
        path: 'user_add',
        element: <UserAdd/>
      },
      {
        path: 'user_edit',
        element: <UserEdit/>
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
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true}}/>
  </StrictMode>,
)
