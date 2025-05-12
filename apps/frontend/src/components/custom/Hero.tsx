import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useUser } from "@/hooks/useUser";

const Hero = () => {
  const { user } = useUser();
  const router = useRouter();

  // console.log(user);

  const goToMeeting = () => {
    if (typeof window !== undefined) {
      if (!user) {
        localStorage.setItem("triedConsultation", "true");
        router.push("/signin");
      } else if (user && user.role == "User") {
        router.push("/meetings");
      }
    }
  };
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            Virtual healthcare for you
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Oductur provides progressive, and affordable healthcare, accessible
            on mobile and online for everyone.
          </p>
          <button
            onClick={goToMeeting}
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Consult A Doctor
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {/* <a
            href="#"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Consult A Doctor
          </a> */}
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src="undraw_doctor_aum1.png" alt="doctor-patient-discussing" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
