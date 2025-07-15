import { useNavigate } from "react-router-dom";
import { useSignIn, useClerk } from "@clerk/clerk-react";
import { useState } from "react";

const SignInPage = () => {

  const {isLoaded, signIn, setActive} = useSignIn();
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const {signOut} = useClerk()

  const handleSignUp = () => {
    navigate('/signUp');
  }

  if(!isLoaded){
    return null;
  }

  localStorage.clear()
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
            navigate('/main');
        }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0].message);
    }
}


return ( 
  <div className="bg-[url('/bg2.svg')] bg-no-repeat bg-cover" >
    <div className="min-h-screen flex  items-center justify-center bg-transparent text-white px-4">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Welcome Back 👋</h2>
        <br />

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email address</label>
            <input
              type="email"
              placeholder="username@gmail.com"
              value={emailAddress}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <button
            type="submit"
            onSubmit={handleSignIn}
            className="w-full mt-4 bg-gray-950 hover:bg-blue-900 border border-gray-600 transition-colors text-white font-semibold py-2 rounded-lg"
          >
            Sign In →
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account? <a onClick={handleSignUp} className="text-blue-400 cursor-pointer hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  </div>
    );
}
 
export default SignInPage;