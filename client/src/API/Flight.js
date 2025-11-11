import axios from "../Components/Utils/authAxios.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const SearchFlights = async ({ queryKey }) => {
  const [_key, { searchParams }] = queryKey;

  const response = await axios.get(`/flights/search?${searchParams}`);
  if (response.status === 200) {
    if (response?.data?.payment !== null) {
      const payment = response?.data?.payment?.split(" ");
      localStorage.setItem(
        "payment",
        JSON.stringify(`${payment[0]} ${payment[1]}`)
      );
    } else {
      localStorage.removeItem("payment");
    }
    return response.data?.flights;
  } else {
    throw new Error("Failed to fetch flights");
  }
};

export const useSearchFlights = ({ searchParams }) => {
  return useQuery({
    queryKey: [
      "flights",
      {
        searchParams,
      },
    ],
    queryFn: SearchFlights,
    retry: false,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
  });
};

export const GheMaSoGhe = async ({ idFlight }) => {
  return await axios.post("/flights/get/soghe", { idFlight });
};
