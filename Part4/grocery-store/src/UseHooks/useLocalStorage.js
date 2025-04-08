import { useState } from 'react';
const useLocalStorage = () => {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = window.localStorage.getItem("currentUser");
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error retrieving item from local storage:', error);
        return null;
      }
    });
  
  
    const setValue = (value) => {
      try {
        if (value && typeof value.id === "number" && typeof value.name === "string" &&(value.type=="supplier"||value.type=="owner")) {
          setStoredValue(value);
          window.localStorage.setItem("currentUser", JSON.stringify(value));
        } else {
          throw new Error("Invalid user object: expected { id, name }");
        }
      } catch (error) {
        console.error('Error setting item in local storage:', error);
      }
    };
  
    const removeValue = () => {
      try {
        window.localStorage.removeItem("currentUser");
        setStoredValue(null);
      } catch (error) {
        console.error('Error removing item from local storage:', error);
      }
    };
  
    return {
      value: storedValue,
      set: setValue,
      remove: removeValue,
    };
  };
  export default useLocalStorage;