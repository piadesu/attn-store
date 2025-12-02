import { useEffect, useState } from "react";

function EditProfile() {
  const [profile, setProfile] = useState({
    FIRST_NAME: "",
    MIDDLE_NAME: "",
    LAST_NAME: "",
    USERNAME: "",
    PASSWORD: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get logged in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username;

  // Fetch profile when page loads
  useEffect(() => {
    if (!username) return;

    fetch(`http://127.0.0.1:8000/api/profile/${username}/`)
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          FIRST_NAME: data.FIRST_NAME,
          MIDDLE_NAME: data.MIDDLE_NAME,
          LAST_NAME: data.LAST_NAME,
          USERNAME: data.USERNAME,
          PASSWORD: "", // empty but optional if user wants to change it
        });
        setLoading(false);
      })
      .catch(() => alert("Failed to load profile"));
  }, [username]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile to backend
  const handleSave = () => {
    setSaving(true);

    fetch(`http://127.0.0.1:8000/api/profile/${username}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Profile updated successfully!");
        setSaving(false);
      })
      .catch(() => {
        alert("Failed to update profile");
        setSaving(false);
      });
  };

  if (loading) return <p className="p-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#4D1C0A] mb-5">Profile</h1>

      <div className="bg-white border border-gray-300 rounded-xl p-10 w-[900px] shadow-sm">

        <h2 className="text-2xl font-semibold text-[#4D1C0A] mb-10">
          {profile.FIRST_NAME} {profile.LAST_NAME}
        </h2>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-6">

          {/* First Name */}
          <div>
            <label className="text-[#4D1C0A] font-medium">First Name</label>
            <input
              name="FIRST_NAME"
              value={profile.FIRST_NAME}
              onChange={handleChange}
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-gray-800"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-[#4D1C0A] font-medium">Last Name</label>
            <input
              name="LAST_NAME"
              value={profile.LAST_NAME}
              onChange={handleChange}
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-gray-800"
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="text-[#4D1C0A] font-medium">Middle Name</label>
            <input
              name="MIDDLE_NAME"
              value={profile.MIDDLE_NAME}
              onChange={handleChange}
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-gray-800"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-[#4D1C0A] font-medium">Username</label>
            <input
              name="USERNAME"
              value={profile.USERNAME}
              onChange={handleChange}
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-gray-800"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[#4D1C0A] font-medium">Password</label>
            <input
              name="PASSWORD"
              value={profile.PASSWORD}
              onChange={handleChange}
              type="password"
              placeholder="Enter new password..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-gray-800"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end mt-10 pr-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#F28C28] hover:bg-[#d97a21] text-white px-10 py-3 rounded-lg font-bold shadow-sm"
          >
            {saving ? "Saving..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
