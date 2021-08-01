import { useState } from 'react';
import axios from 'axios';
import Validator from 'validator';

import './form.css';

const Form = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const onSubmit = async (e) => {
        e.preventDefault();

        if (Validator.isEmpty(email)) {
            return setErrors({ email: 'Email address required!' });
        }
        
        if (!Validator.isEmail(email)) {
            return setErrors({ email: 'Invalid email address' });
        }

        const res = await axios.post('/audience', { email });
        console.log(res);
    };

    return (
        <>
            <form onSubmit={onSubmit} noValidate>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                />
                <button type="submit"><span className="mdi mdi-arrow-right mdi-24px"></span></button>
            </form>
            {errors.email && <small>{errors.email}</small>}
        </>
    );
};

export default Form;