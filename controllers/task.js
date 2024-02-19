import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const newTask = async (req, res, next) => {
	const { title, description } = req.body;

	await Task.create({
		title,
		description,
		user: req.user,
	});
	
	res.status(201).json({
		success: true,
		message: "Task added Successfully",
	});
};

export const getMyTask = async (req, res, next) => {
	const userid = req.user._id;
	
	const tasks = await Task.find({ user: userid });
	
	res.status(200).json({
		success: true,
		tasks,
	});
};

export const updateTask = async (req, res, next) => {
	const {id} = req.params;
	
	try {
		const task = await Task.findById(id);
		task.isCompleted = !task.isCompleted;
		await task.save();
	}
	catch (err) {
		return next(new ErrorHandler("Task Not found", 404));
	}
	
	res.status(200).json({
		success: true,
		message: 'Task Updated'
	});
};

export const deleteTask = async (req, res, next) => {
	const {id} = req.params;

	try {
		const task = await Task.findById(id);
		if(task) {
			await task.deleteOne();
		}
		else {
			return next(new ErrorHandler("Task not found", 400));
		}
	}
	catch(err) {
		return next(new ErrorHandler(err, 404));
	}

	res.status(200).json({
		success: true,
		message: "Task Deleted",
	});
};