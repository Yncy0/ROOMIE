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


const express = require('express');
const cors = require('cors');
const app = express();

// Add the CORS middleware
app.use(cors({
    origin: '*', // Allow all origins. Change this to a specific domain if needed.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Example route
app.get('/api/data', (req, res) => {
    res.json({ message: 'CORS is enabled!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



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
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true}}/>
  </StrictMode>,
)
