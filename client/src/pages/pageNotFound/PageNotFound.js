import { Link } from 'react-router-dom';

import Layout from '../../components/layout';

import './page-not-found.css';

const PageNotFound = () => {
    return (
        <Layout>
            <div className="page-not-found">
                <span className="mdi mdi-cancel icon"></span>
                <p>There's nothing to see here <Link to="/">GO HOME</Link></p>
            </div>
        </Layout>
    );
};

export default PageNotFound;