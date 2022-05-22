import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Pages.css'

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const initialValues = { email: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const Navigate = useNavigate();


    useEffect(() => {
        const auth = localStorage.getItem('auth')
        if (auth) {
            Navigate('/');
        }
    }, []);

    function togglePassword() {
        setShowPassword(!showPassword)
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    function handleSubmit(e) {
        e.preventDefault()
        let errors = validate(formValues);
        let length = (Object.keys(errors).length === 0)
        if (length) {
            submitData()
        } else {
            setFormErrors(errors)
        }
    }

    function validate(values) {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
        }
        return errors;
    }

    async function submitData() {
        let result = await fetch("http://localhost:5000/login", {
            method: "POST",
            body: JSON.stringify({ email: formValues.email, password: formValues.password }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (result.status === 200) {
            result = await result.json()
            console.log(result.message);
            localStorage.setItem('auth', JSON.stringify(result.user))
            localStorage.setItem('auth-token', result.auth)
            Navigate('/')
        } else {
            result = await result.json()
            alert(result.message)
            console.log(result.error);
        }
    }

    return (
        <div className="content">
            <div className="card">
                <div className="card-content">
                    <div className="card-title">
                        <h2>LOGIN</h2>
                        <div className="underline-title"></div>
                    </div>

                    <form method="post" className="form" onSubmit={handleSubmit}>
                        <label htmlFor="user-email"> &nbsp;Email </label>
                        <input type="text" className="input-content2" id="user-email" name="email" value={formValues.email} onChange={handleChange} autoComplete="on" />
                        <p className='error'>{formErrors.email}</p>

                        <div>
                            <label htmlFor="user-password">&nbsp;Password</label>
                            <input type={showPassword ? "text" : "password"} className="input-content2" id="user-password" name="password" value={formValues.password} onChange={handleChange} />
                            <i onClick={togglePassword} className={showPassword ? "fa fa-eye fa-2xs eye" : "fa fa-eye-slash fa-2xs eye"} id="login-eye"></i>
                            <p className='error'>{formErrors.password}</p>
                        </div>


                        <NavLink to="/recoveryEmail" className="forgot-pass">Forgot password?</NavLink>


                        <input className="submit-btn" type="submit" name="submit" value="LOGIN" />
                        <NavLink to="/register" className="ask">Don't have account yet?</NavLink>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;