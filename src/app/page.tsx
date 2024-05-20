import { AiOutlineGlobal } from "react-icons/ai";
import Image from "next/image";
import logo from "../../public/Netflix_2015_logo.svg.png";
export default function Home() {
  return (
    <main>
      <section className="bg-[url(../../public/netflixbg.jpg)] min-h-screen bg-cover bg-center">
        <div className="w-full h-screen bg-[rgba(0,0,0,0.5)]">
          <header className="max-w-[1170px] mx-auto">
            <div className="grid sm:grid-cols-2 grid-cols-[30%_auto] px-6 items-center py-8">
              <figure>
                <Image
                  src={logo}
                  alt="Netflix"
                  width={200}
                  height={200}
                  className="w-[148px]"
                />
              </figure>
              <div className="flex justify-end gap-4">
                <div className="relative">
                  <AiOutlineGlobal className="text-white absolute top-3 left-1" />
                  <select
                    name=""
                    id=""
                    className="rounded px-5 py-2 bg-black text-white border-[1px] border-white"
                  >
                    <option value="">English</option>
                    <option value="">Hindi</option>
                  </select>
                </div>
                <button className="text-white bg-red-600 rounded px-2 py-1">
                  Sign In
                </button>
              </div>
            </div>
          </header>
          <div className="max-w-[1170px] mx-auto sm:py-[150px] py-[50px] text-center text-white">
            <h1 className=" font-bold sm:text-[50px] text-[30px]">
              Unlimited movies, TV shows, and more
            </h1>
            <h4 className="text-[20px] py-[15px]">
              Watch anywhere. Cancel anytime.
            </h4>
            <p className="text-[20px]">
              Ready to watch? Enter your email or mobile number to create or
              restart your membership.
            </p>
            <div className="max-w-[700px] mx-auto mt-[30px] sm:px-[10px] px-[40px] ">
              <form className="grid sm:grid-cols-[70%_auto] grid-cols-1 gap-4">
                <input
                  type="text"
                  className="border-[1px] pl-[20px] bg-transparent border-[#ccc] h-[50px]"
                  placeholder="Email Address"
                />
                <button className="bg-red-600 py-[15px] text-white rounded-[5px] px-[10px]">
                  Get Started
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
