import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },

    slug:{
        type:String,
        unique:true,
        required:true
    },

    description:{
        type:String,
        default:""
    },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    sku:{
        type:String,
        unique:true
    },

    price:{
        type:Number,
        required:true
    },

    salePrice:{
        type:Number,
        default:0
    },

    stock:{
        type:Number,
        default:0
    },

    thumbnail:{
        type:String,
        default:""
    },

    images:[String],

    rating:{
        type:Number,
        default:0
    },

    totalReviews:{
        type:Number,
        default:0
    },

    isFeatured:{
        type:Boolean,
        default:false
    },

    status:{
        type:String,
        enum:[
            "draft",
            "published"
        ],
        default:"draft"
    },

    isDeleted:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

export default mongoose.model(
    "Product",
    productSchema
);