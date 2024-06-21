import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LandingPage from "./components/LandingPage";
import BoundingBoxEditor from "./components/BoundingBoxEditor";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/editor" element={<BoundingBoxEditor/>}/>
            </Routes>
        </Router>
    );
}

export default App;
