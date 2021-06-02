pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract starNotary is ERC721{
    struct Star{
        string name;
    }
    
    constructor() public ERC721("GameItem", "ITM"){}
    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 =>uint256) public starsForSale;
    
    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);
        tokenIdToStarInfo[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
    }
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sell a Star that you don't own ");
        starsForSale[_tokenId] = _price;
    }
    
    function _make_payble(address x) internal pure returns (address payable) {
        return payable (address(uint160(x)));
    }
    
    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "This star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress  = ownerOf(_tokenId);

        require(msg.value > starCost, "You need to have enough ether");
        _transfer(ownerAddress, msg.sender, _tokenId);
        address payable ownerAddressPayable = _make_payble(ownerAddress);
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost){
            payable(msg.sender).transfer(msg.value - starCost);
        }
    }
    
}