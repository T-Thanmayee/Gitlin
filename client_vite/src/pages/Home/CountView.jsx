import React, { useState, useEffect } from "react";

function CountView() {
  const [counts, setCounts] = useState({
    projects: 0,
    posts: 0,
    visitors: 0,
    mentors: 0,
  });

  useEffect(() => {
    // Target values for each counter
    const targetCounts = {
      projects: 10,
      posts: 2000,
      visitors: 3000,
      mentors: 150,
    };

    const duration = 2000; // Animation duration in milliseconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval; // Number of updates

    let currentCounts = { ...counts }; // Current values of counts
    const increment = {
      projects: targetCounts.projects / steps,
      posts: targetCounts.posts / steps,
      visitors: targetCounts.visitors / steps,
      mentors: targetCounts.mentors / steps,
    };

    const intervalId = setInterval(() => {
      currentCounts = {
        projects: Math.min(
          currentCounts.projects + increment.projects,
          targetCounts.projects
        ),
        posts: Math.min(
          currentCounts.posts + increment.posts,
          targetCounts.posts
        ),
        visitors: Math.min(
          currentCounts.visitors + increment.visitors,
          targetCounts.visitors
        ),
        mentors: Math.min(
          currentCounts.mentors + increment.mentors,
          targetCounts.mentors
        ),
      };
      setCounts({ ...currentCounts });

      // Stop the interval when the counts reach the target
      if (
        currentCounts.projects >= targetCounts.projects &&
        currentCounts.posts >= targetCounts.posts &&
        currentCounts.visitors >= targetCounts.visitors &&
        currentCounts.mentors >= targetCounts.mentors
      ) {
        clearInterval(intervalId);
      }
    }, interval);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 my-10 ">
      <div
        id="fullWidthTabContent"
        className="border-t border-gray-200 dark:border-gray-600"
      >
        <div
          className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800"
          id="stats"
          role="tabpanel"
          aria-labelledby="stats-tab"
        >
          <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900  xl:grid-cols-4 dark:text-white sm:p-8">
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">
                {Math.floor(counts.projects)}
              </dt>
              <dd className="text-gray-500 dark:text-gray-400">projects</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">
                {Math.floor(counts.posts)}
              </dt>
              <dd className="text-gray-500 dark:text-gray-400">Posts</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">
                {Math.floor(counts.visitors)}
              </dt>
              <dd className="text-gray-500 dark:text-gray-400">visitors</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">
                {Math.floor(counts.mentors)}+
              </dt>
              <dd className="text-gray-500 dark:text-gray-400">Mentors</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default CountView;
