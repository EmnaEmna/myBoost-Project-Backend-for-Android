// const asyncHandler = require('express-async-handler')

// const Project = require('../models/projectModel')
// const Group = require('../models/groupModel')
import asyncHandler from 'express-async-handler';
import Project from '../models/projectModel.js';
import Group from '../models/groupModel.js';

// Rest of your code...

// @desc    Get projects
// @route   GET /api/project
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ group: req.body.groupId })
  console.log("groupdId"+req.body.groupId)
//findbyid
  res.status(200).json(projects)
})

// @desc    create project
// @route   POST /api/project
export const createproject = asyncHandler(async (req, res) => {
  try {
    if (!req.body.gitlink) {
      res.status(400)
      throw new Error("Please add a gitlink for your project");
    }

    const project = await Project.create({
      name: req.body.name,
      gitlink: req.body.gitlink,
      text: req.body.text,
      group: req.body.groupId,
      assignedto: req.body.assignedto,
      deadline: req.body.deadline,
      status: req.body.status,
    });

    res.status(200).json(project);
    console.log("taaaaask aaaaaaaaaaddeeeeed"+ project)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @desc    Update project
// @route   PUT /api/project/:id
/*const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    res.status(400)
    throw new Error('Project not found')
  }

  // Check for user
  if (!req.group) {
    res.status(401)
    throw new Error('Group not found')
  }

  // Make sure the logged in user matches the group user
  if (project.group.toString() !== req.group.id) {
    res.status(401)
    throw new Error('Group not authorized')
  }

  const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedGroup)
})*/

// const updateProject = asyncHandler(async (req, res) => {
//   try {
//     const projectId = req.query.taskid;
//     const updatedProject = await Project.findByIdAndUpdate(
//       projectId,
//       req.body,
//       { new: true }
//     );

//     if (!updatedProject) {
//       res.status(404);
//       throw new Error(`Project with ID ${projectId} not found`);
//     }

//     res.status(200).json(updatedProject);
//     console.log("project updated sucessufully "+updatedProject)
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// });

export const updateProject = asyncHandler(async (req, res) => {
  try {
    const projectId = req.query.projectId;
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      req.body,
      { new: true }
    );

    if (!updatedProject) {
      res.status(404);
      throw new Error(`Project with ID ${projectId} not found`);
    }

    res.status(200).json(updatedProject);
    console.log("Project updated successfully: " + updatedProject);
  } catch (error) {
    if (error.message.includes("not found")) {
      // Gérer l'erreur de projet non trouvé
      res.status(404).json({ error: error.message });
    } else {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
});


// @desc    Delete project
// @route   DELETE /api/groups/:id
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Group.findById(req.params.id)

  if (!project) {
    res.status(400)
    throw new Error('Group not found')
  }

  // Check for group
  if (!req.group) {
    res.status(401)
    throw new Error('Group not found')
  }

  // Make sure the logged in group matches the  project group
  if (project.group.toString() !== req.group.id) {
    res.status(401)
    throw new Error('group not authorized')
  }

  await project.remove()

  res.status(200).json({ id: req.params.id })
})


export const getGroupEmails = asyncHandler(async (req, res) => {
  console.log("aaaaaa " + req.params.groupId)
   const group = await Group.findById(req.query.groupId);
 
   if (!group) {
     res.status(400);
     throw new Error("Group not found");
   }
 
   const emails = group.emails;
   console.log("result is " + group.emails)
   res.status(200).json(emails);
 });


// module.exports = {
  // getGroupEmails,
  // getProjects,
  //   createproject,
  //   updateProject,
  // deleteProject,

  
// }
export default {
  getGroupEmails,
  getProjects,
    createproject,
    updateProject,
  deleteProject,
};
