"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function RegisterMentor() {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [skills, setSkills] = useState([]);
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [rating, setRating] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  const addSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill) {
      setSkills([...skills, newSkill]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("shortName", shortName);
    if (profilePicture) formData.append("profilePicture", profilePicture);
    skills.forEach((skill) => formData.append("skills[]", skill));
    formData.append("bio", bio);
    formData.append("experience", experience);
    formData.append("rating", rating);
    formData.append("hourlyRate", hourlyRate);

    console.log("FormData contents:", Object.fromEntries(formData)); // Log form data for debugging

    try {
      const response = await fetch("https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev/mentors", {
        method: "POST",
        body: formData,
        timeout: 10000, // 10 seconds timeout
      });

      const responseData = await response.text(); // Use text() first to avoid JSON parsing issues
      console.log("Server response:", responseData);

      if (!response.ok) {
        throw new Error(`Failed to register mentor: ${response.status} - ${responseData || "No response"}`);
      }

      // Attempt to parse as JSON if it looks like JSON
      let parsedData = {};
      try {
        parsedData = JSON.parse(responseData);
      } catch (e) {
        console.log("Response is not JSON:", responseData);
      }

      setSuccess(true);
      setName("");
      setShortName("");
      setProfilePicture(null);
      setSkills([]);
      setBio("");
      setExperience("");
      setRating("");
      setHourlyRate("");
      setError(null);
    } catch (err) {
      console.error("Error during submission:", err);
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Network error. Check your internet connection or backend server.");
      } else {
        setError(err.message);
      }
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
                  +1
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
              <label htmlFor="experience" className="block font-semibold text-gray-600 mb-1">Experience</label>
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
              <label htmlFor="rating" className="block font-semibold text-gray-600 mb-1">Rating</label>
              <Input
                id="rating"
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="0"
                max="5"
                step="0.1"
                placeholder="Enter your rating (0-5)"
                required
              />
            </div>
            <div>
              <label htmlFor="hourlyRate" className="block font-semibold text-gray-600 mb-1">Hourly Rate</label>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                min="0"
                placeholder="Enter your hourly rate"
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