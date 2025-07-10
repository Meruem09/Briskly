import { useNavigate } from "react-router-dom";
import { useSignIn, useClerk } from "@clerk/clerk-react";
import { useState } from "react";
const SignInPage = () => {

  const {isLoaded, signIn, setActive} = useSignIn();
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {signOut} = useClerk()

  const handleSignUp = () => {
    navigate('/');
  }

  if(!isLoaded){
    return null;
  }


  async function handleSignIn(e){
    signOut();
    e.preventDefault();
    if(!isLoaded){
        return;
    }

    try{
        const result = await signIn.create({
            identifier: emailAddress,
            password,
        })
        if(result.status === "complete"){
            await setActive({ session: result.createdSessionId });
            alert('Sign In Successfully')
        }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0].message);
    }
}



return ( 
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
          >
            Sign In
          </button>
          <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
            <button
              onClick={handleSignUp}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </div>        
        </form>
      </div>
    </div>
    );
}
 
export default SignInPage;