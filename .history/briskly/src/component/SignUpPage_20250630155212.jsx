import { useClerk, useAuth,useSignIn, useSignUp, useUser, useSession } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


const SignUpPage = () => {
  const { signUp, isLoaded } = useSignUp()
  const { signOut, setActive } = useClerk()
  const { session } = useSession()
  const { isSignedIn, getToken, userId } = useAuth()
  const { user } = useUser()
  const { signIn } = useSignIn()

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
    // remove this in time of production
    // console.log("Creating user in database with:", { clerkId, userData })
    // console.log(token)

    const response = await fetch("http://localhost:3000/user", {
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

    //remove below line at time of deploy.
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
        //remove below line at time of deploy.
    console.log("User created successfully:", result)
    return result
  }

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
      navigate_to('/main')
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


  const handleOAuth = async (provider) => {
    try {
      await signOut()

      // Use environment-based redirect URLs or fallback to current origin
      const baseUrl = window.location.origin

      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: `${baseUrl}/sso-callback`,
        redirectUrlComplete: `${baseUrl}/board`,
      })
    } catch (err) {
      console.error("OAuth error:", err)
      alert(err.errors?.[0]?.message || "OAuth authentication failed.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-[#121212] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Welcome to IntellectUP</h2>
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
                type="button"
                onClick={handleVerify}
                disabled={isVerifying || !verificationCode.trim()}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>
              
              {/* Debug info */}
              {isVerifying && (
                <div className="mt-3 p-2 bg-gray-800 rounded text-xs">
                  <p>Auth state: {JSON.stringify(debugInfo)}</p>
                </div>
              )}
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

        {!showVerification && (
          <>
            <div className="mt-6 text-center text-sm text-gray-400">Or sign up with</div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => handleOAuth("oauth_github")}
                disabled={isLoading}
                className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed py-2 rounded-lg text-white transition-colors"
              >
                GitHub
              </button>
              <button
                onClick={() => handleOAuth("oauth_google")}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed py-2 rounded-lg text-white transition-colors"
              >
                Google
              </button>
            </div>
          </>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={navigate_to('/signIn')}
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
