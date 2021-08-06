import { Link } from 'react-router-dom';

import logo from '../../assets/logo.png';

const Header = () => {
    return (
        <Link to="/"><img src={logo} alt="TheBetForecast Logo" /></Link>
    );
}

export default Header;
