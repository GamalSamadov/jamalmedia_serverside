import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			require: true,
			min: 2,
			max: 50,
		},
		lastname: {
			type: String,
			require: true,
			min: 2,
			max: 50,
		},
		email: {
			type: String,
			require: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			require: true,
			min: 5,
		},
		picturePath: {
			type: String,
			default: "",
		},
		friends: {
			type: Array,
			default: [],
		},
		location: String,
		occupation: String,
		viewedProfile: Number,
		impressions: Number,
	}, 
		{ timestemps: true }
)

const User = mongoose.model('User', UserSchema)
export default User