import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DetailedProfile } from './DetailedProfile';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfilePage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = '68513ba087655694a9350b1b'; // Replace with auth system
  const baseUrl = 'https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev';

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data
        const userResponse = await fetch(`${baseUrl}/user/${userId}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const userData = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error(userData.error || 'Failed to fetch user data');
        }

        // Fetch user posts
        const postResponse = await fetch(`${baseUrl}/post/${currentUserId}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const postData = await postResponse.json();
        if (!postResponse.ok) {
          throw new Error(postData.error || 'Failed to fetch posts');
        }
        console.log('Post Data:', postData);

        // Fetch user projects
        const projectResponse = await fetch(`${baseUrl}/projects/user/${userId}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        console.log("projectResponse:", projectResponse);
        
        const projectData = await projectResponse.json();
        if (!projectResponse.ok) {
          throw new Error(projectData.error || 'Failed to fetch projects');
        }
        console.log('Project Response:', projectResponse);
        // Combine all data
        setUserData({
          personal: userData.data.user.personal || {},
          skills: userData.data.user.skills || [],
          experience: userData.data.user.experience || [],
          education: userData.data.user.education || [],
          posts: postData || [], // Adjust based on actual API response structure
          projects: projectData || [], // Adjust based on actual API response structure
        });
      } catch (err) {
        setError('Network error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  return (
    <div className="container mx-auto p-4">
      {userData && <DetailedProfile data={userData} userId={userId} currentUserId={currentUserId} />}
    </div>
  );
}