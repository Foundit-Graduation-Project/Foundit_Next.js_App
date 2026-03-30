import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Eye, 
  EyeOff, 
  Loader2,
  MapPin
} from "lucide-react";

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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersApi } from "@/lib/api/users.api";
import { communitiesApi } from "@/lib/api/communities.api";

const userFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "community_admin"]),
  community: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface AddUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddUserForm({ isOpen, onClose, onSuccess }: AddUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [communities, setCommunities] = useState<any[]>([]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      community: "",
    },
  });

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await communitiesApi.getCommunities();
        // Backend returns { status, data: { communities: [...] } }
        const data = res.data?.communities || res.communities || (Array.isArray(res.data) ? res.data : []);
        setCommunities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      }
    };
    if (isOpen) fetchCommunities();
  }, [isOpen]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      // Clean up the data: if role is not community_admin, don't send community
      const payload = { ...data };
      if (payload.role !== "community_admin") {
        delete payload.community;
      } else if (!payload.community) {
        // If community_admin but no community selected, send null or empty
        payload.community = undefined;
      }

      await usersApi.createUser(payload);
      toast.success("User created successfully");
      form.reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] transition-all duration-300">
        <DialogHeader className="shrink-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-5 sm:p-8 border-b border-gray-100/50">
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Add New User</DialogTitle>
          <DialogDescription className="text-gray-500 mt-1.5 text-xs sm:text-sm leading-relaxed max-w-md">
            Assign proper permissions and credentials. Manual accounts are immediately active by default.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white custom-scrollbar selection:bg-blue-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8" autoComplete="off">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                {/* Personal Information Section */}
                <div className="space-y-5">
                  <div className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.15em] mb-2 border-b border-blue-50 pb-1.5 pl-1">
                    Personal Details
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-gray-600 text-[11px] font-bold uppercase tracking-wider pl-1">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <Input placeholder="John Doe" className="pl-9 h-11 border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl transition-all" disabled={loading} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-medium text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-gray-600 text-[11px] font-bold uppercase tracking-wider pl-1">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <Input type="email" placeholder="john@example.com" className="pl-9 h-11 border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl transition-all" disabled={loading} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-medium text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Account Setup Section */}
                <div className="space-y-5">
                  <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.15em] mb-2 border-b border-indigo-50 pb-1.5 pl-1">
                    Security & Permissions
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-gray-600 text-[11px] font-bold uppercase tracking-wider pl-1">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              className="pl-9 pr-10 h-11 border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl transition-all" 
                              disabled={loading}
                              autoComplete="new-password"
                              {...field} 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-medium text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-gray-600 text-[11px] font-bold uppercase tracking-wider pl-1">Role</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <Shield className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                              </div>
                              <SelectTrigger className="pl-9 h-11 border-gray-100 bg-gray-50/30 focus:bg-white ring-offset-0 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl transition-all">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent className="rounded-xl border-gray-100 shadow-2xl p-1">
                            <SelectItem value="user" className="rounded-lg h-10">User</SelectItem>
                            <SelectItem value="community_admin" className="rounded-lg h-10">Community Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] font-medium text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("role") === "community_admin" && (
                    <FormField
                      control={form.control}
                      name="community"
                      render={({ field }: { field: any }) => (
                        <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-1.5">
                          <FormLabel className="text-gray-600 text-[11px] font-bold uppercase tracking-wider pl-1">Assigned Community</FormLabel>
                          <Select
                            disabled={loading || communities.length === 0}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                  <MapPin className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <SelectTrigger className="pl-9 h-11 border-gray-100 bg-gray-50/30 focus:bg-white ring-offset-0 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl transition-all">
                                  <SelectValue placeholder={
                                  communities.length > 0 ? "Choose..." : 
                                  loading ? "Loading..." : "No communities found"
                                } />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent className="rounded-xl border-gray-100 shadow-2xl p-1 max-h-[220px]">
                              {communities.map((c) => (
                                <SelectItem key={c._id} value={c._id} className="rounded-lg h-10">
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-medium text-red-500" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={loading}
                  className="w-full sm:w-auto order-2 sm:order-1 rounded-xl border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 h-12 sm:h-11 px-6 font-bold transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto order-1 sm:order-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-12 sm:h-11 px-10 font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create User"
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
