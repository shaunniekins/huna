"use client";

import Image from "next/image";
import { SetStateAction, useState } from "react";
import { supabase } from "../../utils/supabase";
import Indicator from "./Indicator";
import { useRouter } from "next/navigation";
import { insertProfileData } from "@/api/profiles_data";
import { ProfileData } from "@/types/dataTypes";

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [emailVal, setEmailVal] = useState("");
  const [usernameVal, setUsernameVal] = useState("");
  const [passVal, setPassVal] = useState("");
  const [confirmPassVal, setConfirmPassVal] = useState("");

  const [indicatorMsg, setIndicatorMsg] = useState("");
  const [indicatorStatus, setIndicatorStatus] = useState(true);

  const router = useRouter();

  const handleTimeout = () => {
    setTimeout(() => {
      setIndicatorMsg("");
      setIndicatorStatus(true);
    }, 2500);
  };

  const handleEmailChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmailVal(e.target.value);
  };

  const handleUsernameChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setUsernameVal(e.target.value);
  };

  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setPassVal(e.target.value);
  };
  const handleConfirmPasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setConfirmPassVal(e.target.value);
  };

  const handleSignInChange = () => {
    setIsSignIn(!isSignIn);
    setEmailVal("");
    setPassVal("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailVal !== "string" && passVal.trim() !== "") {
      if (isSignIn) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: emailVal,
            password: passVal,
          });

          if (error) {
            setIndicatorMsg("Email or Password is incorrect!");
            setIndicatorStatus(false);
            handleTimeout();
          } else {
            setEmailVal("");
            setPassVal("");
            router.push("/home");
          }
        } catch (error) {
          setIndicatorMsg("An unexpected error occurred.");
          setIndicatorStatus(false);
        }
      } else {
        if (passVal === confirmPassVal) {
          try {
            let { data, error } = await supabase.auth.signUp({
              email: emailVal,
              password: passVal,
            });

            if (error) {
              setIndicatorMsg("An error occurred while creating the account.");
              setIndicatorStatus(false);
              handleTimeout();
            } else {
              setIndicatorMsg(
                "Account created successfully. Check email for confirmation."
              );

              const newUserData: ProfileData = {
                id: data.user?.id || "",
                username: usernameVal,
              };

              await insertProfileData(newUserData);

              setIndicatorStatus(true);
              handleTimeout();
              setEmailVal("");
              setUsernameVal("");
              setPassVal("");
              setConfirmPassVal("");
              setIsSignIn(true);
            }
          } catch (error) {
            setIndicatorMsg("An error occurred while creating the account.");
            setIndicatorStatus(false);
            handleTimeout();
          }
        } else {
          setIndicatorMsg("Passwords do not match.");
          setIndicatorStatus(false);
          handleTimeout();
        }
      }
    } else {
      setIndicatorMsg("Wrong input");
      setIndicatorStatus(false);
      handleTimeout();
    }
  };

  return (
    <>
      <div className="container mx-auto sm:w-[30rem] w-screen h-[100svh] flex flex-col items-center px-5 font-Roboto justify-around font-Montserrat cursive">
        {indicatorMsg && (
          <Indicator msg={indicatorMsg} status={indicatorStatus} />
        )}
        <div className="flex flex-col items-center">
          <Image src="/huna1.png" alt="Usap Logo" width={200} height={200} />
          <h3 className="text-sm mt-[-35%]">
            Rant <span className=" italic">&</span> Chill
          </h3>
        </div>

        <div className="w-full flex flex-col space-y-8">
          <form
            className="w-full flex flex-col space-y-5 items-center"
            onSubmit={handleSubmit}>
            <div className="w-full flex flex-col space-y-3 items-center">
              <input
                type="email"
                name="email"
                id="email"
                value={emailVal}
                onChange={handleEmailChange}
                required
                placeholder="Email Address"
                className="w-full flex py-3 px-[25px] border border-blue-300 rounded-lg space-x-[30px]"
              />
              {!isSignIn && (
                <input
                  type="username"
                  name="username"
                  id="username"
                  value={usernameVal}
                  onChange={handleUsernameChange}
                  required
                  placeholder="Username"
                  className="w-full flex py-3 px-[25px] border border-blue-300 rounded-lg space-x-[30px]"
                />
              )}
              <input
                type="password"
                name="password"
                id="password"
                value={passVal}
                onChange={handlePasswordChange}
                required
                placeholder="Password"
                className="w-full flex py-3 px-[25px] border border-blue-300 rounded-lg space-x-[30px]"
              />
              {!isSignIn && (
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  value={confirmPassVal}
                  onChange={handleConfirmPasswordChange}
                  required
                  placeholder="Confirm Password"
                  className="w-full flex py-3 px-[25px] border border-blue-300 rounded-lg space-x-[30px]"
                />
              )}
            </div>

            <div className="w-full flex flex-col items-center space-y-2">
              {isSignIn ? (
                <button className="w-full flex py-3 px-[25px] rounded-lg shadow-md space-x-[30px] text-white bg-blue-400 justify-center">
                  <p>Sign in</p>
                </button>
              ) : (
                <button className="w-full flex py-3 px-[25px] rounded-lg shadow-md space-x-[30px] text-white bg-blue-400 justify-center">
                  <p>Sign up</p>
                </button>
              )}
            </div>
          </form>
          <div className="bottom-5 self-center absolute">
            {isSignIn ? (
              <p className="text-black text-xs">
                Don&rsquo;t have an account?{" "}
                <button
                  className="text-[#54B5E6] font-semibold"
                  onClick={handleSignInChange}>
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-black text-xs">
                Already have an account?{" "}
                <button
                  className="text-[#54B5E6] font-semibold"
                  onClick={handleSignInChange}>
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* <div className="flex flex-col space-y-6">
            <div className="flex gap-3 items-center">
              <div className="w-full px-[35px] md:px-[75px] h-0 border border-gray-400" />
              <p className="text-gray-400 text-[12px] font-semibold">OR</p>
              <div className="w-full px-[35px] md:px-[75px] h-0 border border-gray-400" />
            </div>

            {isSignIn ? (
              <button className="w-full flex py-3 px-[25px] rounded-lg space-x-[30px] border border-gray-400 bg-white">
                <Image
                  src="/google.png"
                  alt="Google Logo"
                  width={25}
                  height={25}
                />
                <p>Sign in with Google</p>
              </button>
            ) : (
              <button className="w-full flex py-3 px-[25px] rounded-lg space-x-[30px] border border-gray-400 bg-white">
                <Image
                  src="/google.png"
                  alt="Google Logo"
                  width={25}
                  height={25}
                />
                <p>Sign up with Google</p>
              </button>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SignIn;
