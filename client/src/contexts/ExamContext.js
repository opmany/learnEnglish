import { createContext, useContext, useState, useEffect } from "react";
import { getConnection, getMyExams, getMyClasses, getExam } from "../ApiRequest";

const ExamContext = createContext();

export function ExamProvider({ children }) {
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [currentExamJson, setCurrentExamJson] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [allExams, setAllExams] = useState([]);
  const [myClasses, setMyClasses] = useState([]);

  // Fetch all exams across all classes
  const refreshExams = async () => {
    try {
      const exams = await getMyExams(); 
      setAllExams(exams);

      // If no selected exam, pick first default exam automatically
      if (!selectedExamId) {
        const defaultExam = exams.find(ex => ex.is_default);
        if (defaultExam) setSelectedExamId(defaultExam.exam_id);
      }
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    }
  };

  // --- Fetch classes separately ---
const refreshClasses = async () => {
  try {
    const new_classes = await getMyClasses(); // <-- this must return array of classes
    setMyClasses(new_classes);
  } catch (err) {
    console.error("Failed to fetch classes:", err);
  }
};


  useEffect(() => {
    async function fetchExam() {
      if (!selectedExamId) return;

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
      } catch {
        setConnectionStatus("Backend unreachable 😢");
      }
    }

    console.log("selected exam id:", selectedExamId);
    testConnection();
    fetchExam();
    refreshExams();
  }, [selectedExamId]);

  return (
    <ExamContext.Provider
      value={{
        selectedExamId,
        setSelectedExamId,
        currentExamJson,
        setCurrentExamJson,
        connectionStatus,
        allExams,
        refreshExams,
        refreshClasses,
        myClasses,
        setMyClasses,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  return useContext(ExamContext);
}
