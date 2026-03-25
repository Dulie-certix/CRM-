import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Notes from '../pages/Notes';
import AddNote from '../pages/AddNote';
import EditNote from '../pages/EditNote';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
    <Route path="/notes/add" element={<PrivateRoute><AddNote /></PrivateRoute>} />
    <Route path="/notes/edit/:id" element={<PrivateRoute><EditNote /></PrivateRoute>} />
    <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
