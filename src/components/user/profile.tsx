"use client";

import { User } from "@prisma/client";
import { useState } from "react";
import RichTextEditor from "../text-editor";

interface ProfileProps {
  user?: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [likes, setLikes] = useState("");
  const [dislikes, setDisikes] = useState("");

  return (
    <div className="render-anchors">
      <h1 className="text-2xl">Profile</h1>
      <h2 className="text-xl">Likes</h2>
      <RichTextEditor value={likes} onChange={(change) => setLikes(change)} />
      <h2 className="text-xl">Disikes</h2>
      <RichTextEditor
        value={dislikes}
        onChange={(change) => setDisikes(change)}
      />
    </div>
  );
};

export default Profile;
