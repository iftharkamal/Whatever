import React from "react";

const SearchBar = () => {
  return (
    <div
      className="w-[67%] border border-gray-300 rounded-full py-3 px-5">
      <input
        type="text"
        placeholder="Search here..."
        className="w-full outline-none text-gray-600"
      />
    </div>
  );
};

export default SearchBar;
