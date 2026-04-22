import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { connectSocket, getSocket } from "@/lib/socket";
import { setBroadcasts } from "@/redux/features/broadcasts/broadcastsSlice";
import { fetchBroadcasts } from "@/redux/features/broadcasts/broadcastsThunk";
import toast from "react-hot-toast";

export const useSocketBroadcasts = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    // Get token
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) return;

    // Connect socket
    const socket = connectSocket(token);

    // Listen for broadcast events
    socket?.on("broadcast", (data: any) => {
      console.log("[Socket] Broadcast received:", data);
      
      // Show toast notification
      toast.success(`📢 ${data.title}`, {
        duration: 5,
        icon: "📢",
      });

      // Refresh broadcasts list
      dispatch(fetchBroadcasts() as any);
    });

    // Listen for broadcast sent event (for admin who just sent it)
    socket?.on("broadcastSent", (data: any) => {
      console.log("[Socket] Your broadcast was sent:", data);
      dispatch(fetchBroadcasts() as any);
    });

    return () => {
      socket?.off("broadcast");
      socket?.off("broadcastSent");
    };
  }, [user, dispatch]);
};
