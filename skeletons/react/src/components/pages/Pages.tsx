import type { ReactElement } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';

export default function Pages(): ReactElement {
  return (
    <Routes>
      <Route path="/">
        <Home/>
      </Route>
    </Routes>
  );
}
