// const asyncHandler = require('express-async-handler')
// const jwt = require('jsonwebtoken')


// const Group = require('../models/groupModel')
// const User = require('../models/userModel')
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import Group from '../models/groupModel.js';
import User from '../models/userModel.js';
import Project from '../models/projectModel.js';

// Rest of your code...

// @desc    Get groups
// @route   GET /api/groups
export const getGroups = asyncHandler(async (req, res) => {
    const groupsFromGrp = await Group.find({

emails:req.userData.email

    })
    // console.log("aaaa " + groupsFromGrp)
     const newGroups = [];

    for(let grpId in req.userData.groups){
   
        const grp = await Group.find({emails: req.userData.groups[grpId]});
     
       newGroups.push(grp);
     }

     //remove duplicates
    // const groups = [...new Set([...newGroups, ...groupsFromGrp])];
    res.status(200).json(groupsFromGrp);
})

export const getGroupbyid = asyncHandler(async (req, res) => {
    const groups = await Group.findById({user: req.user.id})
    //findbyid
    res.status(200).json(groups)
})


export const updateEmail = async (req, res) => {
    const {groupId,emailToEdit, newEmail} = req.body;
    const grp = await Group.findById(groupId);
    const emails = grp.emails;
    const newemails = [];
    //if found, remove old email and add new email
    emails.forEach(email => {
        if (email === emailToEdit) {
            email = newEmail;
        }
        newemails.push(email);
    });
    try {
        const newGrp = await Group.findOneAndUpdate(
            {_id: req.params.id},
            {
                emails: newemails
            },
            {new: true}
        );
        await newGrp.save();
        res.status(200).json(newGrp);
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}


//Update Name Group
/*
const updateNameGroup = async (req, res) => {
  const { nameToEdit,newName } = req.body;
  const grp = await Group.findById(req.params.id);
  const name = grp.name;
  const newN="";
  //if found, remove old email and add new email
  
    if (name === nameToEdit ) {
      name=newName;
    }
    
  newN.push(name)
  try {
      const newGrp = await Group.findOneAndUpdate(
          {_id: req.params.id},
          {
              name: newN
          },
          {new: true}
      );
      await newGrp.save();
      res.status(200).json(newGrp);
  }catch (err) {
      res.status(400).json({"message": err.message});
  }
}
*/


// @desc    create group
// @route   POST /api/groups
export const creategroup = asyncHandler(async (req, res) => {
    // console.log("***********" + req.userData);
    //console.log("+++++++++++++++++" + req.userData._id);


    /* if (!req.body.name) {
       res.status(400)
       throw new Error('Please add a name for your group project')
     }*/


    const group = await Group.create({
        name: req.body.name,
        year: req.body.year,
        classroom: req.body.classroom,
        emails: req.body.emails,
        user: req.userData._id,

    })

    const customGroup = {
        "name": group.user.name,
        "emails": group.user.emails,
        //"userid":group.userData._id,
        "groupName": group.name,
        "Year": group.year,
        "Calssrom": group.Calssrom,
        'groupId': group._id,
        grpToken: generateToken(group._id),
        userToken: req.headers['jwt']
    }


    const emails = req.body.emails;
    for (const email of emails) {
        const user
            = await
            User.findOneAndUpdate(
                {
                    email: email
                },
                {
                    $push: {
                        groups: group._id
                    }
                },
                {new: true}
            );
        if (!user) {
            console.log("not found")
        } else {
            user.save();
        }
    }

    res.status(200).json(customGroup)
    //res.status(200).json(group);
})


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, 'arGTRFD125L', {
        expiresIn: '30d',
    })
}
// @desc    Update group
// @route   PUT /api/groups/:id
/*const updateGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (!group) {
    res.status(400)
    throw new Error('Group not found')
  }*/
/*
  // Check for user
  if (req.userData=== undefined) {
    res.status(401)
    throw new Error('User not found')
  }*/

// Make sure the logged in user matches the group user
/*if (group.user.toString() !== req.user.id) {
  res.status(401)
  throw new Error('User not authorized')
}

const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
})

res.status(200).json(updatedGroup)
})
*/


// @desc    Delete group
// @route   DELETE /api/groups/:id
export const deleteGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id)

    if (!group) {
        res.status(400)
        throw new Error('Group not found')
    }

    // Check for user
    /* if (req.userData=== undefined) {
       res.status(401)
       throw new Error('Group not found')
     }*/

    // Make sure the logged in user matches the group user
    /* if (group.user.toString() !== req.user.id) {
       res.status(401)
       throw new Error('User not authorized')
     }*/

    await group.remove()

    res.status(200).json({id: req.params.id})
})





// export const getGroupData = async (req, res) => {
//   try {
//     const groups = await Group.find({}); // Récupérer tous les groupes

//     let totalProjects = 0;
//     let totalDoneProjects = 0;

//     // Parcourir chaque groupe
//     for (const group of groups) {
//       const groupId = group._id;

//       // Récupérer les projets pour le groupe actuel
//       const projects = await Project.find({ group: groupId });

//       // Mettre à jour les totaux
//       totalProjects += projects.length;
//       totalDoneProjects += projects.filter((project) => project.status === 'done').length;
//     }

//     // Calculer le pourcentage de projets terminés
//     const percentageDoneProjects = (totalDoneProjects / totalProjects) * 100;

//     // Retourner les données globales
//     res.status(200).json({
//       totalGroups: groups.length,
//       totalProjects,
//       totalDoneProjects,
//       percentageDoneProjects: percentageDoneProjects.toFixed(2),
//     });
//   } catch (error) {
//     // Gérer les erreurs
//     console.error('Une erreur s\'est produite :', error);
//     res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des données.' });
//   }
// };


// export const getUserGroupData = async (req, res) => {
//   try {
//     const { email } = req.query;

//     // Trouver l'utilisateur en fonction de son email
//     const user = await User.find({ email: { $eq: email } });

//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     // Trouver tous les groupes de l'utilisateur
//     const groups = await Group.find({ user: user.email});

//     let totalProjects = 0;
//     let totalDoneProjects = 0;

//     // Parcourir chaque groupe
//     for (const group of groups) {
//       const groupId = group._id;

//       // Récupérer les projets pour le groupe actuel
//       const projects = await Project.find({ group: groupId });

//       // Mettre à jour les totaux
//       totalProjects += projects.length;
//       totalDoneProjects += projects.filter((project) => project.status === 'done').length;
//     }

//     // Calculer le pourcentage de projets terminés
//     const percentageDoneProjects = (totalDoneProjects / totalProjects) * 100;

//     // Retourner les données globales
//     res.status(200).json({
//       userEmail: user.email,
//       totalGroups: groups.length,
//       totalProjects,
//       totalDoneProjects,
//       percentageDoneProjects: percentageDoneProjects.toFixed(2),
//     });
//   } catch (error) {
//     // Gérer les erreurs
//     console.error('Une erreur s\'est produite :', error);
//     res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des données.' });
//   }
// };





// export const getUserGroupData = async (req, res) => {
//   try {
//     const { email } = req.query;

//     // Trouver l'utilisateur en fonction de son email
//  const user = await User.find({ email: { $eq: email } });

//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     // Trouver tous les groupes de l'utilisateur
//     const groups = await Group.find({ user: user._id });

//     let totalProjects = 0;
//     let totalDoneProjects = 0;

//     // Parcourir chaque groupe de l'utilisateur
//     for (const group of groups) {
//       const groupId = group._id;

//       // Récupérer les projets pour le groupe actuel qui sont assignés à l'utilisateur
//       const projects = await Project.find({ group: groupId, assignedto: email });

//       // Mettre à jour les totaux
//       totalProjects += projects.length;
//       totalDoneProjects += projects.filter((project) => project.status === 'done').length;
//     }

//     // Calculer le pourcentage de projets terminés
//     const percentageDoneProjects = (totalDoneProjects / totalProjects) * 100;

//     // Retourner les données globales
//     res.status(200).json({
//       userEmail: user.email,
//       totalGroups: groups.length,
//       totalProjects,
//       totalDoneProjects,
//       percentageDoneProjects: percentageDoneProjects.toFixed(2),
//     });
//   } catch (error) {
//     // Gérer les erreurs
//     console.error('Une erreur s\'est produite :', error);
//     res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des données.' });
//   }
// };



//const user = await User.find({ email: { $eq: email } });



export const getUserGroupData = async (req, res) => {
    const email = req.query.email;

    try {
      const projects = await Project.find({ assignedto: email }, 'name');
      const projectNames = projects.map((project) => project.name);
  
      res.json(projectNames);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch project names' });
    }
}


















// module.exports = {
//     getGroups,
//     creategroup,

//     deleteGroup,
//     updateEmail,
// }
export default {
    getGroups,
        creategroup,
    
        deleteGroup,
        updateEmail,
        getUserGroupData,
  };