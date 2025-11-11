import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function notify(type, content) {
  if (type === "Success") {
    return toast.success(content, {
      position: "top-right",
    });
  }
  if (type === "Error") {
    return toast.error(content, {
      position: "top-right",
    });
  }
  if (type === "Warn") {
    return toast.warn(content, {
      position: "top-right",
    });
  }
  if (type === "Info") {
    return toast.info(content, {
      position: "top-right",
    });
  }
}

export default notify;
