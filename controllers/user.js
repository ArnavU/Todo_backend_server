import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllUsers = async (req, res) => {
	const users = await User.find({});

	res.json({
		success: true,
		users,
	});
};

export const register = async (req, res, next) => {
	const { name, email, password } = req.body;

	try {
		let user = await User.findOne({ email });
		if(user) {
			return next(new ErrorHandler("User already exixt", 400));
		}
		else {
			const hashedPassword = await bcrypt.hash(password, 10);
			user = await User.create({ name, email, password: hashedPassword });
			sendCookie(user, res, "Registered Successfully", 201);
		}
	}
	catch(err) {
		return next(new ErrorHandler("Internal Server Error", 400));
	}
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select("+password");

	if (!user) return next(new ErrorHandler("Invalid email or password", 400));

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch)
		return next(new ErrorHandler("Invalid Email or Password", 400));

	sendCookie(user, res, `Welcome back, ${user.name}`, 200);
};

export const getMyProfile = (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user,
	});
};

export const logout = (req, res) => {
	res.status(200)
		.cookie("token", "", {
			expires: new Date(),
            sameSite: process.env.NODE_ENV==="Development" ? "lax" : "none",
            secure: process.env.NODE_ENV==="Development" ? false : true,            
		})
		.json({
			success: true,
			message: "User logged out successfully",
			user: req.user,
		});
};
