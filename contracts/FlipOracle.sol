// SPDX-License-Identifier: MIT
import "./Ownable.sol";
import "./provableAPI.sol";

//import "github.com/provable-things/ethereum-api/provableAPI.sol";
pragma solidity 0.5.12;

contract FlipOracle is Ownable, usingProvable {

    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;

    struct Player {
        address _address;
        uint _value;
        uint _coinSide;
    }
    mapping(bytes32 => Player) public playerbets;

    event betPlaced(address player, uint value, bytes32 _queryId);
    event betResult(address player, uint value);
    event betRandomFailed(bytes32 _queryId);
    event debug1(string message);
    uint public debugCount = 0;
    uint public debugRandom = 2;
    
    modifier costs(uint cost){
        require(msg.value >= cost);
        _;
    }

    constructor()
        public
    {
        provable_setProof(proofType_Ledger);
        update();
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    // Pseudo random function 
    // Returns 0 or 1
    function random() public view returns(uint val) {
        return block.timestamp % 2;
    }

    function betPlace(uint userBet) public payable costs(0.001 ether) {
        uint balance = address(this).balance;
        require(msg.value <= balance / 2, "Bet stake is too high");
        
        // Call oracle for random number
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
        bytes32 _queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );
        //emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
        
        playerbets[_queryId] = Player(msg.sender, msg.value, userBet);
        emit betPlaced(msg.sender, msg.value, _queryId);
    }
/*
    function betResult() {
        uint win = 0;
        if (random() == userBet) {
        //if (1 == 1) {
            win = msg.value * 2;
            msg.sender.transfer(win);
        }
        emit betResult(msg.sender, win);
    }
*/
    function fund() public payable {
    }

    function withdrawAll() public onlyOwner {
        //address payable payAddress = address(owner);
        msg.sender.transfer(address(this).balance);
    }


    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof ) public {
        debugRandom = 2 + debugCount;
        debugCount++;
        emit debug1("In __callback (top)");
        require(msg.sender == provable_cbAddress());

        if (
            provable_randomDS_proofVerify__returnCode(
                _queryId,
                _result,
                _proof
            ) != 0
        ) {
            /**
             * @notice  The proof verification has failed! Handle this case
             *          however you see fit.
             */
             emit betRandomFailed(_queryId);
        } else {
            /**
             *
             * @notice  The proof verifiction has passed!
             *
             *          Let's convert the random bytes received from the query
             *          to a `uint256`.
             *
             *          To do so, We define the variable `ceiling`, where
             *          `ceiling - 1` is the highest `uint256` we want to get.
             *          The variable `ceiling` should never be greater than:
             *          `(MAX_INT_FROM_BYTE ^ NUM_RANDOM_BYTES_REQUESTED) - 1`.
             *
             *          By hashing the random bytes and casting them to a
             *          `uint256` we can then modulo that number by our ceiling
             *          in order to get a random number within the desired
             *          range of [0, ceiling - 1].
             *
             */
            //uint256 ceiling = (MAX_INT_FROM_BYTE ** NUM_RANDOM_BYTES_REQUESTED) - 1;
            uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
            //emit generatedRandomNumber(randomNumber);
            //playerbets[_queryId] = Player(msg.sender, msg.value, userBet);
            uint win = 0;
            debugRandom = randomNumber;
            if (randomNumber == playerbets[_queryId]._coinSide) {
            //if (1 == 1) {
                win = playerbets[_queryId]._value * 2;
                address payable playerWallet = address(uint160(playerbets[_queryId]._address));
                playerWallet.transfer(win);
            }
            emit betResult(playerbets[_queryId]._address, win);
        }
    }

    function update() payable public returns (bytes32 _queryId) {
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
        _queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );
        //emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
        return _queryId;
    }


    //fallback() external payable {}
    //fallback() public payable {} 


}
