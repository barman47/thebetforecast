import { useState } from 'react';
import axios from 'axios';
import Validator from 'validator';

import './form.css';

const Form = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleError = (err) => {
        const NETWORK_ERROR = 'Network Error';
        console.error(err);
        // console.log(err.response);
        
        if (err?.message === NETWORK_ERROR) {
            return window.alert(NETWORK_ERROR);
        }
        
        const { msg, email  } = err?.response?.data.errors;
        setErrors({ email });

        if (msg) {
            return window.alert(msg)
        }
        
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (Validator.isEmpty(email)) {
            return setErrors({ email: 'Email address required!' });
        }
        
        if (!Validator.isEmail(email)) {
            return setErrors({ email: 'Invalid email address' });
        }

        setLoading(true);
        setErrors({});
        try {
            const res = await axios.post('/api/subscribers', { email });
            setLoading(false);
            window.location = res.data.data.paymentUrl;
        } catch (err) {
            setLoading(false);
            return handleError(err);
        }
    };

    return (
        <>
            <form onSubmit={onSubmit} noValidate>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={loading ? true : false}
                />
                <button type="submit" className={loading ? 'disabled-button' : undefined} disabled={loading ? true : false}>
                    {loading ? 
                        <span className="mdi mdi-circle-slice-1 mdi-spin mdi-24px disabled-icon"></span>
                        : 
                        <span className="mdi mdi-arrow-right mdi-24px"></span> 
                    }
                </button>
            </form>
            {errors.email && <small>{errors.email}</small>}
        </>
    );
};

export default Form;