import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const initialValues = { password: '', retype_password: '' }
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false)
    const Navigate = useNavigate();
    const { token } = useParams();

    function handleChange(e) {
        let { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    function togglePassword() {
        setShowPassword(!showPassword)
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

    async function submitData() {
        let result = await fetch("http://localhost:5000/resetPassword", {
            method: "POST",
            body: JSON.stringify({ token, password: formValues.password }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (result.status === 200) {
            result = await result.json()
            alert(result.message);
            Navigate('/login')
        } else {
            result = await result.json()
            alert(result.message)
        }
    }

    return (
        <div className="content">
            <div className="card">
                <div className="card-content">
                    <div className="card-title">
                        <h2>RESET PASSWORD</h2>
                        <div className="underline-title"></div>
                    </div>

                    <form method="post" className="form" onSubmit={handleSubmit}>
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


                        <input className="submit-btn" type="submit" name="submit" value="SUBMIT" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;