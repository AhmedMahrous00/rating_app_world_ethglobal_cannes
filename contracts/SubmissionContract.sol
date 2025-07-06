// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SubmissionContract {
    struct Submission {
        string pointer;
        address submitter;
        uint256 timestamp;
    }
    
    mapping(uint256 => Submission) public submissions;
    uint256 public submissionCount;
    
    event SubmissionCreated(uint256 indexed id, string pointer, address indexed submitter, uint256 timestamp);
    
    function submit(string memory pointer) public {
        require(bytes(pointer).length > 0, "Pointer cannot be empty");
        
        submissions[submissionCount] = Submission({
            pointer: pointer,
            submitter: msg.sender,
            timestamp: block.timestamp
        });
        
        emit SubmissionCreated(submissionCount, pointer, msg.sender, block.timestamp);
        submissionCount++;
    }
    
    function getSubmission(uint256 id) public view returns (string memory) {
        require(id < submissionCount, "Submission does not exist");
        return submissions[id].pointer;
    }
    
    function getSubmissionDetails(uint256 id) public view returns (string memory pointer, address submitter, uint256 timestamp) {
        require(id < submissionCount, "Submission does not exist");
        Submission memory submission = submissions[id];
        return (submission.pointer, submission.submitter, submission.timestamp);
    }
    
    function getSubmissionCount() public view returns (uint256) {
        return submissionCount;
    }
} 