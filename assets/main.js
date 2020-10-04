var web3 = new Web3(Web3.givenProvider)
var contractInstance

// Minimum bet is 0.001 ether
const minimumBet = 0.001

$(document).ready(function() {
    console.log("In ready function!")
    const contractAddress = "0xce60aFa5e6d668914218429c0e6d0C65acBd0FE6"
    window.ethereum.enable().then( accounts => {
        //contractInstance = new web3.eth.Contract(abi, address, addressinjson)        
        contractInstance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
        console.log("contractInstance=", contractInstance)

        // Handle the betResult event
        contractInstance.events.betResult( (error,res) => {
            if(error) {
                console.log("error=", error)
                myAlert(`Error: ${error}`, "alert-danger", 5000)
            } else {
                console.log("betResult res=", res)
                const win = res.returnValues.value
                console.log("win=", win)
                if (win > 0) {
                    msg = "CONGRATULATION YOU WON " + web3.utils.fromWei(win.toString()) + " ether"
                    myAlert(msg, undefined, 5000)
                    textareaAdd(msg)
                } else {
                    //myAlert(`SORRY YOU LOST ${betAmount} ether`, "alert-danger", 5000)
                    msg = `SORRY YOU LOST !`
                    myAlert(msg, "alert-danger", 5000)
                    textareaAdd(msg)
                }
                updateBalance()
            }
            
        })
    })

    // update contract balance view
    updateBalance()
    
    // make the update happens in background
    backgroundBalance()


    
    // update the contract balance view on web page every 5s
    function backgroundBalance() {
        window.setTimeout(function() {
            updateBalance()
            backgroundBalance()
        }, 5000);
    }

    // hook bet-btn to bet function
    $("#bet-btn").click(bet)

    // bet function 
    // handle the bet
    function bet() {
        let betAmount = $("#bet").val()
        // Check that the bet is > minimum bet 
        if(betAmount < minimumBet) {
            msg = "Your bet has to be at least " + minimumBet +" ether"
            myAlert(msg, "alert-danger")
            textareaAdd(msg)
            return false
        }

        // Send the transaction to contract
        web3.eth.getBalance(contractAddress).then( balance => {
            let betAmountWei = web3.utils.toWei(betAmount, "ether")
            // Check that the bet amount is <= of half of contract balance
            if(betAmountWei > balance/2) {
                betAmount = web3.utils.fromWei(parseInt(balance/2).toString())
                $("#bet").val(betAmount)
                msg = `Your bet has been lowered to ${betAmount} ether`
                myAlert(msg, "alert-danger")
                textareaAdd(msg)
                return false
            }
            
            let config = {
                value: web3.utils.toWei(betAmount, "ether")
            }
            const coinSide = $("#betForm input[name='inlineCoinRadioOptions']:checked").val()
            console.log("radio= ", coinSide)
            let coinSideText = (coinSide == 0) ? "Head" : "Tail"
            textareaAdd("submitting bet transaction: Wait....")

            // Send the bet to the contract
            contractInstance.methods.betPlace(coinSide).send(config)
            .on('error', (error, receipt) => {
                msg = "ERROR submitting transaction...."
                myAlert(msg, "alert-danger")
                textareaAdd(msg)
            })
            .then( res => {
                console.log("betPlace res=", res)
                let playerAddress = res.events.betPlaced.returnValues.player
                let playerAddressShort = playerAddress.substr(0,6) + "..." + playerAddress.substr(-4)
                msg = `${playerAddressShort}: Your bet of ${betAmount} Ether on '${coinSideText}' is placed; Waiting for result....`
                myAlert(msg, undefined, 10000)
                textareaAdd(msg)
            })

        })
        
    }

    // update the contract balance on web page
    function updateBalance() {
        web3.eth.getBalance(contractAddress).then( balance => {
            $("#pot").text(balance/10**18 + " ether")
            console.log("Contract balance=",balance)
        })
        
    }

})

/*
// To fund the contract do this in console:
let Amount = "1" // 1 ether
let config = { value: web3.utils.toWei(Amount, "ether") }
contractInstance.methods.fund().send(config).then( res => { console.log("res=", res) } )

// To withdraw
contractInstance.methods.withdrawAll().send().then( res => { console.log("withdrawAll res=", res) } )
*/