import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailedProfile } from './DetailedProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
export default function EditProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
   const { loginStatus, currentUser, errorOccured, errorMessage, isPending } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    personal: {
      name: '',
      title: '',
      company: '',
      location: '',
      email: '',
      website: '',
      avatar: '',
      bio: '',
      phone: '',
      coverImage: '',
      joinDate: '',
    },
    skills: '',
    experience: [],
    education: [],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
   // Replace with auth system

  useEffect(() => {
    

    async function fetchUser() {
      try {
        const response = await fetch(
          `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/user/${userId}`,
          {
            headers: { 'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('Token')}` // Include token if needed
             },
            credentials: 'include',
          }
        );
        const data = await response.json();
        if (response.ok) {
          setFormData({
            personal: {
              name: data.data.user.personal?.name || '',
              title: data.data.user.personal?.title || '',
              company: data.data.user.personal?.company || '',
              location: data.data.user.personal?.location || '',
              email: data.data.user.personal?.email || '',
              website: data.data.user.personal?.website || '',
              avatar: data.data.user.personal?.avatar || '',
              bio: data.data.user.personal?.bio || '',
              phone: data.data.user.personal?.phone || '',
              coverImage: data.data.user.personal?.coverImage || '',
              joinDate: data.data.user.personal?.joinDate || '',
            },
            skills: data.data.user.skills ? data.data.user.skills.join(', ') : '',
            experience: data.data.user.experience || [],
            education: data.data.user.education || [],
          });
        } else {
          setError(data.error || 'Failed to fetch user');
        }
      } catch (err) {
        setError('Network error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId, currentUser._id, navigate]);

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    if (section === 'personal') {
      setFormData((prev) => ({
        ...prev,
        personal: { ...prev.personal, [name]: value },
      }));
    } else if (section === 'skills') {
      setFormData((prev) => ({ ...prev, skills: value }));
    } else if (section === 'experience' || section === 'education') {
      setFormData((prev) => {
        const updatedSection = [...prev[section]];
        updatedSection[index] = { ...updatedSection[index], [name]: value };
        return { ...prev, [section]: updatedSection };
      });
    }
  };

  const addEntry = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        section === 'experience'
          ? { company: '', title: '', location: '', startDate: '', endDate: '', description: '' }
          : { institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' },
      ],
    }));
  };

  const removeEntry = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        personal: formData.personal,
        skills: formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        experience: formData.experience,
        education: formData.education,
      };
      const response = await fetch(
        `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/user/${userId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('Token')}` // Include token if needed
           },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => navigate(`/profile/${userId}`), 2000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error && !formData.personal.name)
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert
          className="mb-4 bg-green-100 text-green-800 border-green-300"
          variant="default"
        >
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-1 w-max-[220px]">
       

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    name="name"
                    value={formData.personal.name}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    name="title"
                    value={formData.personal.title}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter your title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    name="company"
                    value={formData.personal.company}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter your company"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    name="location"
                    value={formData.personal.location}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter your location"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    name="website"
                    value={formData.personal.website}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter your website"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Avatar URL</label>
                  <Input
                    name="avatar"
                    value={formData.personal.avatar}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter avatar URL (Cloudinary)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    name="bio"
                    value={formData.personal.bio}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter your bio"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    name="phone"
                    value={formData.personal.phone}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter your phone"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cover Image URL</label>
                  <Input
                    name="coverImage"
                    value={formData.personal.coverImage}
                    onChange={(e) => handleChange(e, 'personal')}
                    placeholder="Enter cover image URL (Cloudinary)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Join Date</label>
                  <Input
                    name="joinDate"
                    value={formData.personal.joinDate}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="skills"
                  value={formData.skills}
                  onChange={(e) => handleChange(e, 'skills')}
                  placeholder="Enter skills (comma-separated, avoid commas in skill names)"
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border p-4 rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Experience {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEntry('experience', index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      placeholder="Company"
                    />
                    <Input
                      name="title"
                      value={exp.title}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      placeholder="Title"
                    />
                    <Input
                      name="location"
                      value={exp.location}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      placeholder="Location"
                    />
                    <Input
                      name="startDate"
                      value={exp.startDate}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      placeholder="Start Date"
                    />
                    <Input
                      name="endDate"
                      value={exp.endDate}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      placeholder="End Date"
                    />
                    <Textarea
                      name="description"
                      value={exp.description}
                      onChange={(e) => handleChange(e, 'experience', index)}
                      placeholder="Description"
                      rows={3}
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={() => addEntry('experience')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.experience.map((edu, index) => (
                  <div key={index} className="border p-4 rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Education {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEntry('education', index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleChange(e, 'education', index)}
                      placeholder="Institution"
                    />
                    <Input
                      name="degree"
                      value={edu.degree}
                      onChange={(e) => handleChange(e, 'education', index)}
                      placeholder="Degree"
                    />
                    <Input
                      name="field"
                      value={edu.field}
                      onChange={(e) => handleChange(e, 'education', index)}
                      placeholder="Field of Study"
                    />
                    <Input
                      name="startDate"
                      value={edu.startDate}
                      onChange={(e) => handleChange(e, 'education', index)}
                      placeholder="Start Date"
                    />
                    <Input
                      name="endDate"
                      value={edu.endDate}
                      onChange={(e) => handleChange(e, 'education', index)}
                      placeholder="End Date"
                    />
                    <Textarea
                      name="description"
                      value={edu.description}
                      onChange={(e) => handleChange(e, 'education', index)}
                      placeholder="Description"
                      rows={3}
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={() => addEntry('education')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => navigate(`/profile/${userId}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}