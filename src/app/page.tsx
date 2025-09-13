import { AiOutlineGlobal } from "react-icons/ai";
import Image from "next/image";
import logo from "../../public/Netflix_2015_logo.svg.png";
import tv from "../../public/tv.png";
import download from "../../public/download.jpg";
import icondownload from "../../public/download-icon.gif";
import stranger from "../../public/stranger.png";
import kids from "../../public/kids.png";
import Accordion from "./accordion";
import Link from "next/link";
import ImageToPdfConverter from "../components/ImageToPdfConverter";

export default function Home() {
  return (
    <main>
      {/* banner section */}
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
                <button className="bg-red-600 py-[15px] text-white rounded-[5px] px-[10px] hover:bg-red-800 duration-300">
                  Get Started &gt;
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Enjoy your TV section */}
      <section className="w-full border-t-[7px] bg-black border-t-[#4d4c4c] py-[50px] ">
        <div className="max-w-[1170px] mx-auto px-[10px]">
          <div className="grid sm:grid-cols-2 grid-cols-1 items-center">
            <div className="text-white text-center">
              <h2 className="sm:text-[50px] text-[35px] font-bold">
                Enjoy on your TV
              </h2>
              <p className="sm:text-[20px] text-[15px] pt-[20px]">
                Watch on Smart TVs, Playstation, Xbox, Chromecast, <br /> Apple
                TV, Blu-ray players, and more.
              </p>
            </div>
            <figure className="relative">
              <video
                className="absolute w-[70%] left-[16%] bottom-[25%] z-[3]"
                controls
                loop
                playsInline
                muted
                autoPlay
              >
                <source src="/video-tv-0819.m4v" type="video/mp4" />
              </video>
              <Image src={tv} alt="TV image" className="relative z-[2]" />
            </figure>
          </div>
        </div>
      </section>
      {/* download section */}
      <section className="w-full border-t-[7px] bg-black border-t-[#4d4c4c] py-[70px] ">
        <div className="max-w-[1170px] mx-auto px-[10px]">
          <div className="grid sm:grid-cols-2 grid-cols-1 items-center">
            <figure className="relative sm:order-1 order-2">
              <Image src={download} alt="download image" />
              <div className="sm:w-[60%] w-[80%] sm:left-[20%] left-[10%] absolute border-[1px] border-[#ccc] bottom-0 grid grid-cols-[70%_auto] bg-black items-center">
                <div className="grid grid-cols-[25%_auto] p-[10px] gap-[10px] items-center rounded-full">
                  <Image src={stranger} alt="stranger things" />
                  <div className="text-white">
                    <h1 className="font-bold text-[14px]">Stranger Things</h1>
                    <span className="text-blue-600">Downloading...</span>
                  </div>
                </div>
                <div>
                  <Image src={icondownload} alt="download icon" />
                </div>
              </div>
            </figure>
            <div className="text-white text-center sm:order-2 order-1">
              <h2 className="sm:text-[50px] text-[35px] font-bold sm:leading-[55px] leading-[40px]">
                Download your shows to watch offline
              </h2>
              <p className="sm:text-[20px] text-[15px] pt-[20px]">
                Save your favorites easily and always have something to watch.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* watch everywhere */}
      <section className="w-full border-t-[7px] bg-black border-t-[#4d4c4c] py-[50px] ">
        <div className="max-w-[1170px] mx-auto px-[10px]">
          <div className="grid sm:grid-cols-2 grid-cols-1 items-center">
            <div className="text-white text-center">
              <h2 className="sm:text-[50px] text-[35px] font-bold">
                Watch <br /> everywhere
              </h2>
              <p className="sm:text-[20px] text-[15px] pt-[20px]">
                Stream unlimited movies and TV shows on your phone, tablet,
                laptop, and TV.
              </p>
            </div>
            <figure className="relative">
              <video
                className="absolute w-[70%] left-[16%] bottom-[25%] z-[3]"
                controls
                loop
                playsInline
                muted
                autoPlay
              >
                <source src="/video-tv-0819.m4v" type="video/mp4" />
              </video>
              <Image src={tv} alt="TV image" className="relative z-[2]" />
            </figure>
          </div>
        </div>
      </section>
      {/* kids section */}
      <section className="w-full border-t-[7px] bg-black border-t-[#4d4c4c] py-[50px]">
        <div className="max-w-[1170px] mx-auto px-[10px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
            <figure className="order-2 sm:order-1">
              <Image src={kids} alt="kids" />
            </figure>
            <div className="text-center text-white order-1 sm:order-2">
              <h1 className="text-[35px] sm:text-[50px] font-bold">
                Create profiles for kids
              </h1>
              <p className="text-[20px] sm:text-[25px] text-left">
                Send kids on adventures with their favorite characters in a
                space made just for them—free with your membership.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* PDF Converter section */}
      <section className="w-full border-t-[7px] border-t-[#4d4c4c] bg-gray-100 py-[50px]">
        <div className="max-w-[1170px] mx-auto px-[10px]">
          <h1 className="text-[30px] sm:text-[50px] font-bold text-gray-800 text-center mb-8">
            Convert Folder to PDF
          </h1>
          <ImageToPdfConverter />
        </div>
      </section>
      {/* FAQ section */}
      <section className="w-full border-t-[7px] border-t-[#4d4c4c] bg-black py-[50px]">
        <div className="max-w-[1170px] mx-auto px-[10px]">
          <h1 className="text-[30px] sm:text-[50px] font-bold text-white text-center">
            Frequently Asked Questions
          </h1>
          <Accordion />
          <div>
            <h1 className="text-[25px] text-white text-center">
              Ready to watch? Enter your email or mobile number to create or
              restart your membership.
            </h1>
            <div className="max-w-[700px] mx-auto mt-[30px] sm:px-[10px] px-[40px] ">
              <form className="grid sm:grid-cols-[70%_auto] grid-cols-1 gap-4">
                <input
                  type="text"
                  className="border-[1px] pl-[20px] bg-transparent border-[#ccc] h-[50px] text-white"
                  placeholder="Email Address"
                />
                <button className="bg-red-600 py-[15px] text-white rounded-[5px] px-[10px] hover:bg-red-800 duration-300">
                  Get Started &gt;
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full border-t-[7px] border-t-[#4d4c4c] bg-black py-[50px]">
        <div className="max-w-[1170px] mx-auto px-[15px] text-white underline">
          <Link href={"#"}>Questions? Contact us.</Link>
          <div className="grid gird-cols-1 sm:grid-cols-4">
            <div>
              <ul>
                <li className="mb-[10px] mt-[10px]">
                  {" "}
                  <Link href="#">FAQ</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Invester Relation</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Privacy</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Speed Test</Link>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li className="mb-[10px] mt-[10px]">
                  {" "}
                  <Link href="#">Account</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Ways to Watch</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Corporate Information</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Only on Netflix</Link>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li className="mb-[10px] mt-[10px]">
                  {" "}
                  <Link href="#">Help Center</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Jobs</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Cookie Preferences</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Legal Notices</Link>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li className="mb-[10px] mt-[10px]">
                  {" "}
                  <Link href="#">Media Center</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Terms of Use</Link>
                </li>
                <li className="mb-[10px]">
                  <Link href="#">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative my-[20px]">
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
        </div>
        <div className="max-w-[1170px] mx-auto px-[10px]">
          <h1 className="no-underline text-white text-[15px] font-light">
            Netflix Nepal
          </h1>
        </div>
      </footer>
    </main>
  );
}
