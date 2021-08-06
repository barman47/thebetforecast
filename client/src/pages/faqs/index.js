import { Link } from 'react-router-dom';

import './faqs.css';
import Layout from '../../components/layout';
import Form from '../../components/common/form/Form';

import img from '../../assets/illustration.svg';

const Faqs = () => {
    return (
        <Layout>
            <section className="faqs">
                <div>
                    <Link to="/">&lt; Homepage</Link>
                    <h1>FAQS</h1>
                    <p>
                        <strong>What do I get?</strong><br />
                        By subscribing to TheBetForecast, you get daily tips, identified by our team of researchers, sent to your email everyday.
                    </p>
                    <p>
                        <strong>How do I sign up?</strong><br />
                        Click the subscribe button, sign up for yearly access and start receiving our tips via email everyday.
                    </p>
                    <p>
                        <strong>How do I use the tips?</strong><br />
                        Our tips come with booking codes. All you have to do is copy the code, go to your prefered betting website and stake. 
                    </p>
                    <p>
                        <strong>How much do I pay?</strong><br />
                        TheBetforecast charges &#8358;10,000 for yearly access. Sign up, pay and start receiving our tips!
                    </p>
                    <hr />
                    <h2>Ready to start winning?</h2>
                    <Form />
                </div>
                <div>
                    <img src={img} alt="TheBetForecast" />
                </div>
            </section>
        </Layout>
    );
};

export default Faqs;