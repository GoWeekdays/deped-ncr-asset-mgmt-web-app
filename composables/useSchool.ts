export default function useSchool() {
  const loading = ref(false);
  const schools = useState<TSchool[]>("schools  ", () => []);
  const error = ref<string | null>(null);
  const search = useState("school-search", () => "");
  const page = useState("school-page", () => 1);
  const pages = useState("school-pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const school = useState(
    "schools",
    (): TSchool => ({ _id: "", name: "", divisionId: "", divisionName: "" })
  );

  function setSchoolCode(value?: TSchool) {
    if (!value) {
      school.value = { _id: "", name: "", divisionId: "", divisionName: "" };
    } else {
      school.value._id = value._id;
      school.value.divisionId = value.divisionId;
      school.value.divisionName = value.divisionName;
      school.value.name = value.name;
    }
  }

  const getSchools = async ({
    search = "",
    page = 1,
    limit = 10,
    divisionId = "",
  } = {}): Promise<ApiResponse> => {
    try {
      const response = await useNuxtApp().$api<ApiResponse>("/api/schools", {
        method: "GET",
        params: { search, page, limit, divisionId },
      });
      schools.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
      return response;
    } catch (err) {
      error.value = "Error fetching school   ";
      throw err;
    }
  };

  async function getSchoolById(officeId: string): Promise<TSchool> {
    return useNuxtApp().$api<TSchool>(`/api/schools/id/${officeId}`, {
      method: "GET",
    });
  }
  const createSchool = async (value: TSchool): Promise<void> => {
    return useNuxtApp().$api("/api/schools", {
      method: "POST",
      body: JSON.stringify(value),
    });
  };

  function updateSchoolById(
    value: Omit<TSchool, "divisionName"> & { _id: string }
  ) {
    const { _id, ...bodyData } = value;

    if (!_id) {
      console.error("No school ID provided");
      throw new Error("School ID is required for updating a school.");
    }

    return useNuxtApp().$api(`/api/schools/${_id}`, {
      method: "PUT",
      body: JSON.stringify(bodyData),
    });
  }

  function deleteSchoolById(id: string) {
    return useNuxtApp().$api(`/api/schools/${id}`, {
      method: "DELETE",
    });
  }

  return {
    loading,
    schools,
    error,
    search,
    page,
    pages,
    pageRange,
    school,
    setSchoolCode,
    getSchools,
    getSchoolById,
    createSchool,
    updateSchoolById,
    deleteSchoolById,
  };
}
