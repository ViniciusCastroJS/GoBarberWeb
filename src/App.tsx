import React from 'react';
import GlobalStyle from './styles/Global';
import {Routes} from './routes/index'
import {AppProvider} from './hooks/index'
import { BrowserRouter as Router} from 'react-router-dom'


const App: React.FC = () => {
  return (
    <Router>
    <AppProvider>
          <Routes/>
    </AppProvider>
    <GlobalStyle/>
    </Router>
  );
}

export default App;
