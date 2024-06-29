const {Router} = require ('express');
const Task = require ('../Model/Task');
const { check, validationResult } = require('express-validator');

const router = Router();

router.post(
    '/tasks',

    [
        check('nameOfGoal','Name of goal is required').not().isEmpty(),
        check('descriptionOfGoal', 'description for goal is required').not().isEmpty(),
        check('statusOfGoal', 'status must be boolean').isBoolean()
    ],

    async (req, res) => {
        try {
            const error = validationResult(req)

            if(!error.isEmpty()){
                return res.status(400).json({
                    error:error.array(),
                    message:'Wrong data'
                });
            }

            const {nameOfGoal,descriptionOfGoal, statusOfGoal} = req.body;
            const isExist = await Task.findOne({nameOfGoal});

            if(isExist){
                return res.status(400).json({message:'Such goal already exist'});
            }

            const task = new Task ({nameOfGoal, descriptionOfGoal, statusOfGoal});
            await task.save();
            res.status(201).json({ message: 'Task successfully added' })
        } catch (error) {
            console.log(error)
            res.status(500).json({message:'Something go wrong, try again'})
        }
    }
)

router.patch(
    '/tasks/:id',
    async (req, res) => {
        try {
            const taskName = req.params.id;
            const allowedUpdates = [ 'descriptionOfGoal', 'statusOfGoal'];
            const updateData = {};

            for (let key of allowedUpdates) {
                if (req.body.hasOwnProperty(key)) {
                    updateData[key] = req.body[key];
                }
            }

            const updatedTask = await Task.findOneAndUpdate(
                { nameOfGoal:  taskName},
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }

       
            await updatedTask.save();

            res.status(200).json(updatedTask);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Something went wrong, try again' });
        }
    }
);

router.get(
    '/tasks', 

    async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

router.delete(
    '/tasks/:id',

    async (req, res) => {
        try {
            const taskName  = req.params.id;
            const deletedTask = await Task.findOneAndDelete({ nameOfGoal: taskName });
            const data = await Task.find(); 

            if (!deletedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }

            const tasks = data.filter(task => task.nameOfGoal !== taskName); 
        
            await Task.deleteMany({}); 
            await Task.insertMany(tasks);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong, try again' });
        }
    }
);

router.delete(
    '/tasks',

    async (req, res) => {
        try {
            await Task.deleteMany({});
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong, try again' });
        }
    }
);

module.exports = router;