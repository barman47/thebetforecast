import { Link } from 'react-router-dom';

import './home.css';
import Layout from '../../components/layout';
import Form from '../../components/common/form/Form';

import img from '../../assets/illustration.svg';

import { FAQS } from '../../routes';

const Home = () => {
    return (
        <Layout>
            <section className="home">
                <div>
                    <h1>Get great bet tips from<br /> expert tipsters</h1>
                    <p>Our tipsters use data and expertise to find the best bets.</p>
                    <Form />
                    <div className="price">
                        <div>
                            <h2>Yearly</h2>
                            <h3>Full Access</h3>
                        </div>
                        <p>&#8358;10,000</p>
                    </div>
                    <p>We do the research, you do the winning!</p>
                    <Link to={FAQS}>Got questions? Read our FAQS</Link>
                </div>
                <div>
                    <img src={img} alt="TheBetForecast" />
                </div>
            </section>
        </Layout>
    );
};

export default Home;