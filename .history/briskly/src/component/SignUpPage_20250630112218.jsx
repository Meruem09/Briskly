import React, { useState, useEffect } from "react";
import { useSignUp, useAuth, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom"

export default function SignUpPage() {

  const {isLoaded, signUp, setActive} = useSignUp();
  const [username, setUsername] = useState("");
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setpendingVerification] = useState(false);
  const [error, setError] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false);
  const {signOut} = useClerk()
  const navigate = useNavigate();
  const { isSignedIn, getToken, userId } = useAuth()

  // Clear any existing session on component mount
  useEffect(() => {
    const clearSession = async () => {
      if (isSignedIn && isLoaded) {
        setIsSigningOut(true);
        try {
          await signOut();
          setIsSigningOut(false);
        } catch (err) {
          console.error("Error signing out:", err);
          setIsSigningOut(false);
        }
      }
    };
    
    clearSession();
  }, [isSignedIn, isLoaded, signOut]);

  const handleSignIn = () => {
    navigate('/signIn'); // Fixed: added leading slash
  }

  if(!isLoaded || isSigningOut){
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div>Loading...</div>
    </div>;
  }

  async function handleSignUp(e){
    e.preventDefault();
    setError(""); // Clear previous errors
    
    if(!isLoaded){
      return;
    }

    // Double-check that user is not signed in before attempting signup
    if (isSignedIn) {
      setError("Please sign out before creating a new account.");
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
      setError(
        (err && err.errors && err.errors[0] && err.errors[0].message) ||
        err.message ||
        "An unknown error occurred"
      );
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      
      if (result.status !== "complete") {
        console.log(JSON.stringify(result, null, 2));
        setError("Verification failed. Please try again.");
        return;
      }

      // Set the session first
      await setActive({ session: result.createdSessionId });
      
      // Get token after setting session
      const token = await getToken();
      const clerkId = result.createdUserId;

      if (!token || !clerkId) {
        throw new Error("Session was set but no token or user ID found.");
      }

      // Send to your backend
      await createUserInDatabase(token, clerkId, {
        username,
        email: emailAddress,
      });

      alert("Signup successful!");
      navigate('/main')
      
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError(
        (err && err.errors && err.errors[0] && err.errors[0].message) ||
        err.message ||
        "An unknown error occurred"
      );
    }
  }

  const createUserInDatabase = async (token, clerkId, userData) => {
    console.log("Creating user in database with:", { clerkId, userData })
    console.log("Token (first 20 chars):", token.substring(0, 20) + "...")

    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        clerkId,
        username: userData.username.trim(),
        email: userData.email.trim(),
      }),
      credentials: 'include',
    })

    console.log("Database response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Database error response:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      throw new Error(errorData.error || errorData.message || `Server error: ${response.status}`)
    }

    const result = await response.json()
    console.log("User created successfully:", result)
    return result
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-100">
            {error}
          </div>
        )}

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
            disabled={pendingVerification}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 rounded transition-colors"
          >
            {pendingVerification ? "Check your email for verification code" : "Sign Up"}
          </button>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
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