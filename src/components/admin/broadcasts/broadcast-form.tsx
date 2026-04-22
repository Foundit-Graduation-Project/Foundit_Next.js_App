"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { broadcastSchema, BroadcastFormValues } from "@/lib/validations/broadcast.schema";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sendBroadcast, fetchBroadcasts } from "@/redux/features/broadcasts/broadcastsThunk";
import { resetSendSuccess } from "@/redux/features/broadcasts/broadcastsSlice";

const BROADCAST_CATEGORIES = [
  { value: "ALERT", label: "Alert" },
  { value: "SYSTEM", label: "System" },
  { value: "MATCH", label: "Match" },
  { value: "MESSAGE", label: "Message" },
] as const;

interface SendBroadcastDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SendBroadcastDialog({ isOpen, onClose, onSuccess }: SendBroadcastDialogProps) {
  const dispatch = useAppDispatch();
  const { loading, error, sendSuccess, lastSendResult } = useAppSelector(
    (state) => state.broadcasts
  );

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      category: "ALERT",
      title: "",
      message: "",
    },
  });

  const onSubmit = async (data: BroadcastFormValues) => {
    try {
      const resultAction = await dispatch(sendBroadcast(data));

      if (sendBroadcast.fulfilled.match(resultAction)) {
        toast.success("Broadcast sent successfully!");
        
        // Reset form
        form.reset();
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          dispatch(resetSendSuccess());
          onClose();
          onSuccess?.();
        }, 2000);

        // Refresh broadcasts list
        dispatch(fetchBroadcasts() as any);
      } else {
        const errorMsg = resultAction.payload as string;
        toast.error(errorMsg || "Failed to send broadcast");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] transition-all duration-300">
        <DialogHeader className="shrink-0 bg-linear-to-br from-blue-50/80 to-indigo-50/50 p-5 sm:p-8 border-b border-gray-100/50">
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Send Broadcast
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1.5 text-xs sm:text-sm leading-relaxed max-w-md">
            Send system-wide notifications to all active users on the platform
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white custom-scrollbar selection:bg-blue-100">
          {/* Success Message */}
          {sendSuccess && lastSendResult && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 mt-0.5">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 mb-1">Success!</h3>
                  <p className="text-sm text-green-700">
                    Delivered to{" "}
                    <span className="font-semibold">{lastSendResult.sent}</span> of{" "}
                    <span className="font-semibold">{lastSendResult.total}</span> user(s).
                    {lastSendResult.failed > 0 && (
                      <> ({lastSendResult.failed} failed)</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm uppercase tracking-wider">
                      Category
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BROADCAST_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm uppercase tracking-wider">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Maintenance Alert"
                        className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-sm uppercase tracking-wider">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your broadcast message..."
                        className="rounded-xl bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 min-h-30"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <div className="text-xs text-gray-500 mt-2">
                      {field.value?.length || 0} / 500 characters
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Alert */}
              {error && !sendSuccess && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">Error</p>
                    <p className="text-sm text-red-700 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Broadcast
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
