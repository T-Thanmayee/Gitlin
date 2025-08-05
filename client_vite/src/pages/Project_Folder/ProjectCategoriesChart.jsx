"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import axios from 'axios';

const chartConfig = {
  projects: {
    label: "Projects",
  },
};

export function ProjectCategoriesChart() {
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
    const fetchProjectCategories = async () => {
      try {
        const response = await axios.post('https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/stats/project-categories', { user }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status !== 200) throw new Error('Failed to fetch project categories');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProjectCategories();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Categories Distribution</CardTitle>
          <CardDescription>Breakdown of your projects by category</CardDescription>
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
          <CardTitle>Project Categories Distribution</CardTitle>
          <CardDescription>Breakdown of your projects by category</CardDescription>
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
        <CardTitle>Project Categories Distribution</CardTitle>
        <CardDescription>Breakdown of your projects by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-wrap gap-2 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-muted-foreground">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}