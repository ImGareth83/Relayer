// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract Transactions is BaseRelayRecipient {
    address private admin;
    uint256 private id;
    uint256 private value;

    address private club;
    string private playerName;
    uint256 private fees;

    function versionRecipient() external pure override returns (string memory) {
        return "1";
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    function getClub() public view returns (address) {
        return club;
    }

    function getPlayerName()
        public
        view
        returns (address currentClub, string memory currentPlayer)
    {
        currentClub = club;
        currentPlayer = playerName;
    }

    function setPlayerName(string memory _playerName) public {
        playerName = _playerName;
    }

    function getFees() public view returns (uint256) {
        return fees;
    }

    function setFees(uint256 _fees) public {
        fees = _fees;
    }

    mapping(address => uint256) public nonces;

    bytes32 internal constant EIP712_DOMAIN_TYPEHASH =
        keccak256(
            bytes(
                "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
            )
        );

    bytes32 internal constant META_TRANSACTION_TYPEHASH =
        keccak256(bytes("MetaTransaction(uint256 nonce,address from)"));

    bytes32 internal DOMAIN_SEPARATOR =
        keccak256(
            abi.encode(
                EIP712_DOMAIN_TYPEHASH,
                keccak256(bytes("Quote")),
                keccak256(bytes("1")),
                42, // Kovan
                address(this)
            )
        );

    function initialize() public {
        admin = _msgSender();
        value = 0;
    }

    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
    }

    struct MetaTransaction {
        uint256 nonce;
        address from;
    }

    modifier onlyAdmin() {
        require(_msgSender() == admin);
        _;
    }

    modifier verifyAddress(address userAddress) {
        require(userAddress != address(0), "invalid-address-0");
        _;
    }

    function setTrustForwarder(address _trustForwarder) public {
        _setTrustedForwarder(_trustForwarder);
    }

    function store(uint256 _value) public {
        value = value + _value;
    }

    function getValue() public view returns (uint256) {
        return value;
    }

    function addPlayer(
        address userAddress,
        string memory _playerName,
        uint256 _fees,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public verifyAddress(userAddress) {
        MetaTransaction memory metaTx = MetaTransaction({
            nonce: nonces[userAddress],
            from: userAddress
        });

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(
                    abi.encode(
                        META_TRANSACTION_TYPEHASH,
                        metaTx.nonce,
                        metaTx.from
                    )
                )
            )
        );

        require(
            userAddress == ecrecover(digest, v, r, s),
            "invalid-signatures"
        );

        playerName = _playerName;
        fees = _fees;
        club = userAddress;

        //Increment Nonce for Replay Protection
        nonces[userAddress]++;
    }
}
