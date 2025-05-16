export default function useSchoolDivisions() {
  const loading = ref(false);
  const schoolDivisions = useState<TSchoolDivision[]>(
    "schoolDivisions  ",
    () => []
  );
  const error = ref<string | null>(null);
  const search = useState("school-search", () => "");
  const page = useState("school-page", () => 1);
  const pages = useState("school-pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const schoolDivision = useState(
    "schoolDivisions",
    (): TSchoolDivision => ({ _id: "", name: "" })
  );

  function setSchool(value?: TSchoolDivision) {
    if (!value) {
      schoolDivision.value = { _id: "", name: "" };
    } else {
      schoolDivision.value._id = value._id;
      schoolDivision.value.name = value.name;
    }
  }

  const getSchoolDivisions = async ({
    search = "",
    page = 1,
    limit = 10,
  } = {}) => {
    try {
      const response =
        await useNuxtApp().$api<TSchoolDivisionPaginatedResponse>(
          `/api/school-divisions`,
          {
            method: "GET",
            params: { search, page, limit },
          }
        );
      schoolDivisions.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
      return response;
    } catch (err) {
      error.value = "Error fetching schools";
      throw err;
    }
  };

  async function getSchoolDivisionById(
    officeId: string
  ): Promise<TSchoolDivision> {
    return useNuxtApp().$api<TSchoolDivision>(
      `/api/school-divisions/${officeId}`,
      {
        method: "GET",
      }
    );
  }
  const createSchoolDivision = async (
    value: TSchoolDivision
  ): Promise<void> => {
    return useNuxtApp().$api("/api/school-divisions", {
      method: "POST",
      body: JSON.stringify(value),
    });
  };

  function updateSchoolDivisionById(
    value: Omit<TSchoolDivision, "divisionName"> & { _id: string }
  ) {
    const { _id, ...bodyData } = value;

    if (!_id) {
      console.error("No school ID provided");
      throw new Error("School ID is required for updating a school.");
    }

    return useNuxtApp().$api(`/api/school-divisions/${_id}`, {
      method: "PUT",
      body: JSON.stringify(bodyData),
    }); 
  }

  function deleteSchoolDivisionById(id: string) {
    return useNuxtApp().$api(`/api/school-divisions/${id}`, {
      method: "DELETE",
    });
  }

  return {
    loading,
    schoolDivisions,
    error,
    search,
    page,
    pages,
    pageRange,
    schoolDivision,
    setSchool,
    getSchoolDivisions,
    getSchoolDivisionById,
    createSchoolDivision,
    updateSchoolDivisionById,
    deleteSchoolDivisionById,
  };
}
