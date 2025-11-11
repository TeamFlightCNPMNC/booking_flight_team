import { useEffect } from "react";
import "../index.css";
import { Link } from "react-router";

function Page404() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const torch = document.querySelector(".torch-page-not-find");
      if (torch) {
        const boundingBox = torch.parentElement.getBoundingClientRect();
        torch.style.top = `${e.clientY - boundingBox.top}px`;
        torch.style.left = `${e.clientX - boundingBox.left}px`;
      }
    };

    const container = document.querySelector(".page-not-found-container");
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <>
      <div className="page-not-found-container">
        <div className="page-not-found">
          <h1>404</h1>
          <h2>Uh, Ohh</h2>
          <h3>Sorry, we can't find what you are looking for</h3>
        </div>
        <Link to="/home" className="mt-5">
          Back to home
        </Link>
        <div className="torch-page-not-find"></div>
      </div>
    </>
  );
}

export default Page404;
