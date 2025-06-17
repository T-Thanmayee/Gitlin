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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/user/${currentUserId}`,
          {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUserData({
            personal: data.data.user.personal || {},
            skills: data.data.user.skills || [],
            experience: data.data.user.experience || [],
            education: data.data.user.education || [],
            posts: data.data.posts || [],
            projects: data.data.projects || [],
          });
        } else {
          setError(data.error || 'Failed to fetch data');
        }
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