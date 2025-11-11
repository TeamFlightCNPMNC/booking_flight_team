import { memo, useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CONTEXT } from "../../Context/ContextGlobal";
import {
  Get,
  Login,
  Register,
  SendVerificationCodeEmail,
  Update,
} from "../../API/Account.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bouncy, squircle } from "ldrs";

function InterFaceLogin({ registerTrue = false }) {
  const queryClient = useQueryClient();

  bouncy.register();
  squircle.register();
  const { setShowInterfaceLogin, showNotification } = useContext(CONTEXT);

  const user = JSON.parse(localStorage.getItem("user"));

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    setError: setErrorLogin,
    formState: { errors: errorsLogin },
  } = useForm();
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    reset: resetRegister,
    setError: setErrorRegister,
    watch: watchRegister,
    formState: { errors: errorsRegister },
  } = useForm();
  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    setError: setErrorUpdate,
    watch: watchUpdate,
    formState: { errors: errorsUpdate },
  } = useForm();

  const [addSVG, setAddSVG] = useState([
    !registerTrue ? false : true,
    registerTrue ? true : false,
  ]);

  const [showChoosePassword, setShowChoosePassword] = useState(false);

  const refLogin = useRef(null);
  const refRegister = useRef(null);
  const refUpdate = useRef(null);

  //func keyboard
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowInterfaceLogin(false);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      !addSVG[0] && handleSubmitLogin(submitLogin)();
    }
  };

  const handleSwapClasses = (type) => {
    if (registerTrue) {
      return;
    }
    if (!refLogin.current) {
      return;
    }
    const btnLogin = refLogin.current?.className;
    const btnRegister = refRegister.current?.className;

    if (type === "Log" && btnLogin === "styleLogin") {
      return;
    } else {
      resetLogin();
    }
    if (type === "Res" && btnRegister === "styleLogin") {
      return;
    } else {
      resetRegister();
    }

    setAddSVG((prev) => [!prev[0], !prev[1]]);
    refLogin.current.className = btnRegister;
    refRegister.current.className = btnLogin;
  };

  const mutationLogin = useMutation({
    mutationFn: Login,
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    onError: (error) => {
      if (error.response) {
        if (error.response.status === 404) {
          setErrorLogin("phoneLogin", {
            message: "Số điện thoại này chưa đăng kí",
          });
        }
        if (error.response.status === 403) {
          setErrorLogin("phoneLogin", {
            message: "Số điện thoại này đã bị khóa",
          });
        }
        if (error.response.status === 400) {
          setErrorLogin("passwordLogin", {
            message: "Sai mật khẩu",
          });
        }
      } else {
        setErrorLogin("InternalServerError", {
          message: "ServerError",
        });
      }
    },
  });

  const mutationGet = useMutation({
    mutationFn: Get,
    mutationKey: ["user"],
    onSuccess: (response) => {
      localStorage.setItem("user", JSON.stringify(response.data));
      setShowInterfaceLogin(false);
      showNotification("Đăng nhập thành công", "Success");
    },
  });

  const mutationRegister = useMutation({
    mutationFn: Register,
    onSuccess: (response) => {
      setShowInterfaceLogin(false);
      showNotification(response?.data?.message, "Success");
    },
    onError: (error) => {
      if (error.response) {
        if (error?.response?.data?.type === "code") {
          setErrorRegister("verificationCode", {
            message: error?.response?.data?.message,
          });
        }
        if (error.response.status === 400) {
          setErrorRegister("InternalServerError", {
            message: "Kiểm tra lại thông tin",
          });
        }
        if (error?.response?.data?.type === "email") {
          setErrorRegister("email", {
            message: error?.response?.data?.message,
          });
        }
        if (error?.response?.data?.type === "phone") {
          setErrorRegister("phone", {
            message: error?.response?.data?.message,
          });
        }
        if (error.response.status === 500) {
          setErrorRegister("InternalServerError", {
            message: error?.response?.data?.message,
          });
        }
      } else {
        setErrorRegister("InternalServerError", {
          message: "ServerError",
        });
      }
    },
  });

  const submitLogin = async (data) => {
    const response = await mutationLogin.mutateAsync(data);
    if (response.status === 200) {
      await mutationGet.mutate();
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  const submitRegister = async (data) => {
    await mutationRegister.mutate(data);
  };

  const mutationUpdate = useMutation({
    mutationFn: Update,
    onSuccess: (response) => {
      if (response?.data?.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        queryClient.invalidateQueries("user");
      }
      showNotification(response?.data?.message, "Success");
    },
    onError: (error) => {
      if (error.response) {
        if (error.response.status === 404) {
          setErrorUpdate("InternalServerError", {
            message: error?.response?.data?.message,
          });
        }
        if (error?.response?.data?.type === "code") {
          setErrorUpdate("verificationCode", {
            message: error?.response?.data?.message,
          });
        }
        if (error?.response?.data?.type === "phone") {
          setErrorUpdate("phone", {
            message: error?.response?.data?.message,
          });
        }
        if (error?.response?.data?.type === "email") {
          setErrorUpdate("email", {
            message: error?.response?.data?.message,
          });
        }
        if (error?.response?.data?.type === "password") {
          setErrorUpdate("password", {
            message: error?.response?.data?.message,
          });
        }
        if (error?.response?.data?.type === "update_fail") {
          setErrorUpdate("InternalServerError", {
            message: error?.response?.data?.message,
          });
        }
      } else {
        setErrorUpdate("InternalServerError", {
          message: "ServerError",
        });
      }
    },
  });
  const funcUpdate = async (data) => {
    const payload = {
      numberPhone: data.phone,
      fullName: data.fullName,
      gender: data.gender,
      birthday: data.birthday,
      email: data.email,
      code_verification_email: Number(data.verificationCode),
      password: showChoosePassword && data.password,
      newPassword: showChoosePassword && data.newPassword,
    };
    await mutationUpdate.mutateAsync(payload);
  };

  const [showMessageVerificationCode, setShowMessageVerificationCode] =
    useState("");

  const mutationSendVerificationCodeEmail = useMutation({
    mutationFn: SendVerificationCodeEmail,
    onSuccess: (response) => {
      setShowMessageVerificationCode(response.data.message);
    },
    onError: (error) => {
      setShowMessageVerificationCode(error.response.data.message);
    },
  });

  const handleSendVerificationCode = async () => {
    const email = registerTrue ? watchUpdate("email") : watchRegister("email");
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!email) {
      setErrorRegister("email", {
        message: "Vui lòng nhập email",
      });
      return;
    }

    if (!emailPattern.test(email)) {
      setErrorRegister("email", {
        message: "Email không hợp lệ",
      });
      return;
    }

    if (email.endsWith("@gmail.co")) {
      setErrorRegister("email", {
        message: "e.g. @gmail.com",
      });
      return;
    }
    await mutationSendVerificationCodeEmail.mutate(email);
  };

  const [showInputVerificationCode, setShowInputVerificationCode] =
    useState(false);

  useEffect(() => {
    setShowInputVerificationCode(false);

    if (user?.email !== watchUpdate("email")) {
      setShowInputVerificationCode(true);
    }
  }, [watchUpdate("email")]);

  return (
    <>
      <div
        className={`${!registerTrue ? "fixed items-center h-full inset-0 z-[999] p-5 bg-zinc-800/50" : `items-start h-fit p-5 md:p-0`} flex justify-center w-full overflow-hidden`}>
        <div
          className={`${!addSVG[0] ? "h-fit" : "h-full"} ${!registerTrue ? "w-full m-auto md:w-[370px]" : "w-full"} overflow-y-auto rounded-md scroll-smooth bg-[#444] no-scrollbar`}>
          <div className="flex items-start justify-between w-full font-medium h-fit text-slate-700">
            <div
              className={"Typewriter p-5 text-white"}
              {...(!addSVG[0]
                ? registerLogin
                : registerTrue
                  ? registerUpdate
                  : registerRegister)("InternalServerError")}>
              <p className="text-base truncate">
                {errorsRegister.InternalServerError
                  ? errorsRegister.InternalServerError.message
                  : errorsLogin.InternalServerError
                    ? errorsLogin.InternalServerError.message
                    : addSVG[0]
                      ? !registerTrue
                        ? "Đăng ký"
                        : "Thông tin tài khoản"
                      : "Đăng nhập"}
              </p>
            </div>

            {!registerTrue && (
                <div
                  className="w-fit cursor-pointer bg-white rounded-bl-lg"
                  onClick={() => setShowInterfaceLogin(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    className="size-7 stroke-rose-600">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </div>
            )}
          </div>

          <form
            className="p-4"
            onKeyDown={handleKeyDown}
            onSubmit={
              registerTrue
                ? handleSubmitUpdate(funcUpdate)
                : !addSVG[0]
                  ? handleSubmitLogin(submitLogin)
                  : handleSubmitRegister(submitRegister)
            }>
            {!addSVG[0] ? (
              <>
                <div className="w-full mb-6 inputBox">
                  <input
                    className={`${errorsLogin.phoneLogin ? "inputTagBug" : "inputTag"}`}
                    type="number"
                    required
                    autoFocus
                    {...registerLogin("phoneLogin", {
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
                    {errorsLogin.phoneLogin
                      ? errorsLogin.phoneLogin.message
                      : "Your phone"}
                  </span>
                </div>

                <div className="w-full mb-6 inputBox">
                  <input
                    className={`${errorsLogin.passwordLogin ? "inputTagBug" : "inputTag"}`}
                    type="password"
                    required
                    {...registerLogin("passwordLogin", {
                      required: "Your password",
                    })}
                  />
                  <span className={`spanTag`}>
                    {errorsLogin.passwordLogin
                      ? errorsLogin.passwordLogin.message
                      : "Your Password"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <>
                  <div
                    className={`flex justify-between  ${registerTrue ? "md:flex-row flex-col" : "flex-col"}`}>
                    <div
                      className={`mb-6 inputBox ${registerTrue ? "md:w-[50%] w-full" : "w-full"}`}>
                      <input
                        className={`${errorsRegister.fullName ? "inputTagBug" : errorsUpdate.fullName ? "inputTagBug" : "inputTag"}`}
                        type="text"
                        defaultValue={user?.fullName}
                        required
                        {...(registerTrue ? registerUpdate : registerRegister)(
                          "fullName",
                          {
                            required: "full name",
                            minLength: {
                              value: 2,
                              message: "Ít nhất 2 kí tự",
                            },
                            maxLength: {
                              value: 50,
                              message: "Nhiều nhất 50 kí tự",
                            },
                            pattern: {
                              value: /^[a-zA-ZÀ-ỹà-ỹ\s]+$/,
                              message: "Nhập chữ",
                            },
                          }
                        )}
                      />
                      <span className={`spanTag`}>
                        {errorsRegister.fullName
                          ? errorsRegister.fullName.message
                          : errorsUpdate.fullName
                            ? errorsUpdate.fullName.message
                            : "FULL NAME"}
                      </span>
                    </div>
                    <div
                      className={`mb-6 inputBox ${registerTrue ? "md:w-[40%] w-full" : "w-full"}`}>
                      <input
                        className={`${errorsRegister.phone ? "inputTagBug" : errorsUpdate.phone ? "inputTagBug" : "inputTag"}`}
                        type="number"
                        defaultValue={user?.numberPhone}
                        required
                        {...(registerTrue ? registerUpdate : registerRegister)(
                          "phone",
                          {
                            required: "Your phone",
                            minLength: {
                              value: 10,
                              message: "Phải đủ 10 số",
                            },

                            maxLength: {
                              value: 10,
                              message: "Phải đủ 10 số",
                            },
                          }
                        )}
                      />
                      <span className={`spanTag`}>
                        {errorsRegister.phone
                          ? errorsRegister.phone.message
                          : errorsUpdate.phone
                            ? errorsUpdate.phone.message
                            : "Your phone"}
                      </span>
                    </div>
                  </div>
                </>

                <div
                  className={`flex justify-between  ${registerTrue ? "md:flex-row flex-col" : "flex-col"}`}>
                  <div
                    className={`mb-6 inputBox ${registerTrue ? "md:w-[40%] w-full" : "w-full"}`}>
                    <input
                      className={`${errorsRegister.gender ? "inputTagBug" : errorsUpdate.gender ? "inputTagBug" : "inputTag"}`}
                      type="text"
                      defaultValue={user?.gender}
                      required
                      {...(registerTrue ? registerUpdate : registerRegister)(
                        "gender",
                        {
                          validate: (value) => {
                            const validValues = [
                              "nam",
                              "nữ",
                              "nu",
                              "female",
                              "male",
                            ];
                            return (
                              validValues.includes(value.toLowerCase()) ||
                              "nam/nu/female/male"
                            );
                          },
                          required: "giới tính",
                          minLength: {
                            value: 2,
                            message: "nam/nu/female/male",
                          },
                        }
                      )}
                    />
                    <span className={`spanTag`}>
                      {errorsRegister.gender
                        ? errorsRegister.gender.message
                        : errorsUpdate.gender
                          ? errorsUpdate.gender.message
                          : "Giới tính"}
                    </span>
                  </div>
                  <div
                    className={`mb-6 inputBox ${registerTrue ? "md:w-[50%] w-full" : "w-full"}`}>
                    <input
                      className={`w-full ${errorsRegister.birthday ? "inputTagBug" : errorsUpdate.birthday ? "inputTagBug" : "inputExist"}`}
                      type="date"
                      defaultValue={
                        user?.birthday || new Date().toISOString().split("T")[0]
                      }
                      required
                      {...(registerTrue ? registerUpdate : registerRegister)(
                        "birthday",
                        {
                          required: "birthday",
                          validate: {
                            validAge: (value) => {
                              const today = new Date();
                              const birthDate = new Date(value);
                              let age =
                                today.getFullYear() - birthDate.getFullYear();
                              const isBirthdayPassed =
                                today.getMonth() > birthDate.getMonth() ||
                                (today.getMonth() === birthDate.getMonth() &&
                                  today.getDate() >= birthDate.getDate());

                              if (!isBirthdayPassed) {
                                age--;
                              }

                              return (
                                (age >= 12 && age <= 80) ||
                                "Tuổi phải từ 12 đến 80"
                              );
                            },
                          },
                        }
                      )}
                    />
                    <span className={`spanTag`}>
                      {errorsRegister.birthday
                        ? errorsRegister.birthday.message
                        : errorsUpdate.birthday
                          ? errorsUpdate.birthday.message
                          : "birthday"}
                    </span>
                  </div>
                </div>

                <div className={`w-full mb-6 inputBox`}>
                  <input
                    className={`${errorsRegister.email ? "inputTagBug" : errorsUpdate.email ? "inputTagBug" : "inputTag"}`}
                    type="text"
                    defaultValue={user?.email}
                    required
                    {...(registerTrue ? registerUpdate : registerRegister)(
                      "email",
                      {
                        required: "Your email",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email không hợp lệ",
                        },
                        validate: {
                          completeDomain: (value) => {
                            if (value.endsWith("@gmail.co")) {
                              return "e.g. @gmail.com";
                            }
                            return true;
                          },
                        },
                      }
                    )}
                  />
                  <span className={`spanTag`}>
                    {errorsRegister.email
                      ? errorsRegister.email.message
                      : errorsUpdate.email
                        ? errorsUpdate.email.message
                        : "Your Email"}
                  </span>
                </div>

                {(!registerTrue || showInputVerificationCode) && (
                  <div
                    className={`flex justify-between items-start mb-6 flex-col`}>
                    <div
                      className={`w-full inputBox ${registerTrue ? "w-full" : "w-full"}`}>
                      <input
                        className={`${errorsRegister.verificationCode ? "inputTagBug" : errorsUpdate.verificationCode ? "inputTagBug" : "inputTag"}`}
                        type="number"
                        required
                        {...(registerTrue ? registerUpdate : registerRegister)(
                          "verificationCode",
                          {
                            required: "mã xác minh",
                            minLength: {
                              value: 6,
                              message: "Mã xác minh có 6 ký tự",
                            },
                            maxLength: {
                              value: 6,
                              message: "Mã xác minh có 6 ký tự",
                            },
                          }
                        )}
                      />
                      <span className="spanTag">
                        {errorsRegister.verificationCode
                          ? errorsRegister.verificationCode.message
                          : errorsUpdate.verificationCode
                            ? errorsUpdate.verificationCode.message
                            : "mã xác minh email"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (mutationSendVerificationCodeEmail.isPending) {
                          return;
                        }
                        handleSendVerificationCode();
                      }}
                      className="w-fit p-1 border-teal-400 hover:border-teal-500 hover:text-teal-500 font-medium font-mono text-white flex items-center gap-2">
                      Gửi mã tới email
                      {mutationSendVerificationCodeEmail.isPending && (
                        <l-squircle
                          size="20"
                          stroke="4"
                          stroke-length="0.15"
                          bg-opacity="0.2"
                          speed="0.9"
                          color="#14b8a6"
                        />
                      )}
                    </button>
                    <p
                      className={`text-xs ${mutationSendVerificationCodeEmail.status === "success" ? "text-teal-500" : mutationSendVerificationCodeEmail.status === "error" ? "text-red-500" : ""}`}>
                      {showMessageVerificationCode}
                    </p>
                  </div>
                )}

                {registerTrue && (
                  <button
                    className={`p-2 text-xs md:text-base border-teal-400 text-teal-400 mb-6 transition-all duration-200 border rounded-md font-semibold hover:text-white`}
                    ref={refUpdate}
                    type="button"
                    onClick={() => setShowChoosePassword(!showChoosePassword)}>
                    <p className="flex justify-center uppercase">
                      Đổi mật khẩu
                    </p>
                  </button>
                )}

                {!registerTrue ? (
                  <div className="w-full mb-6 inputBox">
                    <input
                      className={`${errorsRegister.password ? "inputTagBug" : "inputTag"}`}
                      type="password"
                      required
                      {...registerRegister("password", {
                        required: "password",
                        minLength: {
                          value: 8,
                          message: "Ít nhất 8 kí tự",
                        },
                      })}
                    />

                    <span className={`spanTag`}>
                      {errorsRegister.password
                        ? errorsRegister.password.message
                        : "password"}
                    </span>
                  </div>
                ) : (
                  <>
                    {showChoosePassword && (
                      <>
                        <div className="w-full mb-6 inputBox">
                          <input
                            className={`${errorsUpdate.password ? "inputTagBug" : "inputTag"}`}
                            type="password"
                            required
                            {...registerUpdate("password", {
                              required: "old password",
                            })}
                          />

                          <span className={`spanTag`}>
                            {errorsUpdate.password
                              ? errorsUpdate.password.message
                              : "old password"}
                          </span>
                        </div>

                        <div className="w-full mb-6 inputBox">
                          <input
                            className={`${errorsUpdate.newPassword ? "inputTagBug" : "inputTag"}`}
                            type="password"
                            required
                            {...registerUpdate("newPassword", {
                              required: "New password",
                              minLength: {
                                value: 8,
                                message: "Ít nhất 8 kí tự",
                              },
                            })}
                          />
                          <span className={`spanTag`}>
                            {errorsUpdate.newPassword
                              ? errorsUpdate.newPassword.message
                              : "new password"}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            <div className="boxLogRes">
              {registerTrue ? (
                <>
                  <button
                    className={`styleLogin flex justify-center p-2`}
                    type="submit"
                    ref={refUpdate}>
                    {mutationUpdate.isPending ? (
                      <>
                        <l-bouncy size="30" speed="1.75" color="white" />
                      </>
                    ) : (
                      <p className="uppercase text-xs whitespace-normal md:text-base">
                        Cập nhật thông tin tài khoản
                        {showChoosePassword ? <span> & đổi mật khẩu</span> : ""}
                      </p>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    ref={refLogin}
                    className={`styleLogin`}
                    type="submit"
                    onClick={() => handleSwapClasses("Log")}>
                    <p className="h-fit p-2 text-xs md:text-base flex justify-center items-center uppercase">
                      {addSVG[0] && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4 md:size-6 animate-bounce-hozi">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      )}
                      {mutationLogin.isPending || mutationGet.isPending ? (
                        <l-bouncy size="30" speed="1.75" color="white" />
                      ) : (
                        "Đăng nhập"
                      )}
                    </p>
                  </button>
                  <button
                    ref={refRegister}
                    className={`styleRes`}
                    type="submit"
                    onClick={() => handleSwapClasses("Res")}>
                    <p className="h-fit p-2 text-xs md:text-base flex justify-center items-center uppercase">
                      {mutationRegister.isPending ? (
                        <l-bouncy size="35" speed="1.75" color="white" />
                      ) : (
                        "Đăng kí"
                      )}

                      {!addSVG[0] && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4 md:size-6 animate-bounce-hozi">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      )}
                    </p>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default memo(InterFaceLogin);
