import { Link } from "react-router-dom";
import HomeGrid from "../components/HomeGrid";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/auth";

const Home = () => {
  const user = useRecoilValue(userState);

  return (
    <>
      <section className="bg-gray-50 py-16 relative">
        <div className="container mx-auto flex items-start justify-between px-6">
          <div className="w-full">
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4">
              Chatify
            </h1>
            <p className="text-xl md:text-3xl text-gray-700 mb-6 font-light">
            Engage in real-time communication with our chat application. Create rooms, share invite codes, join securely, and chat instantly. Developed with TypeScript, Express.js, React.js, MongoDB, and powered by sockets.io for seamless interaction.
            </p>
            {user && user._id ? (
              <Link
                to="/dashboard"
                className="text-white bg-primary-600 focus:ring-primary-300 hover:bg-primary-700 py-2 px-4 rounded-lg inline-block text-md md:text-xl"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/sign-in"
                className="text-white bg-primary-600 focus:ring-primary-300 hover:bg-primary-700 py-2 px-4 rounded-lg inline-block text-md md:text-xl"
              >
                Sign In to see dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      <HomeGrid/>
    </>
  );
};

export default Home;
