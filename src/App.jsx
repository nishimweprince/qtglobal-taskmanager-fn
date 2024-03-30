import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './containers/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTask from './pages/CreateTask';
import ListTasks from './pages/ListTasks';
import TaskDetails from './pages/TaskDetails';
import ProtectedRoutes from './outlets/ProtectedRoutes';

const App = () => {
  return (
    <>
      <ToastContainer hideProgressBar autoClose={1500} position='top-center' closeOnClick />
      <Navbar />
      <Routes>
        <Route element={<ProtectedRoutes />}>
        <Route path='/' element={<ListTasks />} />
        <Route path='/tasks' element={<ListTasks />} />
        <Route path='/tasks/create' element={<CreateTask />} />
        <Route path='/tasks/:id' element={<TaskDetails />} />
        </Route>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
