import { useReducer } from "react";

const imageFieldReducer = (
  state: Array<string> = [],
  action: { type: string; image?: string; idx?: number },
) => {
  if (action.type === "new-field") {
    return state.concat("");
  }
  if (
    action.type === "edit-field" &&
    action.image &&
    action.idx !== undefined
  ) {
    return state
      .slice(0, action.idx)
      .concat(action.image)
      .concat(state.slice(action.idx + 1));
  }
  if (action.type === "delete-field" && action.idx !== undefined) {
    return state.slice(0, action.idx).concat(state.slice(action.idx + 1));
  }

  return state;
};

export const useImageFields = (initialFields = []) => {
  const [imageFields, dispatch] = useReducer(imageFieldReducer, initialFields);
  const addField = () => dispatch({ type: "new-field" });
  const editField = (idx: number) => (value: string) =>
    dispatch({ type: "edit-field", image: value, idx });
  const removeField = (idx: number) => () =>
    dispatch({ type: "delete-field", idx });
  return { imageFields, addField, editField, removeField };
};

export default useImageFields;
