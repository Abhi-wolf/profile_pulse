import { createContext, useState, useEffect, useContext } from "react";

const initialState = {
  data: {
    resumeExtractedText: null,
    jobDescription: null,
    aiResumeAnalysizForJobDesc: null,
  },

  setResumeExtractedText: () => null,
  getResumeExtractedText: () => null,

  setJobDescription: () => null,
  getJobDescription: () => null,

  setAiResumeAnalysizForJobDesc: () => null,
  getAiResumeAnalysizForJobDesc: () => null,

  clearData: () => null,
};

const DataProviderContext = createContext(initialState);

export function DataProvider({
  children,
  dataStorageKey = "profile_pulse_data",
  data: initialData,
}) {
  const [data, setData] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedData = localStorage.getItem(dataStorageKey);
    setData(storedData ? JSON.parse(storedData) : initialData || null);
  }, [initialData, dataStorageKey]);

  useEffect(() => {
    if (isMounted) {
      if (data) {
        localStorage.setItem(dataStorageKey, JSON.stringify(data));
      } else {
        localStorage.removeItem(dataStorageKey);
      }
    }
  }, [data, dataStorageKey, isMounted]);

  const setResumeExtractedText = (extractedText) => {
    const newData = { ...data, resumeExtractedText: extractedText };
    setData(newData);
  };

  const getResumeExtractedText = () => {
    if (data?.resumeExtractedText) return data.resumeExtractedText;
    return null;
  };

  const setJobDescription = (jobDesc) => {
    const newData = { ...data, jobDescription: jobDesc };
    setData(newData);
  };

  const getJobDescription = () => {
    if (data?.jobDescription) return data.jobDescription;
    return null;
  };

  const setAiResumeAnalysizForJobDesc = (aiResponse) => {
    setData((prevData) => ({
      ...prevData,
      aiResumeAnalysizForJobDesc: aiResponse
        ? JSON.stringify(aiResponse)
        : null,
    }));
  };

  const getAiResumeAnalysizForJobDesc = () => {
    if (data?.aiResumeAnalysizForJobDesc)
      return data.aiResumeAnalysizForJobDesc;
    return null;
  };

  const clearData = () => {
    setData(initialState.data);
  };

  if (!isMounted) return null;

  return (
    <DataProviderContext.Provider
      value={{
        data,
        setAiResumeAnalysizForJobDesc,
        setJobDescription,
        setResumeExtractedText,
        getAiResumeAnalysizForJobDesc,
        getJobDescription,
        getResumeExtractedText,
        clearData,
      }}
    >
      {children}
    </DataProviderContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataProviderContext);

  if (context === undefined)
    throw new Error("useData must be used within a DataProvider");

  return context;
};
