import React, { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoLogoYoutube, IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { BiVideoPlus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/navSlice";
import { Link, useNavigate } from "react-router-dom";
import { searchApi } from "../utils/constant";
import { catcheStore } from "../utils/searchSlice";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [manageSuggestion, setManageSuggestion] = useState(false);

  const searchSelect = useSelector((store) => store.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (searchSelect[searchText]) {
        setSuggestion(searchSelect[searchText]);
      } else {
        fetchText();
      }
    }, 200);
    return () => clearTimeout(timeOut);
  }, [searchText]);

  const fetchText = async () => {
    const response = await fetch(`${searchApi}${searchText}`);
    const json = await response.json();
    setSuggestion(json[1]);
    dispatch(catcheStore({ [searchText]: json[1] }));
  };

  const handleClick = () => {
    if (searchText) {
      navigate(`/search?search_query=${searchText}`);
      setManageSuggestion(false);
      
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const handleToggle = () => {
    dispatch(toggleMenu());
  };

  return (
    <div className="flex justify-between h-14 items-center shadow-md">
      <div className="flex items-center gap-3 text-2xl m-2">
        <RxHamburgerMenu onClick={handleToggle} className="cursor-pointer active:scale-90" />
        <Link to="/">
          <img
            className="w-28"
            src="https://t3.ftcdn.net/jpg/03/00/38/90/360_F_300389025_b5hgHpjDprTySl8loTqJRMipySb1rO0I.jpg"
            alt="YouTube"
          />
        </Link>
      </div>

      <div className="w-8/12 ml-14 relative">
        <div className="flex items-center border-slate-500 w-7/12 rounded-2xl overflow-hidden justify-between border">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setManageSuggestion(true)}
            onBlur={() => setTimeout(() => setManageSuggestion(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            className="border rounded-l-2xl border-r-slate-500 placeholder:pl-4 w-[86%] text-xl p-1"
          />
          <Link to="#">
            <div className="flex items-center justify-center">
              <button className="mr-3" onClick={handleClick}>
                <IoIosSearch className="text-3xl" />
              </button>
            </div>
          </Link>
        </div>

        {suggestion && suggestion.length > 0 && (
          <div className="absolute bg-white w-[31rem] rounded-md z-10 border border-gray-200 shadow-md">
            <ul>
              {suggestion.map((s) => (
                <Link
                  key={s}
                  className="bg-white px-4 py-1 flex items-center gap-3 font-semibold hover:bg-gray-100"
                  onClick={() => setSearchText(s)}
                  to={`/search?search_query=${s}`}
                >
                  <li className="flex p-1 items-center gap-4 hover:bg-gray-200 rounded">
                    <IoIosSearch />
                    {s}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="text-xl mr-6 flex gap-4 items-center">
        <BiVideoPlus className="text-3xl cursor-pointer" />
        <IoMdNotificationsOutline className="text-3xl cursor-pointer" />
        <FaUserCircle className="text-3xl cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
