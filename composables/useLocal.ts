export default function () {
  const navigationItems = computed(() => {
    const items: TNavigationItem[] = [];
    const { isAdmin, isPersonnel, isOfficeChief, isAdminHead } = useUtils();
    if (isAdmin.value || isAdminHead.value) {
      items.push({
        title: "Dashboard",
        icon: "mdi-view-dashboard-outline",
        route: {
          name: "dashboard",
        },
      });
    }

    if (isAdmin.value || isAdminHead.value) {
      items.push({
        title: "Assets",
        icon: "mdi-archive-outline",

        children: [
          {
            title: "Consumables",
            icon: "mdi-package-variant-closed",
            route: {
              name: "assets-consumables",
            },
          },
          {
            // title: "Semi-Expendable Property",
            title: "SEP",
            icon: "mdi-package-variant-closed",
            route: {
              name: "assets-property",
              params: { property: "semi-expandable-property" },
            },
          },
          {
            // title: "Property, Plant and Equipment",
            title: "PPE",
            icon: "mdi-package-variant-closed",
            route: {
              name: "assets-property",
              params: { property: "property-plant-and-equipment" },
            },
          },
        ],
      });
    }

    const { currentUser } = useLocalAuth();

    if (
      (isPersonnel.value || isOfficeChief.value) &&
      !isAdmin.value &&
      !isAdminHead.value &&
      currentUser.value
    ) {
      items.push({
        title: "Personnel Stock Card",
        icon: "mdi-card-account-details-outline",
        route: {
          name: "office-personnel-records-personnel-stock-card-view-id",
          params: { id: currentUser.value._id },
        },
      });
    }

    items.push({
      title: "Requisition and Issue Slips",
      icon: "mdi-clipboard-text-outline",
      route: {
        name: "requisition-and-issue-slips",
      },
    });

    items.push({
      title: "Asset Issuance Records",
      icon: "mdi-folder-outline",
      children: [
        {
          title: "ICS Records",
          icon: "mdi-clipboard-text-outline",
          route: {
            name: "ics-par-issueslip-issueslip",
            params: { issueslip: "inventory-custodian-slip" },
          },
        },
        {
          title: "PAR Records",
          icon: "mdi-clipboard-text-outline",
          route: {
            name: "ics-par-issueslip-issueslip",
            params: { issueslip: "property-acknowledgement-receipts" },
          },
        },
      ],
    });

    if (!isPersonnel.value && !isOfficeChief.value) {
      items.push({
        title: "Transfers",
        icon: "mdi-folder-open-outline",

        children: [
          {
            title: "Inventory Transfer",
            icon: "mdi-script-text-outline",
            route: {
              name: "transfer-transfer",
              params: {
                transfer: "inventory-transfer",
              },
            },
          },
          {
            title: "Property Transfer",
            icon: "mdi-script-text-outline",
            route: {
              name: "transfer-transfer",
              params: {
                transfer: "property-transfer",
              },
            },
          },
        ],
      });
    }

    if (isPersonnel.value || isOfficeChief.value) {
      items.push({
        title: "Losses",
        icon: "mdi-folder-open-outline",

        children: [
          {
            title: "Lost/Damage SEP",
            icon: "mdi-script-text-outline",
            route: {
              name: "waste-and-losses-losses",
              params: {
                losses: "rlsddsp",
              },
            },
          },
          {
            title: "Lost/Damage PPE",
            icon: "mdi-script-text-outline",
            route: {
              name: "waste-and-losses-losses",
              params: {
                losses: "rlsddp",
              },
            },
          },
        ],
      });
    }

    if (isAdmin.value || isAdminHead.value) {
      items.push({
        title: "Waste and Losses",
        icon: "mdi-folder-open-outline",

        children: [
          {
            title: "Waste Materials",
            icon: "mdi-script-text-outline",
            route: {
              name: "waste-and-losses-waste-materials",
            },
          },
          {
            title: "Lost/Damage SEP",
            icon: "mdi-script-text-outline",
            route: {
              name: "waste-and-losses-losses",
              params: {
                losses: "rlsddsp",
              },
            },
          },
          {
            title: "Lost/Damage PPE",
            icon: "mdi-script-text-outline",
            route: {
              name: "waste-and-losses-losses",
              params: {
                losses: "rlsddp",
              },
            },
          },
        ],
      });
    }

    items.push({
      title: "Return",
      icon: "mdi-folder-open-outline",

      children: [
        {
          title: "Return SEP",
          icon: "mdi-keyboard-return",
          route: {
            name: "return-returnedType",
            params: {
              returnedType: "SEP",
            },
          },
        },
        {
          title: "Return PPE",
          icon: "mdi-keyboard-return",
          route: {
            name: "return-returnedType",
            params: {
              returnedType: "PPE",
            },
          },
        },
      ],
    });

    items.push({
      title: "Maintenance",
      icon: "mdi-wrench-outline",
      route: {
        name: "maintenance",
      },
    });

    if (isAdmin.value || isAdminHead.value) {
      items.push({
        title: "Office and Personnel Records",
        icon: "mdi-folder-outline",
        children: [
          {
            title: "Personnel Stock Card",
            icon: "mdi-card-account-details-outline",
            route: {
              name: "office-personnel-records-personnel-stock-card",
            },
          },
          {
            title: "Office Property Card",
            icon: "mdi-note-text-outline",
            route: {
              name: "office-personnel-records-office-property-card",
            },
          },
        ],
      });
    }

    if (isAdmin.value || isAdminHead.value) {
      items.push({
        title: "Settings",
        icon: "mdi-cog-outline",

        children: [
          {
            title: "Users",
            icon: "mdi-account-outline",
            route: {
              name: "settings-users-user-list",
            },
          },

          // {
          //   title: "Users",
          //   icon: "mdi-account-outline",
          //   route: {
          //     name: "settings-users-user-list",
          //   },

          //   active:
          //     useRoute().name === "settings-users-user-list" ||
          //     useRoute().name === "settings-users-invite-user",
          //   children: [
          //     {
          //       title: "User List",
          //       route: {
          //         name: "settings-users-user-list",
          //       },
          //     },
          //     {
          //       title: "Invite User",
          //       route: {
          //         name: "settings-users-invite-user",
          //       },
          //     },
          //   ],
          // },
          {
            title: "School Divisions",
            icon: "mdi-bank-outline",
            route: {
              name: "settings-school-divisions",
            },
          },
          {
            title: "DepEd Divisions",
            icon: "mdi-bank-outline",
            route: {
              name: "settings-divisions",
            },
          },

          {
            title: "Schools",
            icon: "mdi-office-building-outline",
            route: {
              name: "settings-schools",
            },
          },

          {
            title: "Offices",
            icon: "mdi-office-building-outline",
            route: {
              name: "settings-offices",
            },
          },

          {
            title: "Codes",
            icon: "mdi-circle-outline",
            route: {
              name: "settings-code-type",
              params: {
                type: "serial-code",
              },
            },
          },
          {
            title: "Configurations",
            icon: "mdi-pound",
            route: {
              name: "settings-configurations",
            },
          },
        ],
      });
    }

    items.push({
      title: "Help",
      icon: "mdi-help-circle-outline",
      route: { name: "help" },
    });

    return items;
  });

  const drawer = useState("drawer", () => true);

  return {
    navigationItems,
    drawer,
  };
}
