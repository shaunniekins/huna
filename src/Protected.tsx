"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";
import { ThreeDots } from "react-loader-spinner";

type User = any;

const Protected = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error && error.status === 401) {
          router.push("/signin");
        } else if (error) {
          console.error("Error fetching user:", error.message);
        } else {
          setUser(user);
          //   console.log("user", user);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    // You can show a loading spinner or message while checking authentication.
    return (
      <div className="flex w-screen h-[100dvh] justify-center items-center">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#85B7F8"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default Protected;
