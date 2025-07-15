"use client";

import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Briefcase, MapPin, Link2, Mail, Users } from "lucide-react";

export function ProfessionalCard({
  id,
  key,
  name,
  title,
  company,
  location,
  avatar,
  experience,
  website,
  email,
  onConnect,
  isFollowing,
}) {
  const navigate = useNavigate();

  const handleViewProfile = (key) => {
    console.log(key)
    navigate(`/users/${key}`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40"></div>
      <CardContent className="pt-0">
        <div className="relative -mt-12 flex justify-between">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button
            variant={isFollowing ? "secondary" : "default"}
            size="sm"
            className="mt-auto"
            onClick={onConnect}
          >
            <Users className="mr-2 h-4 w-4" />
            {isFollowing ? "Following" : "Connect"}
          </Button>
        </div>

        <div className="mt-3">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {company} · {experience} years
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <Link2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <a
                href={`https://${website}`}
                className="text-primary hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {website}
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${email}`} className="text-primary hover:underline">
                {email}
              </a>
            </div>

            {isFollowing && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">follow</p>
              </div>
            )}
          </div>

          {/* View Profile Button */}
          <div className="mt-4">
            <Button
              onClick={()=> handleViewProfile(id)}
              variant="link"
              className="text-blue-600 hover:underline p-0"
            >
              View Profile →
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 text-sm">
        <p>Available for new opportunities</p>
      </CardFooter>
    </Card>
  );
}
