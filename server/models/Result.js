import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
	imageId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Image",
	},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    imageUrl: String,
    finalResult: String,
    confidence: Number,

    efficientnet: {
        label: String,
        conf: Number,
    },
    mobilenet: {
    	label: String,
      	conf: Number,
    },
}, { timestamps: true });

const Result = mongoose.model("Result", resultSchema);
export default Result;
