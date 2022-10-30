const Ability = require('../models/Ability');
const AboutMe = require('../models/AboutMe');
const Certificate = require('../models/Certificate');
const Header = require('../models/Header');
const Project = require('../models/Project');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const header = await Header.find();
      const aboutMe = await AboutMe.find();
      const ability = await Ability.find()
        .select('_id name imageUrl');
      const projects = await Project.find()
        .select('_id name slug categoryId imageId')
        .populate('categoryId', '_id name')
        .populate({
          path: 'imageId',
          select: '_id imageUrl',
          perDocumentLimit: 1
        });
      const certificates = await Certificate.find()
        .select('_id name organization date credentialUrl imageUrl');
      
      res.status(200).json({
        header: header[0],
        aboutMe: aboutMe[0],
        ability,
        projects,
        certificates
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  detailProject: async (req, res) => {
    try {
      const { id } = req.params; 
      const project = await Project.findOne({ _id: id })
        .populate('categoryId', '_id name')
        .populate('imageId', '_id imageUrl')
        .populate('stackId', '_id name');

      res.status(200).json({
        project
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Internal server error'});
    }
  }
} 