// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CredentialVerifier
 * @dev A smart contract to issue and verify academic credentials on the Ethereum blockchain.
 */
contract CredentialVerifier {
    
    // Structure to hold credential details
    struct Credential {
        string studentName;
        string courseName;
        string institution;
        uint256 issueDate;
        address issuer;
        bool isValid;
    }

    // Mapping to store credentials. 
    // The key is a unique hash (bytes32), and the value is the Credential struct.
    mapping(bytes32 => Credential) public credentials;

    // Event declared to notify frontend applications when a credential is created
    event CredentialIssued(bytes32 indexed recordId, address indexed issuer);

    /**
     * @dev Issues a new credential.
     * @param _studentName Name of the student.
     * @param _courseName Name of the degree/course.
     * @param _institution Name of the university/organization.
     * @return recordId The unique hash (ID) of the new credential.
     */
    function issueCredential(
        string memory _studentName, 
        string memory _courseName, 
        string memory _institution
    ) public returns (bytes32) {
        
        // Generate a unique ID for the credential based on input data and timestamp
        // keccak256 is the standard hashing algorithm used in Ethereum
        bytes32 recordId = keccak256(abi.encodePacked(_studentName, _courseName, _institution, block.timestamp, msg.sender));

        // Store the credential in the blockchain state
        credentials[recordId] = Credential({
            studentName: _studentName,
            courseName: _courseName,
            institution: _institution,
            issueDate: block.timestamp,
            issuer: msg.sender,
            isValid: true
        });

        // Emit an event so the outside world knows a block was written
        emit CredentialIssued(recordId, msg.sender);

        return recordId;
    }

    /**
     * @dev Verifies if a credential exists and returns its details.
     * @param _recordId The unique hash of the credential to verify.
     */
    function verifyCredential(bytes32 _recordId) public view returns (
        string memory studentName,
        string memory courseName,
        string memory institution,
        uint256 issueDate,
        bool isValid
    ) {
        Credential memory c = credentials[_recordId];
        
        // Require that the credential actually exists (isValid is true)
        require(c.isValid, "Credential not found or invalid.");

        return (c.studentName, c.courseName, c.institution, c.issueDate, c.isValid);
    }
}