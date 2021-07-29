import { useState } from 'react';
import Validator from 'validator';

import './form.css';

const Form = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (!Validator.isEmail(email)) {
            return setErrors({ email: 'Invalid email address' });
        }

        if (Validator.isEmpty(email)) {
            return setErrors({ email: 'Email address required!' });
        }
        

    };

    return (
        <form onSubmit={onSubmit} noValidate>
            <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
            />
            <button type="submit"><span className="mdi mdi-arrow-right mdi-24px"></span></button>
            {errors.email && <small>{errors.email}</small>}
        </form>
    );
};

export default Form;