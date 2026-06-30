import React from "react";

interface UsePasswordInterface {
  getPassword: () => string;
  setPassword: (password: string) => void;
}

export const usePassword = (): UsePasswordInterface => {

  const getPassword = () => {
    const userKey = sessionStorage.getItem("userKey");

    return userKey ? userKey : "";
  }

  const setPassword = (password: string) => {
    sessionStorage.setItem("userKey", password);
  }

  const clearSessionStorage = () => {

  }

  return {
    getPassword,
    setPassword
  }
}