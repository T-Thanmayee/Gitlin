import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Users, UserPlus, TrendingUp, Calendar, Axis3DIcon } from "lucide-react";
import axios from 'axios';
const iconMap = {
  FolderOpen: FolderOpen,
  Users: Users,
  UserPlus: UserPlus,
  TrendingUp: TrendingUp,
  Calendar: Calendar,
};

export function StatsCards() {
  const [stats, setStats] = useState([]);
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
  const fetchStats = async () => {
    try {
      const response = await axios.post(
        'https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/stats/user',
        { user },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Stats response:', response.data);

      const data = response.data;

      setStats(
        data.map((stat) => ({
          ...stat,
          icon: iconMap[stat.title.replace(/\s+/g, '')] || Calendar,
        }))
      );
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchStats();
}, []);


  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
              {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
              <span>{stat.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}