import { Suspense, lazy } from 'react';
import Home from './pages/Home';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

function App() {
    if (window.location.pathname === '/politicas-de-privacidad') {
        return (
            <Suspense fallback={null}>
                <PrivacyPolicy />
            </Suspense>
        );
    }

    return <Home />;
}

export default App;
