import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom"

export default function SignUpPage() {

  const {isLoaded, signUp, setActive} = useSignUp();
  const [username, setUsername] = useState("");
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setpendingVerification] = useState(false);
  const [error, setError] = useState("")
  const navigate = useNavigate();
  
  const handleSignIn = () => {
    navigate('signIn');
  }



  if(!isLoaded){
    return null;
  }

  async function handleSignUp(e){
    e.preventDefault();
    if(!isLoaded){
      return;
    }
  
  try{
    await signUp.create({
      emailAddress,
      password,
    });
    await signUp.prepareEmailAddressVerification({strategy: "email_code"});
    setpendingVerification(true);
  }
  catch(err){
    console.log(JSON.stringify(err, null, 2));
    setError(err.errors[0].message);
  }
}

async function handleVerify(e) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        alert("Signup successful!");
        router.push("/main");
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

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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

        {pendingVerification && (
          <div>
            <label className="block text-sm mb-1">Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={handleVerify}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
            >
              Verify Code
            </button>
          </div>
        )}
          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
          >
            Sign Up
          </button>
          <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
            <button
              onClick={handleSignIn}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>        
        </form>
      </div>
    </div>
  );
}
