'use client';

import { useState, useEffect } from 'react';
import { ProfessionalCard } from './ProfessionCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Search } from 'lucide-react';

export default function DisplayUserWithSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    company: '',
    degree: '',
    field: '',
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const currentUserId = '68513ba087655694a9350b1b'; // Replace with auth system

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (filters.skills) params.append('skills', filters.skills);
        if (filters.location) params.append('location', filters.location);
        if (filters.company) params.append('company', filters.company);
        if (filters.degree) params.append('degree', filters.degree);
        if (filters.field) params.append('field', filters.field);

        const endpoint = params.toString()
          ? `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/user/search?${params}`
          : 'https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/user/users';

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data.data);
        } else {
          setError(data.error || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Network error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchFollowing() {
      try {
        const response = await fetch(
          `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/post/${currentUserId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );
        const data = await response.json();
        if (response.ok) {
          setFollowing(data.data.user.following || []);
        }
      } catch (err) {
        console.error('Failed to fetch following:', err);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchUsers();
      fetchFollowing();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, currentUserId]);

  const handleConnect = async (targetUserId) => {
    setError(null);
    try {
      const response = await fetch(
        `https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/post/${targetUserId}/follow`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: currentUserId }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFollowing(data.following || []);
      } else {
        setError(data.error || 'Failed to update follow status');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearSearchAndFilters = () => {
    setSearchQuery('');
    setFilters({ skills: '', location: '', company: '', degree: '', field: '' });
  };

  const isFiltered = searchQuery || Object.values(filters).some((v) => v);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Professionals</h1>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            placeholder="Skills (e.g., React, Node.js)"
            value={filters.skills}
            onChange={(e) => handleFilterChange('skills', e.target.value)}
          />
          <Input
            placeholder="Location (e.g., Seattle, WA)"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
          <Input
            placeholder="Company (e.g., TechInnovate)"
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
          />
          <Input
            placeholder="Degree (e.g., Master of Science)"
            value={filters.degree}
            onChange={(e) => handleFilterChange('degree', e.target.value)}
          />
          <Input
            placeholder="Field (e.g., Computer Science)"
            value={filters.field}
            onChange={(e) => handleFilterChange('field', e.target.value)}
          />
        </div>

        {isFiltered && (
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-muted-foreground">
              Showing results for{' '}
              {searchQuery && <span className="font-semibold">name: "{searchQuery}"</span>}
              {Object.entries(filters)
                .filter(([_, v]) => v)
                .map(([k, v], i) => (
                  <span key={k} className="font-semibold">
                    {searchQuery || i > 0 ? ', ' : ''}{k}: "{v}"
                  </span>
                ))}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearchAndFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && <div className="text-center p-4">Loading...</div>}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* No Results */}
      {!loading && !error && users.length === 0 && (
        <div className="text-center p-4 text-muted-foreground">
          No professionals found{isFiltered ? ' for applied filters' : ''}.
        </div>
      )}

      {/* Users Grid */}
      {!loading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => {
            const experienceYears = user.experience.reduce((total, exp) => {
              const start = new Date(exp.startDate);
              const end = exp.endDate === 'Present' ? new Date() : new Date(exp.endDate);
              const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
              return total + years;
            }, 0);

            return (
              <ProfessionalCard
                key={user._id}
                name={user.personal.name}
                title={user.personal.title}
                company={user.personal.company}
                location={user.personal.location}
                avatar={user.personal.avatar}
                experience={Math.round(experienceYears)}
                website={user.personal.website}
                email={user.personal.email}
                onConnect={() => handleConnect(user._id)}
                isFollowing={following.some((id) => id.toString() === user._id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}