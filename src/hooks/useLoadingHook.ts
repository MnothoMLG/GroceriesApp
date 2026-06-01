import { useSelector } from "react-redux";
import { createLoadingSelector } from "@store/loading/selectors";

export const useLoading = (...loadingActions: string[]) => {
  return useSelector(createLoadingSelector(loadingActions));
};
