const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name :{
        type:String,
        require:true
    },
    description :{
        type:String,
        require:true
    },
    category:{
        type:String,
        enum:["Men","Women","Kids"]
    },
    subCategory:{
        type:String,
        enum:["Topwear","Bottomwear","Winterwear"]
    },
    Mrp:{
        type:Number,
        require:true
    },
    price:{
          type:Number,
        require:true
    },
    inStock:{
        type:Number,
      require:true
  },
    sizes:{
        type:Array,
        require:true
    },
    image:{
        type:Array,
        require:true
    },
    bestseller :{
        type:Boolean
    }
    
})


const Products = mongoose.model("Products",productSchema)

module.exports = Products