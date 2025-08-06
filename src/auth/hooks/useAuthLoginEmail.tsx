import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthSubscriptionType, AuthUserType, Types } from "@/auth/types";
import http, { endpoints } from "@/services/api";

import { STORAGE_KEY } from "../context/authProvider";

import { useAuthContext } from "./useAuthContext";

interface SignInEmailResponse {
  data: {
    access_token: string;
  };
}

export const useLoginWithEmail = (): UseMutationResult<
  SignInEmailResponse,
  Error,
  {
    email: string;
    password: string;
  },
  unknown
> => {
  const navigate = useNavigate();

  const { dispatch } = useAuthContext();

  return useMutation({
    onSuccess: async (res) => {
      localStorage.setItem(STORAGE_KEY, res.data.access_token);

      const { data } = await http.get<{
        data: AuthUserType;
      }>(endpoints.auth.me);

      const { data: subscription } = await http
        .get<{
          data: AuthSubscriptionType;
        }>(endpoints.auth.subscriptions)
        .then((subscriptionRes) => subscriptionRes.data);

      dispatch({
        type: Types.INITIAL,
        payload: {
          user: {
            ...data.data,
            accessToken: res.data.access_token,
            subscription: subscription && {
              ...subscription,
              total_credits:
                subscription.monthly_credits.remaining +
                subscription.purchased_credits.remaining,
            },
          },
        },
      });

      toast.success("Successfully signed in!");

      navigate("/");
    },

    mutationFn: ({ email, password }: { email: string; password: string }) =>
      http
        .post<{
          data: {
            access_token: string;
          };
        }>(endpoints.auth.login_with_email, { email, password })
        .then((res) => res.data),
  });
};
