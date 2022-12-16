import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({message: error.message})
	}
}

export const getUserFriends = async () => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		const friends = await Promise.all(
			user.friends.map((id) => User.findById(id))
		);
		const formarttedFriends = friends.map(
			({_id, firstName, lastName, occupation, location, picturePath }) => {
			 return {_id, firstName, lastName, occupation, location, picturePath };
			}
		)
		res.status(200).json(formarttedFriends);
	} catch (error) {
		res.status(404).json({message: error.message});
	}
}

/* UPDATE */
export const addRemoveFriend = async () => {}
