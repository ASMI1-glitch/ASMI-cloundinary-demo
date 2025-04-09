import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

const ProfileForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("email", email);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      console.log("✅ Cloudinary Image URL:", res.data.imageUrl); // 👈 LOG HERE
      setProfile(res.data);
    } catch (err) {
      console.error("❌ Upload failed", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="container">
      <h2>Profile Uploader</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          required
        />
        <button type="submit">Submit</button>
      </form>

      {profile && (
        <div className="profile-card">
          <h3>{profile.name}</h3>
          <p>{profile.email}</p>
          <img src={profile.imageUrl} alt="Profile" className="preview-img" />
          <p>
            Image URL:{" "}
            <a
              href={profile.imageUrl}
              target="_blank"
              rel="noreferrer"
            >
              {profile.imageUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
