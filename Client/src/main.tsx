import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Preview from './pages/Preview/Preview';
import Home from './pages/Home/Home';
import Auth from './overlays/Auth/Auth';
import Login from './pages/Auth/Login/Login';
import Registrate from './pages/Auth/Registrate/Registrate';
import CreatePassword from './pages/Auth/CreatePassword/CreatePassword';
import SendPassword from './pages/Auth/SendPassword/SendPassword';
import Book from './pages/Book/Book';
import ViewBook from './pages/ViewBook/ViewBook';
import AddBook from './pages/AddBook/AddBook';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Profile from './pages/Profile/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Preview/>,
  },
  {
    path: '/home',
    element: <Home/>,
  },
  {
    path: '/profile',
    element: <Profile/>,
  },
  {
    path: '/auth',
    element: <Auth/>,
    children:[
      {
        path: 'login',
        element: <Login/>
      },
      {
        path: 'registrate',
        element: <Registrate/>
      },
      {
        path: 'create-password',
        element: <CreatePassword/>
      },
      {
        path: 'send-password',
        element: <SendPassword/>
      },
    ]
  },
  {
    path: '/book',
    element: <Book/>
  },
  {
    path: '/create-book',
    element: <AddBook/>
  },
  {
    path: 'book/1',
    element: <ViewBook/>
  },		
  {
		path: '*',
		element: <div>Ошибка</div>
	}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)