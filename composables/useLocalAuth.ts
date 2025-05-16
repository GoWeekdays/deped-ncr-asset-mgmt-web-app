export default function useLocalAuth() {
  const config = useRuntimeConfig();
  const cookieOptions = config.public.cookieConfig;

  const currentUser = useState<TUser | null>("currentUser", () => null);

  async function login({ email = "", password = "", role = "" }) {
    try {
      return await useNuxtApp().$api<TToken>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
    } catch (error) {
      throw error;
    }
  }

  function setToken({ refreshToken = "", accessToken = "", user = "" }) {
    useCookie("accessToken", cookieOptions).value = accessToken;
    useCookie("refreshToken", cookieOptions).value = refreshToken;
    useCookie("user", cookieOptions).value = user;
  }

  function clearCookies() {
    useCookie("accessToken", cookieOptions).value = null;
    useCookie("refreshToken", cookieOptions).value = null;
    useCookie("user", cookieOptions).value = null;
    useCookie("organization", cookieOptions).value = null;
  }

  async function logout() {
    try {
      const refreshToken = useCookie("refreshToken").value;

      await useNuxtApp().$api(`/api/auth/logout/${refreshToken}`, {
        method: "DELETE",
      });

      clearCookies();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  async function getCurrentUser() {
    if (!currentUser.value) {
      const userId = useCookie("user").value;
      if (userId) {
        try {
          const user = await useNuxtApp().$api<TUser>(`/api/users/${userId}`, {
            method: "GET",
          });
          currentUser.value = user;
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      }
    }
    return currentUser.value;
  }

  async function requestPasswordReset(email: string) {
    if (!email) {
      throw new Error("Email is required for password reset request.");
    }

    try {
      const response = await useNuxtApp().$api("/api/auth/forget-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      return response;
    } catch (error) {
      console.error("Error in password reset request:", error);
      throw error;
    }
  }

  async function resetPasswordRequest(
    otp: string,
    newPassword: string,
    passwordConfirmation: string
  ) {
    try {
      return await useNuxtApp().$api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ otp, newPassword, passwordConfirmation }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  async function updatePassword(
    _id: string,
    oldPassword: string,
    newPassword: string,
    passwordConfirmation: string
  ) {
    try {
      return await useNuxtApp().$api(`/api/users/update-password/${_id}`, {
        method: "PUT",
        body: JSON.stringify({
          oldPassword,
          newPassword,
          passwordConfirmation,
        }),
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  async function sendUpdateOtp(email: string) {
    if (!email) {
      throw new Error("Email is required for password reset request.");
    }

    try {
      const response = await useNuxtApp().$api("/api/users/email-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      console.error("Error in password reset request:", error);
      throw error;
    }
  }

  async function verifyUpdateEmailOtp(currentUser: TUser | null, otp: string) {
    if (!currentUser || !currentUser._id || !otp) {
      throw new Error("User ID and OTP are required for verification.");
    }

    const { _id } = currentUser;

    try {
      const response = await useNuxtApp().$api(`/api/users/verify-otp/${_id}`, {
        method: "POST",
        body: JSON.stringify({ otp }),
      });

      console.log("OTP verified successfully", response);
      return response;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  return {
    login,
    logout,
    clearCookies,
    getCurrentUser,
    setToken,
    requestPasswordReset,
    resetPasswordRequest,
    currentUser,
    updatePassword,
    sendUpdateOtp,

    verifyUpdateEmailOtp,
  };
}
