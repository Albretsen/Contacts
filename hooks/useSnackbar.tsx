import { useContext } from "react";
import { SnackbarContext } from "../providers/SnackbarProvider";

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};