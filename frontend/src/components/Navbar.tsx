import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState, userState } from "../store/atoms/auth";

const Navbar = () => {
  const setTokenState = useSetRecoilState(tokenState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
    navigate('/');
  };

  return (
    <nav className="bg-gray-100 py-4 relative">
      <div className="container mx-auto flex items-start justify-between px-6">
        <Link
          to="/"
          className="flex flex-row gap-2 items-center justify-center"
        >
          <img className="w-10 h-10" src="chaticon.png"></img>
          <h2 className="text-lg">Chatify</h2>
        </Link>

        {!(user && user._id) ? (
          <Link
            to="/sign-in"
            className="text-white bg-primary-600 focus:ring-primary-300 hover:bg-primary-700 py-2 px-4 rounded-lg inline-block text-sm md:text-lg"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="text-white bg-primary-600 focus:ring-primary-300 hover:bg-primary-700 py-2 px-4 rounded-lg inline-block text-sm md:text-lg"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
