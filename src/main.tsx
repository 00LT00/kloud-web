import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './Layout';
import Login from './pages/Login';
import { CssBaseline, GeistProvider } from '@geist-ui/core';

import 'virtual:windi.css';
import './index.css';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Apps from './pages/Apps';
import AppDetail from './pages/AppDetail';
import Workflows from './pages/Workflows';
import Resources from './pages/Resources';
import RequireAuth from './components/RequireAuth';

axios.defaults.baseURL = 'http://api.zerokirin.online/kloud';
// axios.defaults.baseURL = 'http://localhost:1121';
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (!token) return config;
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: token,
      },
    };
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // eslint-disable-next-line no-alert
    if (error.response.status === 401) {
      console.log('无权访问，请登录后重试');
      localStorage.removeItem('token');
    }
    if (error.response.status === 400) {
      alert(error.response.data.Data);
    }
    console.log(error);
    return Promise.reject(error);
  },
);

ReactDOM.render(
  <React.StrictMode>
    <GeistProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Home />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="resources" element={<Resources />} />
            <Route path="settings" element={<Settings />} />
            <Route path="apps" element={<Apps />} />
            <Route path="apps/:id" element={<AppDetail />} />
          </Route>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GeistProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
