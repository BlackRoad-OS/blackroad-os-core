// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Upstream721
 * @notice Immutability-first NFT standard for RoadChain
 * @dev Content hash IS the identity. No dynamic rendering. No mutable pointers.
 *
 * Philosophy:
 * - Same token = same content forever
 * - Metadata on-chain or content-addressed
 * - Screenshots are verifiable evidence
 * - Historical state is permanent
 * - If it changes, it's a new version (explicit commit)
 */
contract Upstream721 {
    struct TokenData {
        bytes32 contentHash;      // SHA-256 of actual content (IDENTITY)
        string metadata;          // Inline JSON (IMMUTABLE)
        uint256 mintBlock;        // Block minted at
        address minter;           // Who minted
        bool allowVersioning;     // If true, can create versions
    }

    struct Version {
        uint256 versionNumber;
        bytes32 contentHash;
        string metadata;
        uint256 timestamp;
        address author;
        string commitMessage;     // Why this changed
    }

    // Token ID => Token Data
    mapping(uint256 => TokenData) private _tokens;

    // Token ID => Owner
    mapping(uint256 => address) private _owners;

    // Token ID => Approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Owner => Operator => Approved
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Token ID => Version Number => Version Data
    mapping(uint256 => mapping(uint256 => Version)) private _versions;

    // Token ID => Current Version Number
    mapping(uint256 => uint256) private _currentVersions;

    // Total supply
    uint256 private _totalSupply;

    // Events
    event TokenMinted(
        uint256 indexed tokenId,
        address indexed minter,
        bytes32 contentHash,
        bool allowVersioning
    );

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    event VersionCreated(
        uint256 indexed tokenId,
        uint256 indexed versionNumber,
        bytes32 contentHash,
        string commitMessage
    );

    // Errors
    error TokenDoesNotExist(uint256 tokenId);
    error NotTokenOwner(address caller, uint256 tokenId);
    error NotAuthorized(address caller);
    error VersioningNotAllowed(uint256 tokenId);
    error ContentHashMismatch(bytes32 expected, bytes32 actual);
    error InvalidAddress(address addr);
    error TokenAlreadyExists(uint256 tokenId);

    /**
     * @notice Mint new immutable token
     * @param tokenId Unique token ID
     * @param contentHash SHA-256 of content (IDENTITY)
     * @param metadata On-chain metadata (JSON string)
     * @param allowVersioning If true, enables Git-style versioning
     */
    function mint(
        uint256 tokenId,
        bytes32 contentHash,
        string calldata metadata,
        bool allowVersioning
    ) external {
        if (_owners[tokenId] != address(0)) {
            revert TokenAlreadyExists(tokenId);
        }

        _owners[tokenId] = msg.sender;
        _tokens[tokenId] = TokenData({
            contentHash: contentHash,
            metadata: metadata,
            mintBlock: block.number,
            minter: msg.sender,
            allowVersioning: allowVersioning
        });

        // Version 0 = original
        if (allowVersioning) {
            _versions[tokenId][0] = Version({
                versionNumber: 0,
                contentHash: contentHash,
                metadata: metadata,
                timestamp: block.timestamp,
                author: msg.sender,
                commitMessage: "Initial version"
            });
            _currentVersions[tokenId] = 0;
        }

        _totalSupply++;

        emit TokenMinted(tokenId, msg.sender, contentHash, allowVersioning);
        emit Transfer(address(0), msg.sender, tokenId);
    }

    /**
     * @notice Create new version (Git-style commit)
     * @param tokenId Token to version
     * @param newContentHash New content hash
     * @param newMetadata New metadata
     * @param commitMessage Why this changed
     */
    function createVersion(
        uint256 tokenId,
        bytes32 newContentHash,
        string calldata newMetadata,
        string calldata commitMessage
    ) external {
        if (_owners[tokenId] == address(0)) {
            revert TokenDoesNotExist(tokenId);
        }
        if (_owners[tokenId] != msg.sender) {
            revert NotTokenOwner(msg.sender, tokenId);
        }
        if (!_tokens[tokenId].allowVersioning) {
            revert VersioningNotAllowed(tokenId);
        }

        uint256 newVersion = _currentVersions[tokenId] + 1;

        _versions[tokenId][newVersion] = Version({
            versionNumber: newVersion,
            contentHash: newContentHash,
            metadata: newMetadata,
            timestamp: block.timestamp,
            author: msg.sender,
            commitMessage: commitMessage
        });

        _currentVersions[tokenId] = newVersion;

        // Update current token data
        _tokens[tokenId].contentHash = newContentHash;
        _tokens[tokenId].metadata = newMetadata;

        emit VersionCreated(tokenId, newVersion, newContentHash, commitMessage);
    }

    /**
     * @notice Get immutable token data
     */
    function getTokenData(uint256 tokenId)
        external
        view
        returns (TokenData memory)
    {
        if (_owners[tokenId] == address(0)) {
            revert TokenDoesNotExist(tokenId);
        }
        return _tokens[tokenId];
    }

    /**
     * @notice Get specific version
     */
    function getVersion(uint256 tokenId, uint256 versionNumber)
        external
        view
        returns (Version memory)
    {
        if (_owners[tokenId] == address(0)) {
            revert TokenDoesNotExist(tokenId);
        }
        return _versions[tokenId][versionNumber];
    }

    /**
     * @notice Get current version number
     */
    function getCurrentVersion(uint256 tokenId)
        external
        view
        returns (uint256)
    {
        if (_owners[tokenId] == address(0)) {
            revert TokenDoesNotExist(tokenId);
        }
        return _currentVersions[tokenId];
    }

    /**
     * @notice Verify content hash (for screenshot verification)
     * @param tokenId Token to verify
     * @param expectedHash Expected content hash
     * @param atVersion Optional version (0 = current)
     */
    function verifyContentHash(
        uint256 tokenId,
        bytes32 expectedHash,
        uint256 atVersion
    ) external view returns (bool) {
        if (_owners[tokenId] == address(0)) {
            revert TokenDoesNotExist(tokenId);
        }

        if (_tokens[tokenId].allowVersioning && atVersion > 0) {
            return _versions[tokenId][atVersion].contentHash == expectedHash;
        }

        return _tokens[tokenId].contentHash == expectedHash;
    }

    /**
     * @notice Get version history
     */
    function getVersionHistory(uint256 tokenId)
        external
        view
        returns (Version[] memory)
    {
        if (_owners[tokenId] == address(0)) {
            revert TokenDoesNotExist(tokenId);
        }

        uint256 currentVersion = _currentVersions[tokenId];
        Version[] memory history = new Version[](currentVersion + 1);

        for (uint256 i = 0; i <= currentVersion; i++) {
            history[i] = _versions[tokenId][i];
        }

        return history;
    }

    // Standard ERC-721 functions

    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = _owners[tokenId];
        if (owner == address(0)) {
            revert TokenDoesNotExist(tokenId);
        }
        return owner;
    }

    function balanceOf(address owner) external view returns (uint256) {
        if (owner == address(0)) {
            revert InvalidAddress(owner);
        }

        uint256 balance = 0;
        for (uint256 i = 0; i < _totalSupply; i++) {
            if (_owners[i] == owner) {
                balance++;
            }
        }
        return balance;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external {
        if (_owners[tokenId] != from) {
            revert NotTokenOwner(from, tokenId);
        }
        if (msg.sender != from &&
            _tokenApprovals[tokenId] != msg.sender &&
            !_operatorApprovals[from][msg.sender]) {
            revert NotAuthorized(msg.sender);
        }
        if (to == address(0)) {
            revert InvalidAddress(to);
        }

        delete _tokenApprovals[tokenId];
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) external {
        address owner = _owners[tokenId];
        if (msg.sender != owner && !_operatorApprovals[owner][msg.sender]) {
            revert NotAuthorized(msg.sender);
        }

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        if (_owners[tokenId] == address(0)) {
            revert TokenDoesNotExist(tokenId);
        }
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool)
    {
        return _operatorApprovals[owner][operator];
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    // Required by ERC-721
    function supportsInterface(bytes4 interfaceId)
        external
        pure
        returns (bool)
    {
        return
            interfaceId == 0x80ac58cd || // ERC-721
            interfaceId == 0x01ffc9a7;   // ERC-165
    }
}
