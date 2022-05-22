import React, { useState } from 'react'

const RecoveryEmail = () => {
    const [email, setEmail] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [formError, setFormError] = useState('');
    const [isDisabled, setDisabled] = useState(false);

    function handleSubmit(e) {
        e.preventDefault()
        let error = validate(email);
        let length = (error.length)
        if (length === 0) {
            submitData()
            setShowMessage(true)
        } else {
            setFormError(error)
        }
    }

    function validate(email) {
        let error = '';
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!email) {
            error = "Email is required!";
        } else if (!regex.test(email)) {
            error = "This is not a valid email format!";
        }
        return error;
    }
    
    async function submitData() {
        setDisabled(true);
        let result = await fetch("http://localhost:5000/recoveryEmail", {
            method: "POST",
            body: JSON.stringify({email}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (result.status === 200) {
            result = await result.json()
            alert(result.message);
            setDisabled(false);
        } else {
            result = await result.json()
            alert(result.message)
            setDisabled(false);
            console.log(result.error);
            setShowMessage(false)
            setFormError(result.message)
        }
    }

  return (
    <div className="content">
            <div className="card">
                <div className="card-content">
                    <div className="card-title">
                        <h2>FORGOT PASSWORD</h2>
                        <div className="underline-title"></div>
                    </div>

                    <form method="post" className="form" onSubmit={handleSubmit}>
                        <label htmlFor="user-email"> &nbsp;Enter your email </label>
                        <input type="text" className="input-content2" id="user-email" name="email" value={email} onChange={(e)=> setEmail(e.target.value)} autoComplete="on" />
                        {showMessage ? (<p className='msg'>We are sending a recovery link to your email</p>) : ""}
                        <p className='error'>{formError}</p>

                        <input className="submit-btn" type="submit" value="SUBMIT" disabled={isDisabled}/>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default RecoveryEmail;