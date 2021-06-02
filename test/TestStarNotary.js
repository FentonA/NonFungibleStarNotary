const StarNotary = artifacts.require("StarNotary");

var accounts; 
var owner; 

contract('StarNotary', (accs) =>{
    accounts = accs;
    owner = accounts[0];
});

it('Can it create a star', async ()=>{
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar("Alf's Star", tokenId, {from: owner});
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), "Alf's Star");
})

it('Can it be put up for sale', async () =>{
    let instance = await StarNotary.deployed();
    let user = accounts[1];
    let starId = 2
    let starPrice = web3.utils.toWei("0.1", "ether");
    await instance.createStar("Alf's Star", starId, {from: user});
    await instance.putStarUpForSale(starId, starPrice, {from: user});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
})

it('Can user get the funds after the sale', async()=>{
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei("0.01", "ether");
    let balance = web3.utils.toWei("0.05", "ether");
    await instance.createStar("Alf's Star", starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUserBeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUserAfterTransaction = await web3.eth.getBalance(user2);
    let value1 = Number(balanceOfUserBeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUserAfterTransaction);
    assert.equal(value1, value2);
} );

it('lets user2 buy a star, if it is put up for sale', async()=> { 
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei("0.01", "ether");
    let balance = web3.utils.toWei("0.5", "ether");
    await instance.createStar("Alf's Star", starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice,{from: user1});
    let balanceOfUserBeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it("lets user2 buy a star and decrease it's balance in ether", async() =>{
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar("Alf's Star", starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceOfUser2AfterTransaction = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceOfUser2AfterTransaction);
    assert.equal(value, starPrice);


})