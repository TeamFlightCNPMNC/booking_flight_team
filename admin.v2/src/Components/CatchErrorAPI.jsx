import PropTypes from "prop-types";

function CatchErrorAPI({ error, handleAgain }) {
  return (
    <div className="bg-zinc-800 p-3 text-red-600">
      <p className="uppercase tracking-widest">Lỗi !!!</p>
      <p>Code: {error?.code}</p>
      <p>response: {error?.response?.config?.url}</p>
      <div>
        <p>message: {error?.response?.data?.message}</p>
        <p>
          error:{" "}
          {error?.response?.data?.error?.message ||
            error?.response?.data?.error ||
            error?.response?.data?.errors ||
            "Không có error"}
        </p>
      </div>
      {handleAgain && (
        <button
          className="text-white p-2 rounded-lg border border-red-600"
          onClick={() => {
            handleAgain();
          }}
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
CatchErrorAPI.propTypes = {
  error: PropTypes.object,
  handleAgain: PropTypes.func,
};
export default CatchErrorAPI;
