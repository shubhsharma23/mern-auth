import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Pages.css'
const Register = () => {

    const [showPassword, setShowPassword] = useState(false);
    const initialValues = { username: "", email: "", password: "", retype_password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const Navigate = useNavigate();

    useEffect(()=>{
        const auth = localStorage.getItem('auth')
        if(auth){
            Navigate('/');
        }
    },[]);

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
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        
        if (!values.username) {
            errors.username = "Username is required!";
        } else if (values.username.length < 4) {
            errors.username = "username must be more than 4 characters";
        } else if (!usernameRegex.test(values.username)) {
            errors.username = "This is not a valid username format!";
        }
        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!mailRegex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
        } else if (values.password.includes(' ')) {
            errors.password = "Password must not contain white space!";
        }
        if (!values.retype_password) {
            errors.retype_password = "Please re-enter your password";
        } else if (values.retype_password !== values.password) {
            errors.retype_password = "Please make sure your password match";
        }
        return errors;
    }

    const submitData = async() => {
        let result = await fetch("http://localhost:5000/register",{
            method:"POST",
            body:JSON.stringify({username:formValues.username, email: formValues.email, password:formValues.password}),
            headers:{
                "Content-Type":"application/json"
            }
        });
        console.log(result);
        if(result.status === 201){
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
                        <h2>REGISTER</h2>
                        <div className="underline-title"></div>
                    </div>

                    <form method="post" className="form" onSubmit={handleSubmit}>
                        <label htmlFor="user-name"> &nbsp;Username </label>
                        <input className="input-content1" id="user-name" type="text" name="username"
                            value={formValues.username} onChange={handleChange} autoComplete="on" />
                        <div className="form-border"></div>
                        <p className='error'>{formErrors.username}</p>
                        
                        <label htmlFor="user-email" className='input-label'> &nbsp;Email </label>
                        <input className="input-content1" id="user-email" type="text" name="email"
                            value={formValues.email} onChange={handleChange} autoComplete="on" />
                        <div className="form-border"></div>
                        <p className='error'>{formErrors.email}</p>

                        <div>
                            <label htmlFor="user-password">&nbsp;Password</label>
                            <input type={showPassword ? "text" : "password"} className="input-content1" id="user-password" name="password"
                                value={formValues.password} onChange={handleChange} />
                            <i onClick={togglePassword} className={showPassword ? "fa fa-eye fa-2xs eye" : "fa fa-eye-slash fa-2xs eye"}></i>
                            <div className="form-border"></div>
                            <p className='error'>{formErrors.password}</p>
                        </div>

                        <div>
                            <label htmlFor="retype-password">&nbsp;Confirm Password</label>
                            <input type={showPassword ? "text" : "password"} className="input-content1" id="retype-password" name="retype_password"
                                value={formValues.retype_password} onChange={handleChange} />
                            <i onClick={togglePassword} className={showPassword ? "fa fa-eye fa-2xs eye" : "fa fa-eye-slash fa-2xs eye"}></i>
                            <div className="form-border"></div>
                            <p className='error'>{formErrors.retype_password}</p>
                        </div>

                        <input className="submit-btn" type="submit" name="submit" value="Create Account" />
                        <NavLink to="/login" className="ask">Already have an account?</NavLink>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;