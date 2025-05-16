export default function usePersonnelCard() {
  const loading = ref(false);
  const personnels = useState<TOfficeProperty[]>("personnels", () => []);
  const error = ref<string | null>(null);

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");
  const search = useState("search", () => "");

  const personnel = useState<TPersonnelCard>("personnel", () => {
    return {
      _id: "",
      email: "",
      type: "",
      status: "",
      attachment: "",
      name: "",
      items: [] as TPersonnelStockCard[],
      sepCount: "",
      ppeCount: "",
      pageRange: "",
      pages: 0,
    } as TPersonnelCard;
  });

  function setOfficeProperty(value?: TPersonnelCard) {
    if (!value) {
      value = {
        _id: "",
        email: "",
        type: "",
        status: "",
        attachment: "",
        name: "",
        items: [] as TPersonnelStockCard[],
        sepCount: "",
        ppeCount: "",
        pageRange: "",
        pages: 0,
      };
    }

    personnel.value._id = value._id;
    personnel.value.email = value.email;
    personnel.value.type = value.type;
    personnel.value.status = value.status;
    personnel.value.attachment = value.attachment;
    personnel.value.name = value.name;
    personnel.value.items = value.items || [];
    personnel.value.sepCount = value.sepCount;
    personnel.value.ppeCount = value.ppeCount;
  }

  async function getPersonnelById({
    personnelId = "",
    page = 1,
    limit = 10,
    search = "",
  } = {}) {
    try {
      const response = await useNuxtApp().$api<TPersonnelCard>(
        `/api/stocks/personnel-stock-card/${personnelId}`,
        { method: "GET", query: { page, limit, search } }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  return {
    loading,
    personnels,
    error,
    page,
    pages,
    pageRange,
    search,
    personnel,
    setOfficeProperty,

    getPersonnelById,
  };
}
