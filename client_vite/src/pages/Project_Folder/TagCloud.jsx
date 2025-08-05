"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';

const getSizeClass = (size) => {
  switch (size) {
    case "large":
      return "text-lg px-4 py-2";
    case "medium":
      return "text-base px-3 py-1";
    case "small":
      return "text-sm px-2 py-1";
    default:
      return "text-sm px-2 py-1";
  }
};

export function TagCloud() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = {
    _id: "684ff0364ab94bd6ad1006ad",
    following: ["684ff902561fbc141c2f5137"],
    "__v": 2,
    posts: [],
    projects: [],
  };

  useEffect(() => {
    const fetchTagCloud = async () => {
      try {
        const response = await axios.post('https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/stats/tag-cloud', { user }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status !== 200) throw new Error('Failed to fetch tag cloud data');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTagCloud();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tag Cloud of Your Projects</CardTitle>
          <CardDescription>Most-used technologies and keywords in your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tag Cloud of Your Projects</CardTitle>
          <CardDescription>Most-used technologies and keywords in your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tag Cloud of Your Projects</CardTitle>
        <CardDescription>Most-used technologies and keywords in your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {data.length > 0 ? (
            data.map((tag) => (
              <Badge key={tag.name} variant="secondary" className={getSizeClass(tag.size)}>
                {tag.name} ({tag.count})
              </Badge>
            ))
          ) : (
            <div className="text-center text-muted-foreground">No tags found</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}