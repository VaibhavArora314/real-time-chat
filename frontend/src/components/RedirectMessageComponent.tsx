import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const RedirectMessageComponent = ({ message }: { message: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 10 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-start px-6 py-8 mx-auto md:h-screen lg:py-0">
        <p className="font-semibold text-lg mt-20">{message}</p>
        <p className="text-md">
          You will be automatically redirected to{" "}
          <Link to="/" className="text-primary-500 cursor-pointer">
            home
          </Link>{" "}
          after 10seconds
        </p>
      </div>
    </section>
  );
};

export default RedirectMessageComponent;
