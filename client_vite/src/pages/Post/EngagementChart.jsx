"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import axios from 'axios';
const chartConfig = {
  likes: {
    label: "Likes",
    color: "hsl(var(--chart-1))",
  },
  comments: {
    label: "Comments",
    color: "hsl(var(--chart-2))",
  },
  shares: {
    label: "Shares",
    color: "hsl(var(--chart-3))",
  },
};

export function EngagementChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const user={
      _id: "684ff0364ab94bd6ad1006ad",
      following: [
        "684ff902561fbc141c2f5137"
      ],
      "__v": 2,

    posts: [],
    projects: []
  
}
 useEffect(() => {
  const fetchEngagement = async () => {
    try {
      const response = await axios.post(
        'https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/stats/user-engagement',
        { user },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const engagementData = response.data;
      setData(engagementData);
      setLoading(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  fetchEngagement();
}, []);


  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Engagement Metrics</CardTitle>
          <CardDescription>Daily breakdown of likes, comments, and shares</CardDescription>
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
          <CardTitle>Weekly Engagement Metrics</CardTitle>
          <CardDescription>Daily breakdown of likes, comments, and shares</CardDescription>
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
        <CardTitle>Weekly Engagement Metrics</CardTitle>
        <CardDescription>Daily breakdown of likes, comments, and shares</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="likes" fill="var(--color-likes)" />
              <Bar dataKey="comments" fill="var(--color-comments)" />
              <Bar dataKey="shares" fill="var(--color-shares)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}