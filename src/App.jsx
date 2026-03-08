import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/politicas-de-privacidad" element={<PrivacyPolicy />} />
            </Routes>
        </Router>
    );
}

export default App;
