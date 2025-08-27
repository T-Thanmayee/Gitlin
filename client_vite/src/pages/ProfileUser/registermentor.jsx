"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev';

export default function RegisterMentor() {
  const { currentUser } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [skills, setSkills] = useState([]);
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState(""); // Added for price
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  const addSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill) {
      setSkills([...skills, newSkill.trim()]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser?._id) {
      setError("You must be logged in to register as a mentor.");
      toast.error("Please log in to register as a mentor.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", currentUser._id); // Add userId
    formData.append("name", name);
    formData.append("shortName", shortName);
    if (profilePicture) formData.append("profilePicture", profilePicture);
    skills.forEach((skill) => formData.append("skills", skill));
    formData.append("bio", bio);
    formData.append("experience", experience);
    formData.append("hourlyRate", hourlyRate);

    try {
      const response = await fetch(`${API_URL}/mentors`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`, // Add auth token
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to register mentor: ${response.status}`);
      }

      setSuccess(true);
      setName("");
      setShortName("");
      setProfilePicture(null);
      setSkills([]);
      setBio("");
      setExperience("");
      setHourlyRate("");
      setError(null);
      toast.success("Mentor registration successful!");
    } catch (err) {
      console.error("Error during submission:", err);
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Network error. Check your internet connection or backend server.");
      } else {
        setError("Sorry, registration failed: " + err.message);
      }
      toast.error(setError);
      setSuccess(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Mentor Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block font-semibold text-gray-600 mb-1">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="shortName" className="block font-semibold text-gray-600 mb-1">Short Name</label>
              <Input
                id="shortName"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="Enter your short name"
                required
              />
            </div>
            <div>
              <label htmlFor="profilePicture" className="block font-semibold text-gray-600 mb-1">Profile Picture</label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {profilePicture && (
                <Avatar className="mt-2 w-24 h-24 rounded-full overflow-hidden">
                  <AvatarImage
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile Preview"
                  />
                  <AvatarFallback>{name ? name[0] : "U"}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                <button type="button" className="text-blue-600 hover:underline" onClick={addSkill}>
                  + Add Skill
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="bio" className="block font-semibold text-gray-600 mb-1">Bio / Summary</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g., Passionate about building scalable applications and mentoring junior developers"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                required
              />
            </div>
            <div>
              <label htmlFor="experience" className="block font-semibold text-gray-600 mb-1">Experience (Years)</label>
              <Input
                id="experience"
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                min="0"
                placeholder="Enter years of experience"
                required
              />
            </div>
            <div>
              <label htmlFor="hourlyRate" className="block font-semibold text-gray-600 mb-1">Hourly Rate ($)</label>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                min="0"
                placeholder="Enter hourly rate"
                required
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">Registration successful!</p>}
            <div className="flex gap-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Register
              </Button>
              <Button
                type="button"
                className="w-full bg-gray-500 hover:bg-gray-600"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}