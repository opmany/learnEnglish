import { createContext, useContext, useState, useEffect } from "react";
import { getConnection, getExam } from "./ApiRequest";

const ExamContext = createContext();

const startExamId = 3;

export function ExamProvider({ children }) {
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [currentExamJson, setCurrentExamJson] = useState(null);

// Fetch exam whenever selectedExamId changes
  useEffect(() => {
    async function fetchExam() {
      if (!selectedExamId) {
        setCurrentExamJson(null);
        setSelectedExamId(startExamId);
        return;
      }

      try {
        const data = await getExam(selectedExamId);
        setCurrentExamJson(data);
      } catch (err) {
        console.error("Failed to fetch exam:", err);
        setCurrentExamJson(null);
      }
    }

    async function testConnection() {
      try {
        const result = await getConnection();

        setConnectionStatus(result.message);
      } catch (err) {
        setConnectionStatus("Backend unreachable 😢");
      }
    }

    testConnection();
    fetchExam();
  }, [selectedExamId]);

  return (
    <ExamContext.Provider value={{
       selectedExamId, setSelectedExamId,
       connectionStatus, setConnectionStatus,
       currentExamJson, setCurrentExamJson,
       }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  return useContext(ExamContext);
}
