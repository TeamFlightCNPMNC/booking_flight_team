import PropTypes from "prop-types";

function FallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div className="p-4">
      <h2>Đã có lỗi xảy ra!</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Thử lại</button>
    </div>
  );
}
FallbackComponent.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};
export default FallbackComponent;
