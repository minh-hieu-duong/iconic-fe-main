import React, { useState } from "react";

export function VideoForm({ onSubmit, isOpen, setIsOpen }: any) {
  const [link, setLink] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(link, name);
  };

  return (
    <div className=" flex justify-center">
      <form onSubmit={handleSubmit} className="w-full rounded-lg shadow-lg ">
        <div className="flex items-center  border-[#3FF066] justify-center bg-white rounded-[47px] w-full h-[48px] border-2  p-1 font-bold text-sm">
          Enter your link here
        </div>
        <div className="bg-opacity-65 bg-gray-500 mt-8 rounded-2xl">
          <div className="mb-4 pt-8 px-5 pb-10 ">
            <input
              id="link"
              type="text"
              placeholder="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-3 h-[33px] rounded-[60px] border-2 border-[#3FF066]  focus:border-[#3FF066] focus:outline-none focus:ring-0  transition duration-300"
            />
            <input
              id="namelink"
              type="text"
              placeholder="name link"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 px-4 py-3 h-[33px] rounded-[60px] border-2 border-[#3FF066] focus:border-[#3FF066] focus:outline-none focus:ring-0 transition duration-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full h-[34px] w-full bg-[#3FF066] text-black font-extrabold text-sm cursor-pointer"
        >
          Save
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full h-[34px] mt-2 w-full bg-white text-black font-extrabold text-sm cursor-pointer"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
