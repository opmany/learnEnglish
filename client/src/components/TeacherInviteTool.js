import { useState } from "react";
import { generateInviteLink } from "../ApiRequest";

function InviteStudents({ classId }) {
  const [url, setUrl] = useState(null);

  const create = async () => {
    const result = await generateInviteLink(classId);
    setUrl(result.join_url);
  };

  return (
    <div style={{ marginTop: 20, border: "1px solid #ddd", padding: 15 }}>
      <h3>Invite Students</h3>
      <button onClick={create}>Generate Invite Link</button>
      {url && (
        <p style={{ marginTop: 10 }}>
          Share this link with students:
          <br />
          <code style={{ fontSize: "17px" }}>{url}</code>
        </p>
      )}
    </div>
  );
}

export default InviteStudents;
