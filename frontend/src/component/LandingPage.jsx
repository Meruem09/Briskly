import Header from "./Header";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "./compo/Button";
import { useNavigate } from "react-router-dom";
import {useAuth} from '@clerk/clerk-react'

gsap.registerPlugin();

const LandingPage = () => {
  const wordRef = useRef(null);
  const {isSignedIn} = useAuth();

  const words = ["Faster", "Smarter", "Effortlessly"];
  const navigate = useNavigate();


  useGSAP(() => {
    let index = 0;

    gsap.from('.tagline', {
      y: 70,
      opacity: 0,
      duration: 2,
      ease: 'power2.out'  // makes it smoother!
    });

    gsap.from('.symbol', {
      y: 30,
      opacity: 0,
      duration: 2,
      ease: 'power2.out'  // makes it smoother!
    });

    



    const flip = () => {
      // Animate out
      gsap.to(wordRef.current, {
        y: "100%", // Move down
        rotationX: 90,
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
        onComplete: () => {
          // Update text
          index = (index + 1) % words.length;
          if (wordRef.current) {
            wordRef.current.textContent = words[index]; // Use textContent for safety
          }

          // Reset position
          gsap.set(wordRef.current, { y: "-100%", rotationX: -90, opacity: 0 });

          // Animate in
          gsap.to(wordRef.current, {
            y: "0%",
            rotationX: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power1.in',
          });
        },
      });
    };

    // Start the animation loop
    const interval = setInterval(flip, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs once on mount
   
  console.log("✅ BE BASE URL:", import.meta.env.VITE_APP_BE_BASEURL);


  return (
    <div className="bg-transparent" style={{ backgroundImage: `url('/bg.svg')` }}>
      <Header />
      <div className="flex flex-col items-center bg-transparent my-20 min-h-screen px-4 from-blue-50 to-white">
        {/* Top Title */}
        <div className="text-3xl md:text-4xl symbol font-semibold bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-white  to-gray-600 mb-4">
          Briskly
        </div>


        {/* Explore Button/Tag */}
        <div className="text-sm text-gray-100 px-3 py-1  rounded-full border border-gray-600 overflow-hidden shadow-md bg-transparent  transition transform  cursor-pointer mb-6
        hover:text-transparent 
        hover:bg-clip-text 
        hover:bg-gradient-to-r from-pink-500 via-gray-100 to-[#06b6d4] 
        hover:gradient-text 
        hover:drop-shadow-[0_0_20px_rgba(147,51,234,0.8)]
        hover:border-blue-900
        ">
          explore briskly ✨
        </div>

        {/* Main Title */}
            <div className="text-4xl md:text-6xl bg-transparent font-bold text-center text-white mb-4 leading-tight">
                <div className="bg-transparent tagline">Your last Minute</div>
                <div className="bg-transparent tagline">
                    Learning App{" "}
                    <span className="relative inline-block bg-transparent  align-middle">
                    <span ref={wordRef} className="inline-block mb-3 bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] via-purple-500 to-pink-500 gradient-text drop-shadow-[0_0_20px_rgba(147,51,234,0.8)] text-blue-600">
                        {words[0]}
                    </span>
                    </span>
                </div>
            </div>
        <div className="bg-transparent text-center mb-6">
          <p className="bg-transparent tagline text-gray-500 items-center text-lg">
            An AI-driven app that adapts to your needs <br />
            and helps you master topics quickly <br />
          </p>
        </div>
        {/* Get Started Button */}
          <Button
          className="bg-transparent"
          />
      </div>
    </div>
  );
};

export default LandingPage;