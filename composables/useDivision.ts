export default function useDivision() {
  const loading = ref(false);
  const divisions = useState<TDivision[]>("divisions  ", () => []);
  const error = ref<string | null>(null);
  const search = useState("division-search", () => "");
  const page = useState("division-page", () => 1);
  const pages = useState("division-pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const division = useState(
    "divisions",
    (): TDivision => ({ _id: "", name: "", email: "" })
  );

  function setDivision(value?: TDivision) {
    if (!value) {
      division.value = { _id: "", email: "", name: "" };
    } else {
      division.value._id = value._id;
      division.value.email = value.email;
      division.value.name = value.name;
    }
  }

  const divisionType = (useRoute().params.type as string) ?? "";

  const isDivision = computed(() => divisionType === "deped-divisions");
  const isSchool = computed(() => divisionType === "school-divisions");

  const getDivisions = async ({ search = "", page = 1, limit = 10 } = {}) => {
    try {
      const response = await useNuxtApp().$api<TDivisionPaginatedResponse>(
        `/api/divisions`,
        {
          method: "GET",
          params: { search, page, limit },
        }
      );
      divisions.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
      return response;
    } catch (err) {
      error.value = "Error fetching divisions";
      throw err;
    }
  };

  const getDepedDivision = async ({
    search = "",
    page = 1,
    limit = 10,
  } = {}) => {
    try {
      const response = await useNuxtApp().$api<TDivisionPaginatedResponse>(
        `/api/divisions`,
        {
          method: "GET",
          params: { search, page, limit },
        }
      );
      divisions.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
      return response;
    } catch (err) {
      error.value = "Error fetching divisions";
      throw err;
    }
  };

  async function getDivisionById(officeId: string): Promise<TDivision> {
    return useNuxtApp().$api<TDivision>(`/api/divisions/id/${officeId}`, {
      method: "GET",
    });
  }
  const createDivision = async (value: TDivision): Promise<void> => {
    return useNuxtApp().$api("/api/divisions", {
      method: "POST",
      body: JSON.stringify(value),
    });
  };

  function updateDivisionById(
    value: Omit<TDivision, "divisionName"> & { _id: string }
  ) {
    const { _id, ...bodyData } = value;

    if (!_id) {
      console.error("No school ID provided");
      throw new Error("School ID is required for updating a school.");
    }

    return useNuxtApp().$api(`/api/divisions/${_id}`, {
      method: "PUT",
      body: JSON.stringify(bodyData),
    });
  }

  function deleteDivisionById(id: string) {
    return useNuxtApp().$api(`/api/divisions/${id}`, {
      method: "DELETE",
    });
  }

  return {
    loading,
    divisions,
    error,
    isDivision,
    isSchool,
    divisionType,
    search,

    page,

    pages,
    pageRange,
    division,
    setDivision,
    getDivisions,
    getDepedDivision,

    getDivisionById,
    createDivision,
    updateDivisionById,
    deleteDivisionById,
  };
}
