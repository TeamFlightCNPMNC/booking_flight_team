import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Get, Login } from "./API/Account";
import { useMutation } from "@tanstack/react-query";
import { bouncy } from "ldrs";
import CatchErrorAPI from "./CatchErrorAPI";

function AdminLogin() {
  bouncy.register();
  const naviLogin = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const [isInputting, setIsInputting] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(handleLogin)();
    }
  };

  const mutationLogin = useMutation({
    mutationFn: Login,
    onSuccess: (response) => {
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      mutationGet.mutate();
    },
    onError: (error) => {
      if (error.response) {
        if (error.response.status === 404) {
          setError("phoneLogin", {
            message: "Số điện thoại này chưa đăng kí",
          });
        }
        if (error.response.status === 403) {
          setError("phoneLogin", {
            message: "Số điện thoại này đã bị khóa",
          });
        }
        if (error.response.status === 400) {
          setError("passwordLogin", {
            message: "Sai mật khẩu",
          });
        }
      } else {
        setError("InternalServerError", {
          message: "ServerError",
        });
      }
    },
  });

  const mutationGet = useMutation({
    mutationFn: Get,
    onSuccess: (response) => {
      naviLogin("/home");
    },
  });

  const handleLogin = (data) => {
    mutationLogin.mutate(data);
  };

  return (
    <div className="relative px-[50px] py-5 w-full h-screen bg-[url('https://ik.imagekit.io/tvlk/image/imageResource/2023/09/27/1695776209619-17a750c3f514f7a8cccde2d0976c902a.png')] bg-center bg-no-repeat bg-cover overflow-hidden">
      <div
        className={`absolute z-40 h-full w-[450px] right-4
         rounded-lg bg-transparent p-4`}
      >
        <div className="flex items-center w-full text-2xl font-medium mb-20 div-flex-adjust-justify-between h-14 text-slate-700">
          <div className={"Typewriter"}>
            <p>Đăng nhập</p>
          </div>
        </div>
        <form onKeyDown={handleKeyDown} onSubmit={handleSubmit(handleLogin)}>
          <>
            <div className="w-full mb-6 inputBox">
              <input
                className={`${errors.phoneLogin ? "inputTagBug" : "inputTag"}`}
                required
                pattern="\d*"
                type="number"
                autoFocus
                {...register("phoneLogin", {
                  required: "Your phone",
                  minLength: {
                    value: 10,
                    message: "Phải đủ 10 số",
                  },

                  maxLength: {
                    value: 10,
                    message: "Phải đủ 10 số",
                  },
                })}
              />
              <span className={`spanTag`}>
                {errors.phoneLogin ? errors.phoneLogin.message : "Your phone"}
              </span>
            </div>

            <div className="w-full mb-6 inputBox">
              <input
                className={`${
                  errors.passwordLogin ? "inputTagBug" : "inputTag"
                }`}
                type="password"
                required
                autoFocus
                {...register("passwordLogin", {
                  onChange: () => setIsInputting(true),
                  required: "Your password",
                  validate: (value) => {
                    if (!isInputting) {
                      const validValues = "1234567890";
                      return validValues === value || "Mật khẩu không đúng";
                    }
                    return true; // Nếu đang nhập thì không cần validate
                  },
                })}
              />
              <span className={`spanTag`}>
                {errors.passwordLogin
                  ? errors.passwordLogin.message
                  : "Your Password"}
              </span>
            </div>
          </>

          <div className="boxLogRes mb-4">
            <button className={`styleLogin`} type="submit">
              <p className="flex justify-center uppercase">
                {mutationLogin.isPending || mutationGet.isPending ? (
                  <l-bouncy size="30" speed="1.75" color="white" />
                ) : (
                  "Đăng nhập"
                )}
              </p>
            </button>
          </div>

          {mutationGet.isError && <CatchErrorAPI error={mutationGet.error} />}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
