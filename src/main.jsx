import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "./AuthProvider.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
        <React.StrictMode>
                <Router>
                        <AuthProvider>
                                <QueryClientProvider client = {queryClient}>
                                        <App />
                                        <ReactQueryDevtools initialIsOpen={false}/>
                                </QueryClientProvider>
                        </AuthProvider>
                </Router>
        </React.StrictMode>




);



