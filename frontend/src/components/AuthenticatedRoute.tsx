import { useRecoilValue } from "recoil";
import { tokenState, userState } from "../store/atoms/auth";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthConditionalRouterProps extends PropsWithChildren {
  auth: boolean;
}

const AuthConditionalRouter = ({
  children,
  auth,
}: AuthConditionalRouterProps) => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  const checkValidity = async () => {
    // console.log(user);

    if (auth && (!user || !user._id)) {
      navigate("/");
    } else if (!auth && user && user._id) {
      navigate("/");
    }
  };

  useEffect(() => {
    checkValidity();
  }, [user,auth]);

  return <>{children}</>;
};

export default AuthConditionalRouter;
