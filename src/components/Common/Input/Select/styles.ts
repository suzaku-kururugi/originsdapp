export const selectStyles = {
  control: (styles: any) => ({ 
    ...styles,
    backgroundColor: "#F1E0C5",
    borderRadius: "1rem",
    border: "2px solid #3C312B",
    boxShadow: "0 !important",
    "&:hover": {
      border: "2px solid #3C312B",
    },

    "&:focus": {
      border: "2px solid #3C312B",
      
    }
  }),
  option: (styles: any, state: any) => ({
    ...styles,
    backgroundColor: state.isFocused ? "#c7baa4" : "#F1E0C5",
    "&:hover": {
      backgroundColor: "#c7baa4",
    },
    // opacity: state.isSelected ? "0.8" : "1"
  }),
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: "#F1E0C5",
  }),

  multiValue: (styles: any) => ({
    ...styles,
    backgroundColor: "#c7baa4",
    borderRadius: "8px",
  }),

  multiValueRemove: (styles: any) => ({
    ...styles,
    backgroundColor: "#b7a296",
    borderRadius: "0 8px 8px 0",
  }),
}


