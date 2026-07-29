import { logout } from "@/store/features/authSlice";
import { AppDispatch } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export const useLogout = () => {
    const dispatch = useDispatch<AppDispatch>();
    const queryClient = useQueryClient();

    const handleLogout = useCallback(() => {
        queryClient.clear();
        dispatch(logout());
    }, [dispatch, queryClient]);

    return { logout: handleLogout };
};
