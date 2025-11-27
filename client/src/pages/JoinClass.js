import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { joinClassFromSignature, classPreview } from "../ApiRequest";

export default function JoinClass() {
  const { signature } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const data = await classPreview(signature);

        setClassInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [signature]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const data = await joinClassFromSignature(signature);

      setTimeout(() => navigate(`/class/${data.class_id}`), 1500);
    } catch (err) {
      setError(err.message);
      setJoining(false);
    }
  };

  if (loading) return <p>Loading class info...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "32px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Join Class</h1>

      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          marginTop: "20px"
        }}
      >
        <h2 style={{ marginBottom: "8px" }}><strong>class name:</strong> {classInfo.name}</h2>
        <p>
          <strong>Teacher:</strong> {classInfo.teacher_username}
        </p>

        <button
          onClick={handleJoin}
          disabled={joining}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          {joining ? "Joining..." : "Join Class"}
        </button>
      </div>
    </div>
  );
}
