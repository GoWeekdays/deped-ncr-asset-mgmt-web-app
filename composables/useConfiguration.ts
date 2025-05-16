export default function useConfiguration() {
  const loading = ref(false);
  const configurations = useState<TConfiguration[]>(
    "configurations  ",
    () => []
  );

  const error = ref<string | null>(null);
  const search = useState("configuration-search", () => "");
  const page = useState("configuration-page", () => 1);
  const pages = useState("configuration-pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const configurationCode = useState(
    "configurations",
    (): TConfiguration => ({ _id: "", name: "", value: "" })
  );

  function setConfigurationCode(value?: TConfiguration) {
    if (!value) {
      configurationCode.value = { _id: "", value: "", name: "" };
    } else {
      configurationCode.value._id = value._id;
      configurationCode.value.value = value.value;
      configurationCode.value.name = value.name;
    }
  }

  const getConfigurations = async ({
    search = "",
    page = 1,
    limit = 10,
  } = {}): Promise<ApiResponse> => {
    try {
      const response = await useNuxtApp().$api<ApiResponse>(
        "/api/configurations",
        {
          method: "GET",
          params: { search, page, limit },
        }
      );
      configurations.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
      return response;
    } catch (err) {
      error.value = "Error fetching configuration   ";
      throw err;
    }
  };

  const createConfiguration = async (value: TConfiguration): Promise<void> => {
    return useNuxtApp().$api("/api/configurations", {
      method: "POST",
      body: JSON.stringify(value),
    });
  };

  function updateConfigurationById(value: TConfiguration) {
    return useNuxtApp().$api<TStandardPaginatedResponse>(
      `/api/configurations/${value._id}`,
      {
        method: "PUT",
        body: JSON.stringify(value),
      }
    );
  }

  function deleteConfigurationById(id: string) {
    return useNuxtApp().$api(`/api/configurations/${id}`, {
      method: "DELETE",
    });
  }

  return {
    loading,
    configurations,
    error,
    search,
    page,
    pages,
    pageRange,
    configurationCode,
    setConfigurationCode,
    getConfigurations,
    createConfiguration,
    updateConfigurationById,
    deleteConfigurationById,
  };
}
