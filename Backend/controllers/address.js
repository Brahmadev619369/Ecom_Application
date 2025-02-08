const Address = require("../models/address")


const addAddress = async (req, res) => {
    const {
        name,
        surname,
        email,
        mobile,
        address,
        state,
        city,
        pinCode
    } = req.body;

    const userId = req.user._id
    console.log(name);

    // Check if userId is available
    if (!userId) {
        return res.status(401).send({ error: "Unauthorized: User not authenticated." });
    }

    if (!name || !surname || !email || !mobile || !address || !state || !city || !pinCode) {
        return res.status(400).send({ error: "All field are require." })
    }

    try {
        const dbAddress = await Address.create({
            userId,
            name,
            surname,
            email,
            mobile,
            address,
            state,
            city,
            pinCode
        })

        console.log(dbAddress);
        
        return res.status(200).send({ message: "Address added succefully." })
    } catch (error) {
        return res.status(500).send({
            error: error
        })
    }
}


const getAddress = async(req,res) =>{
    const userId = req.user._id

    try {
        const data = await Address.find({userId})
        return res.status(200).send(data)
    } catch (error) {
        return res.status(500).send({
            error: error
        })
    }
}


const deleteAddress = async(req,res) =>{
    const {addressId} = req.params;
console.log(addressId);

    try {
        const address = await Address.findById(addressId)
        if(!address){
            return res.status(400).send({
                error:"Address not found."
            })
        }

        await Address.findByIdAndDelete(addressId)
        return res.status(200).send({
            msg :"Address Deleted Successfully."
        })
    } catch (error) {
        return res.status(500).send({
            error:error
        })
    }
}

module.exports = {
    addAddress,
    getAddress,
    deleteAddress
}