import { Suspense, lazy } from 'react';
import Home from './pages/Home';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Gracias = lazy(() => import('./pages/Gracias'));

function App() {
    const path = window.location.pathname;

    if (path === '/politicas-de-privacidad') {
        return (
            <Suspense fallback={null}>
                <PrivacyPolicy />
            </Suspense>
        );
    }

    if (path === '/gracias') {
        return (
            <Suspense fallback={null}>
                <Gracias />
            </Suspense>
        );
    }

    return <Home />;
}

export default App;
