import ReactLoading from "react-loading";
//////
function Loading() {
  return (
    <div className="w-screen h-screen fixed z-[500]">
      <ReactLoading
        className="fixed z-[500] transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
        type="bubbles"
        color="#2563eb"
        height={100}
        width={100}
      />
    </div>
  );
}
export default Loading;
