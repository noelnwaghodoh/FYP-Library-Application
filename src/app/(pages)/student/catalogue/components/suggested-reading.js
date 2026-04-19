"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";

export function SuggestedReading({ message, onCourseSelect }) {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch the list of courses array mapping from your new Express endpoint
                const response = await axios.get(`${API_URL}/courses`, { withCredentials: true });
                setCourses(response.data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
         <div className="py-12 flex flex-col items-center text-center max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Suggested Reading</h3>
            <p className="text-gray-600 mb-6">
              Select your specific course from the menu below to instantly view your tailored reading list.
            </p>
            
            <div className="w-full max-w-sm">
                <select 
                    onChange={(e) => onCourseSelect && onCourseSelect(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2ba5c7] text-gray-700 font-medium transition-colors cursor-pointer"
                >
                    <option value="">{isLoading ? "Loading courses..." : "— Select a Course —"}</option>
                    {courses.map((course) => (
                        <option 
                            key={course.CourseID || course.id} 
                            value={course.CourseID || course.id}
                        >
                            {course.CourseName || course.coursename || "Unnamed Course"}
                        </option>
                    ))}
                </select>
            </div>
            
            {message && <p className="text-sm mt-4 text-[#2ba5c7] font-medium">{message}</p>}
          </div>
    );
}