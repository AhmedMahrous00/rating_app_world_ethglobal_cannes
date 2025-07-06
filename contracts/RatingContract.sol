// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RatingContract {
    struct Rating {
        uint8 rating;
        address rater;
        uint256 timestamp;
    }
    
    mapping(uint256 => Rating) public ratings;
    mapping(uint256 => uint256) public ratingCounts; // Count of ratings per submission
    mapping(uint256 => uint256) public totalRatings; // Sum of all ratings per submission
    
    event RatingSubmitted(uint256 indexed submissionId, uint8 rating, address indexed rater, uint256 timestamp);
    
    function rate(uint256 submissionId, uint8 rating) external {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        require(submissionId >= 0, "Invalid submission ID");
        
        // Check if user has already rated this submission
        // You could add a mapping to track this if needed
        
        ratings[submissionId] = Rating({
            rating: rating,
            rater: msg.sender,
            timestamp: block.timestamp
        });
        
        ratingCounts[submissionId]++;
        totalRatings[submissionId] += rating;
        
        emit RatingSubmitted(submissionId, rating, msg.sender, block.timestamp);
    }
    
    function getRating(uint256 submissionId) public view returns (uint8 rating, address rater, uint256 timestamp) {
        Rating memory ratingData = ratings[submissionId];
        return (ratingData.rating, ratingData.rater, ratingData.timestamp);
    }
    
    function getAverageRating(uint256 submissionId) public view returns (uint256 average) {
        uint256 count = ratingCounts[submissionId];
        if (count == 0) return 0;
        return totalRatings[submissionId] / count;
    }
    
    function getRatingCount(uint256 submissionId) public view returns (uint256) {
        return ratingCounts[submissionId];
    }
    
    function getTotalRating(uint256 submissionId) public view returns (uint256) {
        return totalRatings[submissionId];
    }
} 