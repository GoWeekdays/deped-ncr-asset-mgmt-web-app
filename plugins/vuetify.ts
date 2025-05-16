import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "./assets/main.scss";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const vuetify = createVuetify({
      defaults: {
        VTextField: {
          variant: "outlined",
        },
        VTextarea: {
          variant: "outlined",
        },
        VBtn: {
          class:
            "pa-4 px-6 rounded-lg  d-flex text-capitalize align-center text-button font-weight-medium",
        },
      },
      theme: {
        defaultTheme: "light", // Force light mode
        themes: {
          light: {
            colors: {
              primary: "#084683",
              "primary-text": "#031c34",
              "heading-blue-text": "#084683",
              "table-header-color": "#06315C",
              secondary: "#DE082C",
              accent: "#6DA9E340",
              error: "#FF5252",
              success: "#4CAF50",
              warning: "#FFC107",
              paragraph: "#031C34",
              textwhite: "#ececec",
              fontgray: "#889397",
              "border-color": "#889397",
              "button-border": "#5C6C75",
              "deped-color": "#084683",
              "deped-text-color": "#fcff00",
              background: "#f8f8f8",
            },
            variables: {
              fontFamily: "Poppins, sans-serif",
              buttonFontSize: "16px",
            },
          },
        },
      },
    });

    // Register Vuetify only on the client-side
    nuxtApp.vueApp.use(vuetify);
  }
});

// import "@mdi/font/css/materialdesignicons.css";
// import "vuetify/styles";
// import "./assets/main.scss";
// import { createVuetify } from "vuetify";

// export default defineNuxtPlugin((nuxtApp) => {
//   if (process.client) {
//     const storedTheme = sessionStorage.getItem("theme");
//     const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
//       .matches
//       ? "dark"
//       : "light";
//     const initialTheme = storedTheme || systemTheme;

//     const vuetify = createVuetify({
//       defaults: {
//         VTextField: {
//           variant: "outlined",
//         },
//         VTextarea: {
//           variant: "outlined",
//         },
//       },
//       theme: {
//         defaultTheme: initialTheme,
//         themes: {
//           light: {
//             colors: {
//               primary: "#084683",
//               "primary-text": "#031c34",
//               "heading-blue-text": "#084683",
//               "table-header-color": "#06315C",
//               secondary: "#DE082C",
//               accent: "#6DA9E340",
//               error: "#FF5252",
//               success: "#4CAF50",
//               warning: "#FFC107",
//               paragraph: "#031C34",
//               textwhite: "#ececec",
//               fontgray: "#889397",
//               "border-color": "#889397",
//               "button-border": "#5C6C75",
//               "deped-color": "#084683",
//               "deped-text-color": "#fcff00",
//               background: "#f8f8f8",
//             },
//             variables: {
//               fontFamily: "Poppins, sans-serif",
//               buttonFontSize: "16px",
//             },
//           },
//           dark: {
//             colors: {
//               primary: "#1a82eb",
//               "primary-text": "#ececec",
//               "heading-blue-text": "#084683",
//               "table-header-color": "#06315C",
//               secondary: "#DE082C",
//               accent: "#6DA9E340",
//               error: "#FF5252",
//               success: "#4CAF50",
//               warning: "#FFC107",
//               paragraph: "#031C34",
//               fontgray: "#889397",
//               "border-color": "#889397",
//               "button-border": "#5C6C75",
//               "deped-color": "#084683",
//               "deped-text-color": "#fcff00",
//               background: "#292929",
//             },
//             variables: {
//               fontFamily: "Poppins, sans-serif",
//               buttonFontSize: "16px",
//             },
//           },
//         },
//       },
//     });

//     // Register Vuetify only on the client-side
//     nuxtApp.vueApp.use(vuetify);
//   }
// });
