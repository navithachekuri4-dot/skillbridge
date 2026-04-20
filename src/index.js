import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

import { AuthProvider } from './context/AuthContext';
import { SkillsProvider } from './context/SkillsContext';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(

<AuthProvider>

<SkillsProvider>

<App />

</SkillsProvider>

</AuthProvider>

);