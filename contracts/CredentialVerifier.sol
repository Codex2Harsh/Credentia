// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CredentialVerifier {
    
    struct Credential {
        string studentName;
        string studentID;        // new: store the human-readable ID
        string courseName;
        string institution;
        uint256 issueDate;
        address issuer;
        bool isValid;
    }

    // map recordId => Credential
    mapping(bytes32 => Credential) public credentials;

    // track if a student ID (hashed) is already used
    mapping(bytes32 => bool) public idExists;

    event CredentialIssued(bytes32 indexed recordId, bytes32 indexed studentIdHash, address indexed issuer);

    // updated signature to take studentID separately
    function issueCredential(
        string memory _studentName,
        string memory _studentID,
        string memory _courseName,
        string memory _institution
    ) public returns (bytes32) {
        
        // normalize by hashing the provided studentID (client should trim/lowercase ideally)
        bytes32 studentIdHash = keccak256(abi.encodePacked(_studentID));

        // prevent duplicate issuance for the same student ID
        require(!idExists[studentIdHash], "Student ID already issued");

        // 1. Create unique hash from student data + timestamp
        bytes32 recordId = keccak256(abi.encodePacked(_studentName, _studentID, _courseName, _institution, block.timestamp, msg.sender));

        // 2. Write to Blockchain Storage
        credentials[recordId] = Credential({
            studentName: _studentName,
            studentID: _studentID,
            courseName: _courseName,
            institution: _institution,
            issueDate: block.timestamp,
            issuer: msg.sender,
            isValid: true
        });

        // mark this studentID as used
        idExists[studentIdHash] = true;

        emit CredentialIssued(recordId, studentIdHash, msg.sender);
        return recordId;
    }

    // verify by recordId (same as before)
    function verifyCredential(bytes32 _recordId) public view returns (string memory, string memory, string memory, uint256, bool) {
        Credential memory c = credentials[_recordId];
        require(c.isValid, "Credential not found.");
        return (c.studentName, c.courseName, c.institution, c.issueDate, c.isValid);
    }

    // optional helper: query whether an ID (string) is already issued
    function checkIdExists(string memory _studentID) public view returns (bool) {
        bytes32 studentIdHash = keccak256(abi.encodePacked(_studentID));
        return idExists[studentIdHash];
    }
}
