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
                    {/* <p>Our tipsters use data and expertise to find the best bets. We do the research, you do the winning!</p> */}
                    <p>Our team will use data and expertise to find the best bets and send them to you <strong><em>everyday!</em></strong> We do the research, you do the winning!</p>
                    <Form />
                    <div className="price">
                        {/* <div> */}
                            <h4>Full Access</h4>
                            <p>&#8358;10,000 Yearly</p>
                            {/* <h4></h4> */}
                        {/* </div> */}
                    </div>
                    {/* <p>We do the research, you do the winning!</p> */}
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