import './App.css';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Navigate to='/login' replace />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/signup' element={<Signup />}></Route>
                <Route path='/feed' element={<Feed />}></Route>
            </Routes>
        </>
    );
}

export default App;
