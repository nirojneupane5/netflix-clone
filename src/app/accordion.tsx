"use client";
import React, { useState } from "react";

const Accordion = () => {
  const [accrodion, setAccordion] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (index === accrodion) {
      setAccordion(null);
    } else {
      setAccordion(index);
    }
  };

  return (
    <div className="py-[30px]">
      <div className=" mb-[15px]">
        <button onClick={() => handleClick(0)} className="block w-full">
          <div className="flex justify-start text-[30px] text-white font-bold bg-[#373636] p-[20px] hover:bg-[#6c6969] duration-300 relative border-b-[2px] border-black cursor-pointer">
            <h2>What is Netflix?</h2>
            <span className="absolute right-[20px] top-[15px]">+</span>
          </div>
        </button>
        <div
          className={`text-[20px] text-white bg-[#373636] p-[20px] ${
            accrodion === 0 ? "block duration-300 origin-top" : "hidden"
          } `}
        >
          <p>
            Netflix is a streaming service that offers a wide variety of
            award-winning TV shows, movies, anime, documentaries, and more on
            thousands of internet-connected devices.
          </p>
          <p>
            {" "}
            You can watch as much as you want, whenever you want without a
            single commercial all for one low monthly price. There always
            something new to discover and new TV shows and movies are added
            every week!
          </p>
        </div>
      </div>
      <div className=" mb-[15px]">
        <button onClick={() => handleClick(1)} className="block w-full">
          <div className="flex justify-start text-[30px] text-white font-bold bg-[#373636] p-[20px] hover:bg-[#6c6969] duration-300 relative border-b-[2px] border-black cursor-pointer">
            <h2>How much Netflix cost?</h2>
            <span className="absolute right-[20px] top-[15px]">+</span>
          </div>
        </button>
        <div
          className={`text-[20px] text-white bg-[#373636] p-[20px] ${
            accrodion === 1 ? "block duration-300 origin-top" : "hidden"
          }`}
        >
          <p>
            Netflix is a streaming service that offers a wide variety of
            award-winning TV shows, movies, anime, documentaries, and more on
            thousands of internet-connected devices.
          </p>
          <p>
            {" "}
            You can watch as much as you want, whenever you want without a
            single commercial all for one low monthly price. There always
            something new to discover and new TV shows and movies are added
            every week!
          </p>
        </div>
      </div>
      <div className=" mb-[15px]">
        <button onClick={() => handleClick(2)} className="block w-full">
          <div className="flex justify-start text-[30px] text-white font-bold bg-[#373636] p-[20px] hover:bg-[#6c6969] duration-300 relative border-b-[2px] border-black cursor-pointer">
            <h2>Where can I watch?</h2>
            <span className="absolute right-[20px] top-[15px]">+</span>
          </div>
        </button>
        <div
          className={`text-[20px] text-white bg-[#373636] p-[20px] ${
            accrodion === 2 ? "block duration-300 origin-top" : "hidden"
          } `}
        >
          <p>
            Netflix is a streaming service that offers a wide variety of
            award-winning TV shows, movies, anime, documentaries, and more on
            thousands of internet-connected devices.
          </p>
          <p>
            {" "}
            You can watch as much as you want, whenever you want without a
            single commercial all for one low monthly price. There always
            something new to discover and new TV shows and movies are added
            every week!
          </p>
        </div>
      </div>
      <div className=" mb-[15px]">
        <button onClick={() => handleClick(3)} className="block w-full">
          <div className="flex justify-start text-[30px] text-white font-bold bg-[#373636] p-[20px] hover:bg-[#6c6969] duration-300 relative border-b-[2px] border-black cursor-pointer">
            <h2>How do I cancel?</h2>
            <span className="absolute right-[20px] top-[15px]">+</span>
          </div>
        </button>
        <div
          className={`text-[20px] text-white bg-[#373636] p-[20px] ${
            accrodion === 3 ? "block duration-300 origin-top" : "hidden"
          } `}
        >
          <p>
            Netflix is a streaming service that offers a wide variety of
            award-winning TV shows, movies, anime, documentaries, and more on
            thousands of internet-connected devices.
          </p>
          <p>
            {" "}
            You can watch as much as you want, whenever you want without a
            single commercial all for one low monthly price. There always
            something new to discover and new TV shows and movies are added
            every week!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
