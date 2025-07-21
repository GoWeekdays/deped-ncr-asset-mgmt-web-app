export default function useUtils() {
  const { currentUser } = useLocalAuth();
  const requiredRule = (v: string) => !!v || "This field is required";

  const emailRule = (v: string): true | string => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(v) || "Please enter a valid email address.";
  };

  const passwordRule = (v: string) =>
    v.length >= 8 || "Password must be at least 8 characters long.";

  const confirmPasswordRule = (
    newPassword: string,
    confirmPassword: string,
    passwordConfirmation: string
  ) => {
    return (
      (newPassword === confirmPassword && passwordConfirmation) ||
      "Passwords must match."
    );
  };

  const isNumber = (v: string) => !isNaN(parseFloat(v)) || "Must be a number";

  const goBack = () => {
    useRouter().go(-1);
  };

  const isFormValid = ref(false);

  // Pagination logic
  const usePagination = (itemsPerPage = 10) => {
    const currentPage = ref(1);
    const totalItems = ref(0);
    const pages = ref(0);

    const pageRange = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage.value * itemsPerPage, totalItems.value);
      if (totalItems.value === 0) {
        return "0 of 0";
      }
      return `${start}-${end} of ${totalItems.value}`;
    });

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    const updatePaginationData = (response: any) => {
      if (response.pageRange) {
        const parts = response.pageRange.split(" of ");
        totalItems.value = parseInt(parts[1]);
      }
      pages.value = response.pages || 0;
    };

    return {
      currentPage,
      totalItems,
      pages,
      pageRange,
      handlePageChange,
      updatePaginationData,
    };
  };

  function getOrigin() {
    return window.location.origin;
  }

  function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), wait);
    };
  }

  const isAdmin = computed(() => currentUser.value?.type === "admin");
  const isPersonnel = computed(() => currentUser.value?.type === "personnel");
  const isAdminHead = computed(() => currentUser.value?.type === "admin-head");
  const isOfficeChief = computed(
    () => currentUser.value?.type === "office-chief"
  );

  function getStatusColor(status: string): string {
    switch (status) {
      case "pending":
      case "returned":
        return "#F6A729";

      case "active":
      case "completed":
      case "accepted":
      case "good-condition":
      case "issued":
        return "#65AF4B";

      case "suspended":
      case "for-disposal":
      case "stolen":
      case "damaged":
      case "lost":
      case "destroyed":
      case "cancelled":
        return "#BD3333";

      case "approved":
      case "scheduled":
      case "rescheduled":
      case "reissued":
        return "primary";

      case "for-review":
        return "blue";

      case "transferred":
        return "#9747FF";

      case "for-evaluation":
        return "purple";

      default:
        return "grey";
    }
  }

  function formatToDate(isoDate: string): string {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  }

  const formatNumber = (value: any) => {
    return value
      ? Number(value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";
  };

  return {
    requiredRule,
    emailRule,
    passwordRule,
    confirmPasswordRule,
    isNumber,
    goBack,
    isFormValid,
    usePagination,
    getOrigin,
    debounce,

    isAdmin,
    isPersonnel,
    isAdminHead,
    isOfficeChief,

    getStatusColor,

    formatToDate,
    formatNumber,
  };
}
