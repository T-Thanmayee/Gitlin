import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Star, Clock, DollarSign, User } from "lucide-react";

export default function MentorPage() {
  const { mentorId } = useParams(); // Extract mentorId from URL
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });
  const [mentorData, setMentorData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        // Fetch mentor profile
        const mentorResponse = await fetch(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/mentors/${mentorId}`);
        if (!mentorResponse.ok) throw new Error('Failed to fetch mentor data');
        const mentor = await mentorResponse.json();
        setMentorData(mentor);

        // Fetch reviews using mentor's shortName
        const reviewsResponse = await fetch(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/mentors/shortName/${mentor.shortName}/reviews`);
        if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews');
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.map(review => ({
          id: review._id,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.date).toISOString().split("T")[0],
          avatar: review.avatar || "/placeholder.svg",
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentorData();
    } else {
      setError("Mentor ID not provided in URL");
      setLoading(false);
    }
  }, [mentorId]);

  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.name && newReview.rating && newReview.comment && mentorData) {
      try {
        const response = await fetch(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/mentors/shortName/${mentorData.shortName}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'current_user_id', // Replace with actual user ID from auth context
            name: newReview.name,
            rating: newReview.rating,
            comment: newReview.comment,
          }),
        });
        if (!response.ok) throw new Error('Failed to submit review');
        const review = await response.json();
        setReviews((prev) => [{
          id: review._id,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.date).toISOString().split("T")[0],
          avatar: review.avatar || "/placeholder.svg",
        }, ...prev]);
        setNewReview({ name: "", rating: 0, comment: "" });

        // Refresh mentor data to update rating
        const mentorResponse = await fetch(`https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/mentors/${mentorId}`);
        if (mentorResponse.ok) {
          const updatedMentor = await mentorResponse.json();
          setMentorData(updatedMentor);
        }
      } catch (err) {
        console.error('Error submitting review:', err);
      }
    }
  };

  const renderStars = (rating, interactive = false, size = "w-5 h-5") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => handleRatingClick(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 py-8 text-center text-red-600">{error}</div>;
  }

  if (!mentorData) {
    return <div className="min-h-screen bg-gray-50 py-8 text-center">Mentor not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mentor Profile Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage
                    src={mentorData.profileImage}
                    alt={mentorData.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {mentorData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {mentorData.name}
                  </h1>
                  <p className="text-gray-600 mb-4">@{mentorData.shortName}</p>
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(mentorData.rating)}
                    <span className="text-lg font-semibold">
                      {mentorData.rating}
                    </span>
                    <span className="text-gray-500">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{mentorData.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-5 h-5" />
                    <span>${mentorData.price}/hour</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-5 h-5" />
                    <span>Available for mentoring</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentorData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {mentorData.description}
                  </p>
                </div>

                <div className="mt-6">
                  <Button size="lg" className="w-full md:w-auto">
                    Book a Session
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reviews & Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Review Form */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={newReview.name}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(newReview.rating, true, "w-6 h-6")}
                      <span className="text-sm text-gray-500">
                        {newReview.rating > 0
                          ? `${newReview.rating} star${
                              newReview.rating > 1 ? "s" : ""
                            }`
                          : "Click to rate"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Your Review</Label>
                  <Textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Share your experience with this mentor..."
                    rows={4}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={
                    !newReview.name || !newReview.rating || !newReview.comment
                  }
                >
                  Submit Review
                </Button>
              </form>
            </div>

            <Separator className="my-8" />

            {/* Existing Reviews */}
            <div>
              <h3 className="text-lg font-semibold mb-6">
                All Reviews ({reviews.length})
              </h3>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.name}
                        />
                        <AvatarFallback>
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating, false, "w-4 h-4")}
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}