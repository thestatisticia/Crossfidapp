// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VotingSystem is Ownable, ReentrancyGuard {
    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        bool active;
        mapping(address => bool) hasVoted;
    }

    uint256 private campaignCounter;
    mapping(uint256 => Campaign) public campaigns;
    
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed campaignId,
        address indexed voter,
        bool support,
        uint256 timestamp
    );
    
    event CampaignEnded(
        uint256 indexed campaignId,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 timestamp
    );

    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId < campaignCounter, "Campaign does not exist");
        _;
    }

    modifier campaignActive(uint256 _campaignId) {
        require(campaigns[_campaignId].active, "Campaign is not active");
        require(block.timestamp >= campaigns[_campaignId].startTime, "Campaign has not started");
        require(block.timestamp <= campaigns[_campaignId].endTime, "Campaign has ended");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _duration
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_duration > 0, "Duration must be positive");
        
        uint256 campaignId = campaignCounter++;
        Campaign storage campaign = campaigns[campaignId];
        
        campaign.id = campaignId;
        campaign.creator = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.startTime = block.timestamp;
        campaign.endTime = block.timestamp + _duration;
        campaign.active = true;
        
        emit CampaignCreated(
            campaignId,
            msg.sender,
            _title,
            block.timestamp,
            campaign.endTime
        );
        
        return campaignId;
    }

    function vote(uint256 _campaignId, bool _support) 
        external 
        campaignExists(_campaignId)
        campaignActive(_campaignId)
        nonReentrant 
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.hasVoted[msg.sender], "Already voted");
        
        campaign.hasVoted[msg.sender] = true;
        
        if (_support) {
            campaign.votesFor++;
        } else {
            campaign.votesAgainst++;
        }
        
        emit VoteCast(_campaignId, msg.sender, _support, block.timestamp);
    }

    function endCampaign(uint256 _campaignId) 
        external 
        campaignExists(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.active, "Campaign already ended");
        require(
            block.timestamp > campaign.endTime || msg.sender == campaign.creator,
            "Cannot end campaign before end time unless creator"
        );
        
        campaign.active = false;
        
        emit CampaignEnded(
            _campaignId,
            campaign.votesFor,
            campaign.votesAgainst,
            block.timestamp
        );
    }

    function getCampaign(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (
            address creator,
            string memory title,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            uint256 votesFor,
            uint256 votesAgainst,
            bool active
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.startTime,
            campaign.endTime,
            campaign.votesFor,
            campaign.votesAgainst,
            campaign.active
        );
    }

    function hasVoted(uint256 _campaignId, address _voter)
        external
        view
        campaignExists(_campaignId)
        returns (bool)
    {
        return campaigns[_campaignId].hasVoted[_voter];
    }

    function getCampaignCount() external view returns (uint256) {
        return campaignCounter;
    }
}