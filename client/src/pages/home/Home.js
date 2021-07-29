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
                    <h1>The easiest way to win more<br /> on sports betting.</h1>
                    <Form />
                    <p>Subscribe to TheBetForecast to receive great tips everyday that help you win more on your  sports bets.</p>
                    <p>For &#8358;10,000/year, our team of smart researchers will identify the best bets and send them to you everyday.</p>
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