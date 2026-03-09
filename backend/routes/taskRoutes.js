const express = require('express')
const router = express.Router()
const Task = require('../models/Task')

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: tasks.length, tasks })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
    res.status(200).json({ success: true, task })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST create task
router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ title: req.body.title })
    res.status(201).json({ success: true, task })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
    res.status(200).json({ success: true, task })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
    res.status(200).json({ success: true, message: 'Task deleted', task })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
