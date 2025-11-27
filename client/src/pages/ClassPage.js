import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useExam } from "../contexts/ExamContext";
import { useUser } from "../contexts/UserContext";
import InviteStudents from "../components/TeacherInviteTool";
import { getClassById, getExamsByClass, setDefaultExam, createExam } from "../ApiRequest";

export default function ClassPage() {
  const { id: classId } = useParams(); // /class/:id
  const { exams, refreshExams, setSelectedExamId } = useExam();
  const { user } = useUser();

  const [classData, setClassData] = useState(null);
  const [classExams, setClassExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [changingDefault, setChangingDefault] = useState(null);

  const loadClassData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Load class info
      const classInfo = await getClassById(classId);
      setClassData(classInfo);

      // 2. Load exams for this class
      const examList = await getExamsByClass(classId);
      setClassExams(examList);

      // 3. If the class has a default exam, auto-select it in ExamContext
      const defaultExam = examList.find((e) => e.is_default);
      if (defaultExam) {
        setSelectedExamId(defaultExam.id);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load class");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassData();
  }, [classId]);

  const handleSetDefault = async (examId) => {
    try {
      setChangingDefault(examId);
      await setDefaultExam(classId, examId);
      await loadClassData(); // reload class and exams
    } catch (err) {
      console.error(err);
      setError("Failed to update default exam");
    } finally {
      setChangingDefault(null);
    }
  };

  const handleCreateExam = async () => {
    const name = prompt("Enter new exam name:");
    if (!name) return;
    try {
      await createExam(name, classId); // uses ExamContext's createExam
      await loadClassData(); // reload exams
    } catch (err) {
      console.error(err);
      setError("Failed to create exam");
    }
  };

  if (loading) return <p>Loading class...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!classData) return <p>No class found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{classData.name}</h1>
      <h3>Teacher: {classData.teacher_username ?? "Unknown"}</h3>

      <h2>Exams</h2>
      {classExams.length === 0 && <p>No exams yet.</p>}

      <ul>
        {classExams.map((exam) => (
          <li key={exam.id} style={{ marginBottom: "8px" }}>
            <strong>{exam.name}</strong>
            {exam.is_default && (
              <span style={{ color: "green", marginLeft: "8px" }}>(Default)</span>
            )}
            {!exam.is_default && (
              <button
                onClick={() => handleSetDefault(exam.id)}
                disabled={changingDefault === exam.id}
                style={{ marginLeft: "15px" }}
              >
                {changingDefault === exam.id ? "Updating..." : "Set as Default"}
              </button>
            )}
          </li>
        ))}
      </ul>

      {user.username === classData.teacher_username && (
        <div>
          <h1>Teacher's Tools: </h1>
          <button onClick={handleCreateExam} style={{ marginTop: "20px" }}>
            ➕ Create New Exam
          </button>
          <InviteStudents classId={classId} />
        </div>
      )}
    </div>
  );
}
