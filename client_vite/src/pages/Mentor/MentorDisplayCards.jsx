import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MessageCircleIcon, StarIcon } from "lucide-react"
// import Image from "next/image"

export function MentorDisplayCard() {
  const mentor = {
    name: "John Doe",
    shortName: "johndoe",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg", // Placeholder image URL
    rating: 4.5,
    skills: ["JavaScript", "React", "Node.js", "GraphQL", "CSS"],
    description: "Experienced web developer with over 10 years in the industry. Passionate about building scalable applications and mentoring junior developers.",
    experience: 10,
    price: 100,
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col border-l-4 border-l-teal-500">
      <CardContent className="p-0">
        <div className="flex p-4 border-b">
          <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
            <img src={mentor.profileImage || "/placeholder.svg"} alt={mentor.name} fill className="object-cover" />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{mentor.name}</h3>
                <p className="text-muted-foreground text-sm">@{mentor.shortName}</p>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-1">{mentor.rating.toFixed(1)}</span>
                <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-4">
            {mentor.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs border-teal-200 text-teal-700 bg-teal-50">
                {skill}
              </Badge>
            ))}
            {mentor.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.skills.length - 4}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mentor.description}</p>

          <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
            <div>
              <span className="text-xs text-muted-foreground">Experience</span>
              <p className="font-medium">{mentor.experience} years</p>
            </div>
            <div className="border-l pl-4">
              <span className="text-xs text-muted-foreground">Price</span>
              <p className="font-medium text-teal-600">${mentor.price}/hr</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-0 mt-auto">
        <Button variant="outline" className="flex-1 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800">
          <MessageCircleIcon className="h-4 w-4 mr-1" />
          Chat
        </Button>
        <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">Read More</Button>
      </CardFooter>
    </Card>
  )
}
