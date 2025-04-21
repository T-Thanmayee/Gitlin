import React, { useState, useEffect, useRef } from 'react';
import Slide from '../../components/ui/Slide';

function CountView() {
  const [counts, setCounts] = useState({
    projects: 0,
    posts: 0,
    visitors: 0,
    mentors: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, []);

  useEffect(() => {
    if (!isVisible) return; // Only run counter logic when visible

    const targetCounts = {
      projects: 10,
      posts: 2000,
      visitors: 3000,
      mentors: 150,
    };

    const duration = 2000; // Animation duration in milliseconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval; // Number of updates

    const increment = {
      projects: targetCounts.projects / steps,
      posts: targetCounts.posts / steps,
      visitors: targetCounts.visitors / steps,
      mentors: targetCounts.mentors / steps,
    };

    const intervalId = setInterval(() => {
      setCounts((prevCounts) => {
        const newCounts = {
          projects: Math.min(prevCounts.projects + increment.projects, targetCounts.projects),
          posts: Math.min(prevCounts.posts + increment.posts, targetCounts.posts),
          visitors: Math.min(prevCounts.visitors + increment.visitors, targetCounts.visitors),
          mentors: Math.min(prevCounts.mentors + increment.mentors, targetCounts.mentors),
        };

        // Stop the interval when all counts reach their targets
        if (
          newCounts.projects >= targetCounts.projects &&
          newCounts.posts >= targetCounts.posts &&
          newCounts.visitors >= targetCounts.visitors &&
          newCounts.mentors >= targetCounts.mentors
        ) {
          clearInterval(intervalId);
        }

        return newCounts;
      });
    }, interval);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [isVisible]);

  return (
    <div
      className="will-change-scroll w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 my-10"
      ref={statsRef} // Attach ref for Intersection Observer
    >
      <div id="fullWidthTabContent" className="border-t border-gray-200 dark:border-gray-600">
        <div
          className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800"
          id="stats"
          role="tabpanel"
          aria-labelledby="stats-tab"
        >
          <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 xl:grid-cols-4 dark:text-white sm:p-8">
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">{Math.floor(counts.projects)}</dt>
              <dd className="text-gray-500 dark:text-gray-400">Projects</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">{Math.floor(counts.posts)}</dt>
              <dd className="text-gray-500 dark:text-gray-400">Posts</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">{Math.floor(counts.visitors)}</dt>
              <dd className="text-gray-500 dark:text-gray-400">Visitors</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold">{Math.floor(counts.mentors)}+</dt>
              <dd className="text-gray-500 dark:text-gray-400">Mentors</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default CountView;