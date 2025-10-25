import { RequestHandler } from "express";
import { ProgressAnalyticsResponse } from "../../shared/api.js";

export const handleProgressAnalytics: RequestHandler = async (req, res) => {
    try {
        // Check if user is authenticated (this would typically be done via middleware)
        // For now, we'll check if userId is provided in the request
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            const errorResponse: ProgressAnalyticsResponse = {
                success: false,
                analytics: null,
                message: "User authentication required. Please log in to view your progress."
            };
            return res.status(401).json(errorResponse);
        }

        // Use the Firebase user ID as the access key for the gaming platform
        const accessKey = userId;

        // Fetch analytics from the external API with user authorization
        const response = await fetch(`https://spasht-game.vercel.app/api/analytics?access_key=${accessKey}`);

        if (!response.ok) {
            // If external API fails or returns 404 (user not found), return empty state
            const emptyResponse: ProgressAnalyticsResponse = {
                success: false,
                analytics: null,
                message: "No progress data available yet. Start playing games to see your analytics!"
            };
            return res.status(200).json(emptyResponse);
        }

        const data = await response.json();

        // Return the analytics data
        const analyticsResponse: ProgressAnalyticsResponse = {
            success: true,
            analytics: data.analytics || null,
            message: data.analytics ? "Progress data retrieved successfully" : "No progress data available yet"
        };

        res.status(200).json(analyticsResponse);
    } catch (error) {
        console.error('Error fetching progress analytics:', error);

        // Return empty state on error
        const errorResponse: ProgressAnalyticsResponse = {
            success: false,
            analytics: null,
            message: "Unable to load progress data. Please try again later."
        };

        res.status(200).json(errorResponse);
    }
};
