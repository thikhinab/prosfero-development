import { useState, useCallback } from "react";
import Select from "react-select";
import { debounce } from "lodash";

const loadingMessage = "Loading options";

const LocationSelect = ({
  defaultValue,
  loading,
  suggestions,
  menuIsOpen,
  requests,
  placeholder,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedSave = useCallback(
    debounce((newValue) => requests(newValue), 1000),
    []
  );

  const updateValue = (newValue) => {
    setInputValue(newValue);
    debouncedSave(newValue);
  };

  const options = suggestions.map((sug) => {
    return { value: sug.label, label: sug.label, lon: sug.x, lat: sug.y };
  });

  return (
    <>
      <Select
        value={defaultValue}
        inputValue={inputValue}
        onInputChange={(input) => updateValue(input)}
        onChange={(object) => onSelect(object)}
        isLoading={loading}
        loadingMessage={() => loadingMessage}
        menuIsOpen={menuIsOpen}
        placeholder={placeholder}
        options={options}
      />
    </>
  );
};

export default LocationSelect;
