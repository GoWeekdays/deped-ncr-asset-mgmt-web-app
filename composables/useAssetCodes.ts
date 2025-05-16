export default function useAssetCodes() {
  const items: Ref<TCodes[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const search = useState("code-search", () => "");
  const page = useState("code-page", () => 1);
  const pages = useState("code-pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const assetCode = useState(
    "asset-code",
    (): TAssetCode => ({ code: "", value: "", email: "", type: "", year: 0 })
  );

  function setAssetCode(value?: TAssetCode) {
    if (!value) {
      assetCode.value = { code: "", value: "", email: "", type: "", year: 0 };
      return;
    }

    assetCode.value = {
      ...assetCode.value,
      ...value,
    };
  }

  const assetCodes = useState("asset-codes", (): Array<TAssetCode> => []);

  function createAssetCode(value: TAssetCode) {
    return useNuxtApp().$api("/api/asset-codes", {
      method: "POST",
      body: JSON.stringify(value),
    });
  }

  function getAssetCodesByType({
    type = "",
    search = "",
    page = 1,
    limit = 10,
  } = {}) {
    return useNuxtApp().$api<TKeyValuePair>(`/api/asset-codes/${type}`, {
      method: "GET",
      params: { search, page, limit, type },
    });
  }

  const serialCodes = useState("serialCodes", (): Array<TAssetCode> => []);
  async function getSerialCodes() {
    try {
      const res = await getAssetCodesByType({ type: "serial-code", limit: 30 });
      serialCodes.value = res.items;
    } catch (error) {
      console.log(error);
    }
  }
  const SEPCodes = useState("SEPCodes", (): Array<TAssetCode> => []);
  async function getSepCodes() {
    try {
      const res = await getAssetCodesByType({ type: "sep-code", limit: 30 });
      SEPCodes.value = res.items;
    } catch (error) {
      console.log(error);
    }
  }

  const PPECodes = useState("PPECodes", (): Array<TAssetCode> => []);
  async function getPpeCodes() {
    try {
      const res = await getAssetCodesByType({ type: "ppe-code", limit: 30 });
      PPECodes.value = res.items;
    } catch (error) {
      console.log(error);
    }
  }

  const locationCodes = useState("locationCodes", (): Array<TAssetCode> => []);
  async function getLocationCodes() {
    try {
      const res = await getAssetCodesByType({
        type: "location-code",
        limit: 30,
      });
      locationCodes.value = res.items;
    } catch (error) {
      console.log(error);
    }
  }

  function itemProps(item: TAssetCode) {
    return {
      title: item.code,
      subtitle: item.value,
      value: item.code,
    };
  }

  function updateAssetCodeById(id: string, value: Omit<TAssetCode, "_id">) {
    return useNuxtApp().$api(`/api/asset-codes/${id}`, {
      method: "PUT",
      body: JSON.stringify(value),
    });
  }

  function deleteAssetCodeById(id: string) {
    return useNuxtApp().$api(`/api/asset-codes/${id}`, {
      method: "DELETE",
    });
  }

  return {
    search,
    page,

    pages,
    pageRange,
    assetCode,
    setAssetCode,
    assetCodes,
    createAssetCode,
    getAssetCodesByType,
    updateAssetCodeById,
    deleteAssetCodeById,
    serialCodes,
    SEPCodes,
    PPECodes,
    locationCodes,
    itemProps,
    // revisions

    getSerialCodes,
    getSepCodes,
    getPpeCodes,
    getLocationCodes,
    items,
    loading,
    error,
  };
}
