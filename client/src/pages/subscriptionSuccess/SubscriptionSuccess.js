
import { Link } from 'react-router-dom';

import Layout from '../../components/layout';
import './success.css';
import img from '../../assets/illustration.svg';
import { FAQS } from '../../routes';

const SubscriptionSuccess = () => {
    return (
        <Layout>
            <section className="success">
                <div>
                    <p>
                        Welcome to TheBetforecast! Here's what to expect: you'll get one email from us every morning in which we'll share our betting tips for the day.
                    </p>
                    <p>
                        Our picks are well-researched and the reasoning for each pick will be shared. You can expect a mix of "Safe", "Medium-risk" and "High-risk" labeled picks from us, depending on the daily volume of games available. But no matter the case, we always aim to ensure you win.
                    </p>
                    <p>
                        Email <a href="mailto:tips@thebetforecast.com">tips@thebetforecast.com</a> for any questions or inquiries.
                    </p>
                    <Link to={FAQS}>Got questions? Read our FAQS</Link>
                    <p>
                        Welcome!
                    </p>
                </div>
                <div>
                    <img src={img} alt="TheBetForecast" />
                </div>
            </section>
        </Layout>
    );
};

export default SubscriptionSuccess;