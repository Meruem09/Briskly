import { useClerk, useAuth, useSignUp, useUser, useSession } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"


const SignUpPage = () => {
  const { signUp, isLoaded } = useSignUp()
  const { signOut, setActive } = useClerk()
  const { session } = useSession()
  const { isSignedIn, getToken, userId } = useAuth()
  const { user } = useUser()
  const [username, setUsername] = useState("")
  const [emailAddress, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [debugInfo, setDebugInfo] = useState({})

  const navigate_to = useNavigate()

  useEffect(() => {
    const authState = { 
      isSignedIn, 
      userId, 
      hasUser: !!user,
      hasSession: !!session
    }
    console.log("Auth state:", authState)
    setDebugInfo(authState)
  }, [isSignedIn, userId, user, session])

  localStorage.clear()

  const validateForm = () => {
    if (!username.trim()) {
      alert("Username is required")
      return false
    }
    if (!emailAddress.trim()) {
      alert("Email is required")
      return false
    }
    if (!password.trim()) {
      alert("Password is required")
      return false
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long")
      return false
    }
    return true
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!isLoaded || !validateForm()) return

    setIsLoading(true)
    try {
      await signOut()

      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      })

      setShowVerification(true)
      alert("Verification code sent to your email.")
    } catch (err) {
      console.error("SignUp error:", err)
      alert(err.errors?.[0]?.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }


const createUserInDatabase = async (token, clerkId, userData) => {
  console.log("Creating user in database with:", { clerkId, userData });

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BE_BASEURL}/user`,
      { clerkId, ...userData },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Database response status:", response.status);
    console.log("User created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Database error response:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || error.message || "Failed to save user to database"
    );
  }
};

const handleVerify = async () => {
  if (!isLoaded || !verificationCode.trim()) {
    alert("Please enter the verification code");
    return;
  }

  setIsVerifying(true);

  try {
    console.log("Starting email verification...");

    const result = await signUp.attemptEmailAddressVerification({
      code: verificationCode,
    });

    console.log("Verification result:", result);

    if (result.status === "complete") {
      // Set the session directly
      await setActive({ session: result.createdSessionId });

      // Get token and Clerk user ID
      const token = await getToken();
      const clerkId = result.createdUserId;

      //remove below line at time of deploy.
      if (!token || !clerkId) {
        throw new Error("Session was set but no token or user ID found.");
      }

      // Send to your backend
      await createUserInDatabase(token, clerkId, {
        username,
        email: emailAddress,
      });
      

      alert("Signup successful!");
      navigate_to('/onBoard')
    } else {
      console.error("Verification incomplete:", result);
      alert("Verification incomplete. Please try again.");
    }
  } catch (err) {
    console.error("Verification error:", err);

    if (err.errors?.length > 0) {
      alert(err.errors[0].message);
    } else if (err.message) {
      alert(err.message);
    } else {
      alert("Verification failed. Please try again.");
    }
  } finally {
    setIsVerifying(false);
  }
};

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg2.svg')] bg-no-repeat bg-cover text-white">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Welcome to Briskly ✨</h2>
        <br />

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Tyler"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading || showVerification}
              className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              placeholder="username@gmail.com"
              value={emailAddress}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || showVerification}
              className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || showVerification}
              className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
              minLength={8}
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
          </div>

          {showVerification && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Enter Verification Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isVerifying}
                className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                required
              />
              <button
                onClick={handleVerify}
                disabled={isVerifying || !verificationCode.trim()}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          )}

          {!showVerification && (
            <>
              <div id="clerk-captcha" />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-gray-950 hover:bg-blue-900 disabled:bg-gray-700 disabled:cursor-not-allowed border border-gray-600 transition-colors text-white font-semibold py-2 rounded-lg"
              >
                {isLoading ? "Creating Account..." : "Sign Up →"}
              </button>
            </>
          )}
        </form>


        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate_to('/signIn')}
            className="text-blue-400 hover:underline cursor-pointer"
            disabled={isLoading || isVerifying}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
