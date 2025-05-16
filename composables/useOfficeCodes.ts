export default function useOffice() {
  const loading = ref(false);
  const offices = useState<TOffice[]>("offices  ", () => []);
  const error = ref<string | null>(null);
  const search = useState("office-search", () => "");
  const page = useState("office-page", () => 1);
  const pages = useState("office-pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const officeCode = useState(
    "offices",
    (): TOffice => ({
      _id: "",
      name: "",
      email: "",
      divisionId: "",
      supervisorId: "",
      supervisorName: "",
    })
  );

  function setOfficeCode(value?: TOffice) {
    if (!value) {
      officeCode.value = {
        _id: "",
        email: "",
        name: "",
        divisionId: "",
        supervisorId: "",
        supervisorName: "",
      };
    } else {
      officeCode.value._id = value._id;
      officeCode.value.email = value.email;
      officeCode.value.name = value.name;
      officeCode.value.divisionId = value.divisionId;
      officeCode.value.supervisorId = value.supervisorId;
      officeCode.value.supervisorName = value.supervisorName;
    }
  }

  async function getOffices({ page = 1, search = "", limit = 10 } = {}) {
    try {
      const response = await useNuxtApp().$api<TOfficePaginatedResponse>(
        "/api/offices",
        {
          method: "GET",
          query: { page, search, limit },
        }
      );
      offices.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
    } catch (err) {
      error.value = "Failed to fetch waste and materials.";
      console.error(err);
    }
  }

  async function getOfficeTypes({ type = "" } = {}) {
    try {
      const response = await useNuxtApp().$api<TOfficeResponse>(
        "/api/offices/list",
        {
          method: "GET",
          query: { type },
        }
      );
      offices.value = response.items;
    } catch (err) {
      error.value = "Failed to fetch waste and materials.";
      console.error(err);
    }
  }

  async function getOfficeById(officeId: string): Promise<TOffice> {
    return useNuxtApp().$api<TOffice>(`/api/offices/id/${officeId}`, {
      method: "GET",
    });
  }
  const createOffice = async (value: TOffice): Promise<void> => {
    return useNuxtApp().$api("/api/offices", {
      method: "POST",
      body: JSON.stringify(value),
    });
  };

  function updateOfficeById(id: string, value: Omit<TOffice, "_id">) {
    return useNuxtApp().$api(`/api/offices/${id}`, {
      method: "PUT",
      body: JSON.stringify(value),
    });
  }

  function deleteOfficeById(id: string) {
    return useNuxtApp().$api(`/api/offices/${id}`, {
      method: "DELETE",
    });
  }

  return {
    loading,
    offices,
    error,
    search,
    page,
    pages,
    pageRange,
    officeCode,
    setOfficeCode,
    getOffices,
    getOfficeTypes,
    getOfficeById,
    createOffice,
    updateOfficeById,
    deleteOfficeById,
  };
}
