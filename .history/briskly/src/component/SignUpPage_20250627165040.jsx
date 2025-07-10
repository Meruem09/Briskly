import { useSignUp } from '@clerk/clerk-react'

const SignUpPage = () => {
    return ( 
        <div>
            <div>
                <h1>Welcome to briskly</h1>
                <label htmlFor="username">username</label>
                <input type="text" name="" id="" />
                <label htmlFor="password">password</label>
                <input type="text" name="" id="" />
                <label htmlFor="">Verification code</label>
                <input type="text" />
                <button>SignUp</button>
            </div>
        </div>
     );
}
 
export default SignUpPage;