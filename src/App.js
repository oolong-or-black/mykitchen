import './App.css';
import React from 'react';
import { Provider } from 'react-redux'
import  store  from './redux/store'
import { BrowserRouter } from 'react-router-dom';
import KitchenSandbox from './views/sandbox/KitchenSandbox';


function App() {
  return <Provider store={store}>
    <BrowserRouter>
      <KitchenSandbox/>
    </BrowserRouter>
  </Provider>  
}

export default App;

/* 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
<Routes>
   <Route path='/*' element={<KitchenSandbox/>}/>
</Routes>  */