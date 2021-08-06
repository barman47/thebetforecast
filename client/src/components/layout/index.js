import { Helmet } from 'react-helmet';

import './layout.css';
import Footer from './Footer'
import Header from './Header'

const Layout = ({ children, title} ) => {
    return (
        <>
            {title && 
                <Helmet><title>Page Not Found | TheBetForecast</title></Helmet>
            }
            <div className="layout">
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
}

export default Layout;
