import { useQuery, useMutation } from "@tanstack/react-query";
import { GetAll, Get } from "./API/ChuyenBay";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import ReactPaginate from "react-paginate";
import { useCallback, useEffect, useState } from "react";
import { Field, Label, Switch } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import { bouncy } from "ldrs";
import ItemInputRadio from "./ItemInputRadio";
import { convertDateToVNDate } from "./convertDateToVN";
import FormFlight from "./FormFlight";
import CatchErrorAPI from "./CatchErrorAPI";
import { formatDateInput } from "./formatDateInput";

function AdminChuyenBay() {
  bouncy.register();
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlights, setFlights] = useState(0);
  const [inputSearch, setInputSearch] = useState("");
  const [valueInputRadioSearch, setValueInputRadioSearch] = useState("_id");

  const {
    refetch,
    isLoading,
    error,
    data: flights,
  } = useQuery({
    queryKey: ["flights"],
    queryFn: GetAll,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (flights) {
      setTotalPage(flights?.data?.totalPage);
      setFlights(flights?.data?.flights);
    }
  }, [flights]);

  const mutationPageFlights = useMutation({
    mutationFn: GetAll,
    onSuccess: (response) => {
      setFlights(response?.data?.flights || []);
      setTotalPage(response.data.totalPage);
    },
  });

  const mutationGetFlights = useMutation({
    mutationFn: Get,
    onSuccess: (response) => {
      setCurrentPage(0);
      setTotalPage(0);
      setShowDetailFlight(null);
      setFlights(response?.data?.flight || []);
    },
  });

  const handleSearchFlights = () => {
    if (inputSearch.trim() === "") {
      return;
    }
    mutationGetFlights.mutate({
      value: inputSearch,
      type: valueInputRadioSearch,
    });
  };

  const handlePageClick = async (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(event.selected);
    await mutationPageFlights.mutate({
      page: selectedPage,
    });
  };

  const [isShowHideLoaiCB, setShowHideLoaiCB] = useState([true, true]);

  const handleShowHideLoaiCB = (index) => {
    setShowHideLoaiCB((pre) => {
      const arr = [...pre];
      arr[index] = !pre[index];
      return arr;
    });
  };

  const [isShowDetailFlight, setShowDetailFlight] = useState(null);

  const handleShowDetailFlight = useCallback(
    (index) => {
      setShowDetailFlight(isShowDetailFlight === index ? null : index);
    },
    [isShowDetailFlight]
  );

  const [enabledUpdate, setEnabledUpdate] = useState(false);

  if (isLoading || mutationPageFlights.isPending) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        <l-bouncy size="45" speed="1.75" color="white" />
      </div>
    );
  }
  if (error) {
    return (
      <div>
        Error: {JSON.stringify(error?.response?.data?.error || error.code)}
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="justify-center flex m-960">
        <h1 className="font-bold text-2xl">DANH SÁCH CHUYẾN BAY</h1>
      </div>
      <div className="p-2 w-11/12 m-auto flex">
        <input
          className="w-1/2 h-[40px] border-b rounded-md shadow-sm focus:outline-none border-b-gray-400 focus bg-transparent px-3"
          type="text"
          value={inputSearch}
          placeholder={valueInputRadioSearch}
          onChange={(e) =>
            setInputSearch(
              valueInputRadioSearch === "_id"
                ? e.target.value
                : formatDateInput(e.target.value)
            )
          }
          maxLength={valueInputRadioSearch === "_id" ? 30 : 10}
        />

        <button
          type="button"
          className="bg-blue-500 text-white font-medium rounded-md p-2 ml-3"
          onClick={() => handleSearchFlights()}
        >
          {mutationGetFlights.isPending ? (
            <l-bouncy size="30" speed="1.75" color="white" />
          ) : (
            "Tìm kiếm"
          )}
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white font-medium rounded-md p-2 ml-3"
          onClick={() => {
            setInputSearch("");
            setTotalPage(flights?.data?.totalPage);
            setCurrentPage(0);
            setShowDetailFlight(null);
            refetch();
          }}
        >
          Quay lại
        </button>
      </div>
      <div className="p-2 w-11/12 m-auto flex">
        <p className="mr-2">Tìm kiếm người dùng theo: </p>
        {Array.from({ length: 2 }, (_, i) => {
          const topics = ["id chuyến bay", "ngày bay"];
          const idInputs_htmlFor = ["_id", "ngaybay"];
          const nameInputs = ["searchFlight", "searchFlight"];
          return (
            <ItemInputRadio
              key={i}
              topic={topics[i]}
              idInput={idInputs_htmlFor[i]}
              htmlFor={idInputs_htmlFor[i]}
              nameInput={nameInputs[i]}
              valueInput={idInputs_htmlFor[i]}
              valueInputRadioSearch={valueInputRadioSearch}
              setValueInputRadioSearch={setValueInputRadioSearch}
            />
          );
        })}
      </div>

      {mutationGetFlights.isError || mutationPageFlights.isError ? (
        <CatchErrorAPI
          error={mutationGetFlights.error || mutationPageFlights.error}
        />
      ) : (
        <>
          {isFlights?.length > 0 ? (
            <>
              <div className="flex w-full">
                <table className="w-11/12 m-auto bg-transparent">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Nơi đi - Nơi đến</th>
                      <th>Thời gian đi</th>
                      <th>Giá</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFlights.map((flight, index) => (
                      <>
                        <tr
                          key={index}
                          className="cursor-pointer"
                          onClick={() => handleShowHideLoaiCB(index)}
                        >
                          <td colSpan={5} className="text-center">
                            <div className="flex w-full justify-center gap-x-5">
                              {flight._id}

                              {isShowHideLoaiCB[index] ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )}
                            </div>
                          </td>
                        </tr>
                        {isFlights[index].flights.map((flight_, index_) => (
                          <>
                            <tr
                              key={index_}
                              className={`transition-all duration-700 ease-in-out transform ${
                                isShowHideLoaiCB[index]
                                  ? ""
                                  : "hidden opacity-0"
                              }`}
                            >
                              <td>{index_ + 1}</td>
                              <td>
                                {flight_.diemBay} - {flight_.diemDen}
                              </td>
                              <td>
                                {flight_.ngayBay} {flight_.gioBay}
                              </td>
                              <td>{flight_.gia}</td>
                              <td className="">
                                <div>
                                  <button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={() => {
                                      handleShowDetailFlight(flight_._id);
                                    }}
                                  >
                                    Chi tiết
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {isShowDetailFlight === flight_._id && (
                              <tr className="h-fit mb-4">
                                <td className="col-span-4" colSpan={5}>
                                  <div className="mb-3">
                                    <div className="flex gap-x-4">
                                      <li>
                                        Thông tin chuyến bay {flight_._id}{" "}
                                      </li>{" "}
                                      <Field className="flex gap-x-4">
                                        <Label className="cursor-pointer">
                                          Update
                                        </Label>
                                        <Switch
                                          checked={enabledUpdate}
                                          onChange={setEnabledUpdate}
                                          className="group relative flex h-6 w-12 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                                        >
                                          <span
                                            aria-hidden="true"
                                            className="pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-6 group-data-[checked]:bg-zinc-800"
                                          />
                                        </Switch>
                                      </Field>
                                    </div>
                                    <div className="ml-6">
                                      <p>
                                        Loại chuyến bay: {flight_.loaiChuyenBay}{" "}
                                      </p>
                                      <p>
                                        Thời gian đến: {flight_.ngayDen}{" "}
                                        {flight_.gioDen}
                                      </p>
                                      <p>Hãng bay: {flight_.hangBay}</p>
                                      <p>
                                        Số ghế phổ thông còn{" "}
                                        {flight_.soGhePhoThong}
                                      </p>
                                      <p>
                                        Số ghế thương gia còn{" "}
                                        {flight_.soGheThuongGia}
                                      </p>
                                      <p>
                                        Trạng thái chuyến bay:{" "}
                                        {flight_.trangThaiChuyenBay}
                                      </p>
                                      <p>
                                        Thời gian tạo:{" "}
                                        {convertDateToVNDate(flight_.createdAt)}
                                      </p>
                                      <p>
                                        Thời gian cập nhật:{" "}
                                        {convertDateToVNDate(flight_.updatedAt)}
                                      </p>
                                    </div>
                                  </div>
                                  {enabledUpdate && (
                                    <FormFlight
                                      flight={flight_}
                                      setShowDetailFlight={setShowDetailFlight}
                                      typeAction="update"
                                    />
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <ReactPaginate
                className="flex justify-center gap-x-4 text-lg p-4"
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPage}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="bg-blue-500 text-white rounded-md w-7 h-full text-center"
                renderOnZeroPageCount={null}
                forcePage={currentPage}
              />
            </>
          ) : (
            <div className="w-full h-full justify-center items-center flex">
              <l-bouncy size="45" speed="1.75" color="white" />
            </div>
          )}
        </>
      )}
    </>
  );
}
export default AdminChuyenBay;
