export default function useOfficeProperty() {
  const loading = ref(false);
  const officeProperties = useState<TOfficeProperty[]>(
    "officeProperties  ",
    () => []
  );
  const error = ref<string | null>(null);

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");
  const search = useState("search", () => "");

  const officeProperty = useState<TOfficeProperty>("officeProperty", () => {
    return {
      _id: "",
      officeName: "",
      officerName: "",
      officerEmail: "",
      divisionName: "",
      items: [] as TItemStock[],
      name: "",
      address: "",
      contactNumber: "",
      email: "",
      website: "",
      status: "for-evaluation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalItemsOwned: "",
      pageRange: "",
      pages: 0,
    } as TOfficeProperty;
  });

  function setOfficeProperty(value?: TOfficeProperty) {
    if (!value) {
      value = {
        _id: "",
        officeName: "",
        officerName: "",
        officerEmail: "",
        divisionName: "",
        items: [],
        name: "",
        address: "",
        contactNumber: "",
        email: "",
        website: "",
        status: "for-evaluation",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalItemsOwned: "",
        pageRange: "",
        pages: 0,
      };
    }

    officeProperty.value._id = value._id;
    officeProperty.value.officeName = value.officeName;
    officeProperty.value.officerName = value.officerName;
    officeProperty.value.officerEmail = value.officerEmail;
    officeProperty.value.divisionName = value.divisionName;
    officeProperty.value.items = value.items || [];
    officeProperty.value.name = value.name;
    officeProperty.value.address = value.address;
    officeProperty.value.contactNumber = value.contactNumber;
    officeProperty.value.email = value.email;
    officeProperty.value.website = value.website;
    officeProperty.value.status = value.status || "for-evaluation";
    officeProperty.value.createdAt =
      value.createdAt || new Date().toISOString();
    officeProperty.value.updatedAt =
      value.updatedAt || new Date().toISOString();
    officeProperty.value.totalItemsOwned = value.totalItemsOwned;
  }

  async function getOfficePropertyById({
    officeId = "",
    page = 1,
    limit = 10,
    search = "",
  }) {
    try {
      const response = await useNuxtApp().$api<TOfficeProperty>(
        `/api/stocks/property/${officeId}`,
        { method: "GET", query: { page, limit, search } }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  return {
    loading,
    officeProperties,
    error,
    page,
    pages,
    pageRange,
    search,
    officeProperty,
    setOfficeProperty,
    getOfficePropertyById,
  };
}
