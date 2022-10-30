const Project = require('../models/Project');
const Category = require('../models/Category');
const Stack = require('../models/Stack');
const Ability = require('../models/Ability');
const Certificate = require('../models/Certificate');
const Header = require('../models/Header');
const AboutMe = require('../models/AboutMe');
const Image = require('../models/Image');

const fs = require('fs-extra');
const path = require('path');

module.exports = {
  viewDashboard: (req, res) => {
    const data = {
      title: 'Dashboard'
    }
    res.render('admin/dashboard/view_dashboard', data);
  },
  
  viewProject: async (req, res) => {
    try {
      const projects = await Project.find()
        .populate('categoryId', '_id name');
      const categories = await Category.find();
      const stacks = await Stack.find();

      const alert = {
        status: req.flash('status'),
        message: req.flash('message')
      };

      const data = {
        title: 'Project',
        projects,
        categories,
        stacks,
        alert,
        action: 'view'
      }

      res.render('admin/project/view_project', data);
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/project');
    }
  },

  detailProject: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findOne({_id: id})
        .populate('categoryId', '_id name')
        .populate('stackId', '_id name')
        .populate('imageId', '_id imageUrl');
      
      const alert = {
        status: req.flash('status'),
        message: req.flash('message')
      }
      
      const data = {
        title: 'Project',
        action: 'detail',
        project,
        alert
      }
      
      res.render('admin/project/view_project', data);
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);
      
      req.redirect('/admin/project');
    }
  },

  addProject: async (req, res) => {
    try {
      if (req.files.length > 0) {
        const { name, tags, category: categoryId, stacks, description } = req.body;
        const slug = name.toLowerCase().split(' ').join('-');
        const category = await Category.findOne({_id: categoryId});
        
        const newProject = {
          name,
          slug,
          stackId: stacks,
          description,
          categoryId: category._id,
          tag: tags.split(' '),
        };

        const project = await Project.create(newProject);
        category.projectId.push(project._id);
        await category.save();

        for (const file of req.files) {
          const image = await Image.create({
            imageUrl: `images/${file.filename}`,
          });
          
          project.imageId.push(image._id);
          await project.save();
        }
      }

      req.flash('status', 'success');
      req.flash('message', 'Project added successfully.');

      res.redirect('/admin/project');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);
      
      res.redirect('/admin/project');
    }
  },

  editProject: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findOne({_id: id})
        .populate('categoryId', '_id name')
        .populate('stackId', '_id name');
      const categories = await Category.find();
      const stacks = await Stack.find();
      
      const stackSelected = [];
      project.stackId.forEach((stack) => {
        stackSelected.push(stack._id.toString());
      })
      
      const alert = {
        status: req.flash('status'),
        message: req.flash('message')
      };

      const data = {
        title: 'Project',
        project,
        categories,
        stacks,
        stackSelected,
        alert,
        action: 'edit'
      };

      res.render('admin/project/view_project.ejs', data);
    } catch (error) {
      const { id } = req.params;

      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);
      res.redirect(`/admin/project/edit/${id}`);
    }
  },

  updateProject: async (req, res) => {
    try {
      const { id, name, tags, category: categoryId, stacks, description } = req.body;
      const project = await Project.findOne({_id: id});
      const category = await Category.findOne({_id: categoryId});
      
      if (req.files.length > 0) {
        for (const [i, imageId] of project.imageId.entries()) {
          const imageUpdate = await Image.findOne({_id: imageId});
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
      }
      
      // hapus projectId pada category lama jika category berganti
      if (project.categoryId.toString() !== categoryId) {
        const oldCategory = await Category.findOne({projectId:  project._id});
        oldCategory.projectId.pull(project._id);
        await oldCategory.save();
        
        category.projectId.push(project._id);
        await category.save();
      }

      project.stackId = stacks;
      
      project.name = name;
      project.tag = tags.split(' ');
      project.categoryId = category._id;
      project.description = description;

      await project.save(); 

      req.flash('status', 'success');
      req.flash('message', 'Project updated successfully.');

      res.redirect('/admin/project');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/project')
    }
  },

  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findOne({_id: id});
      
      // remove project id from category
      const category = await Category.findOne({_id: project.categoryId});
      category.projectId.pull(project._id);
      await category.save();

      // remove image doc and image file 
      for (const imageId of project.imageId) {
        const imageDelete = await Image.findOne({_id: imageId});
        await fs.unlink(path.join(`public/${imageDelete.imageUrl}`));
        await imageDelete.remove();
      }

      await project.remove();

      req.flash('status', 'success');
      req.flash('message', 'Project deleted successfully.');
      res.redirect('/admin/project');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);
      res.redirect('/admin/project');
    }
  },

  viewProjectSetting: async (req, res) => {
    try {
      const stacks = await Stack.find();
      const categories = await Category.find();
  
      const alertName = req.flash('name');
      const alertStatus = req.flash('status');
      const alertMessage = req.flash('message');
      const alert = {name: alertName, status: alertStatus, message: alertMessage};
      
      const data = {
        title: 'Project Setting',
        stacks,
        categories,
        alert
      }
      
      res.render('admin/project_setting/view_project_setting', data);
    } catch (error) {
      req.flash('message', `${error.message}`);
      res.redirect('/admin/project-setting');
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });

      req.flash('name', 'categoryAlert');
      req.flash('status', 'success');
      req.flash('message', 'Category added successfully.');

      res.redirect('/admin/project-setting');
    } catch (error) {
      req.flash('name', 'categoryAlert');
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/project-setting');
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({_id: id});
      category.name = name;
      await category.save();

      req.flash('name', 'categoryAlert');
      req.flash('status', 'success');
      req.flash('message', 'Category updated successfully.');

      res.redirect('/admin/project-setting');
    } catch (error) {
      req.flash('name', 'categoryAlert');
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/project-setting');
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({_id: id});
      await category.remove();

      req.flash('name', 'categoryAlert');
      req.flash('status', 'success');
      req.flash('message', 'Category deleted successfully.');

      res.redirect('/admin/project-setting');
    } catch (error) {
      req.flash('name', 'categoryAlert');
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/project-setting');
    }
  },

  addStack: async (req, res) => {
    try {
      const { name } = req.body;
      
      await Stack.create({ name });

      req.flash('name', 'stackAlert');
      req.flash('status', 'success');
      req.flash('message', 'Stack added successfully.');
      
      res.redirect('/admin/project-setting');
    } catch (error) {
      req.flash('name', 'stackAlert');
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);
      res.redirect('/admin/project-setting');
    }
  },

  editStack: async (req, res) => {
    try {
      const {id, name} = req.body;
      const stack = await Stack.findOne({_id: id});
      stack.name = name;
      await stack.save();

      req.flash('name', 'stackAlert');
      req.flash('status', 'success');
      req.flash('message', 'Stack updated successfully.');
      
      res.redirect('/admin/project-setting');
    } catch (error) {
      req.flash('name', 'stackAlert');
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);
      res.redirect('/admin/project-setting');
    }
  },

  deleteStack: async (req, res) => {
    try {
      const { id } = req.params;
      const stack = await Stack.findOne({_id: id});
      await stack.remove();
      
      req.flash('name', 'stackAlert');
      req.flash('status', 'success');
      req.flash('message', 'Stack deleted successfully.');
      
      res.redirect('/admin/project-setting');
    } catch (error) {
      req.flash('name', 'stackAlert');
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);
      res.redirect('/admin/project-setting');
    }
  },

  viewAbility: async (req, res) => {
    try {
      const abilities = await Ability.find();

      const alert = {
        status: req.flash('status'),
        message: req.flash('message')
      }

      const data = {
        title: 'Ability',
        abilities,
        alert
      };

      res.render('admin/ability/view_ability', data);
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/ability');
    }
  },

  addAbility: async (req, res) => {
    try {
      const { name } = req.body;

      await Ability.create({
        name,
        imageUrl: `images/${req.file.filename}`
      });

      req.flash('status', 'success');
      req.flash('message', 'Ability added successfully.');

      res.redirect('/admin/ability');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/ability');
    }
  },

  editAbility: async (req, res) => {
    try {
      const { id, name } = req.body;
      const ability = await Ability.findOne({_id: id});

      ability.name = name;

      if (req.file != undefined) {
        await fs.unlink(path.join(`public/${ability.imageUrl}`));
        ability.imageUrl = `images/${req.file.filename}`;
      }

      await ability.save();

      req.flash('status', 'success');
      req.flash('message', 'Ability updated successfully.');

      res.redirect('/admin/ability');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);
    }
  },

  deleteAbility: async (req, res) => {
    try {
      const { id } = req.params;
      const ability = await Ability.findOne({_id: id});
      await fs.unlink(path.join(`public/${ability.imageUrl}`));
      await ability.remove();

      req.flash('status', 'success');
      req.flash('message', 'Ability deleted successfully.');

      res.redirect('/admin/ability');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/ability');
    }
  },

  viewCertificate: async (req, res) => {
    try {
      const certificates = await Certificate.find();

      const alert = {
        status: req.flash('status'),
        message: req.flash('message')
      };

      const data = {
        title: 'Certificate',
        certificates,
        alert
      }

      res.render('admin/certificate/view_certificate', data);
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/certificate');
    }
  },

  addCertificate: async (req, res) => {
    try {
      const { name, organization, credentialUrl, date } = req.body;
      
      Certificate.create({
        name,
        organization,
        credentialUrl,
        date,
        imageUrl: `images/${req.file.filename}`
      });

      req.flash('status', 'success');
      req.flash('message', 'Certificate added successfully.');

      res.redirect('/admin/certificate');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/certificate');
    }
  },

  editCertificate: async (req, res) => {
    try {
      const { id, name, organization, credentialUrl, date } = req.body;

      const certificate = await Certificate.findOne({_id: id});
      certificate.name = name;
      certificate.organization = organization;
      certificate.credentialUrl = credentialUrl;
      certificate.date = date;

      if (req.file != undefined) {
        await fs.unlink(path.join(`public/${certificate.imageUrl}`));
        certificate.imageUrl = `images/${req.file.filename}`;
      }

      await certificate.save();

      req.flash('status', 'success');
      req.flash('message', 'Certificate updated successfully.');

      res.redirect('/admin/certificate');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/certificate');
    }
  },

  deleteCertificate: async (req, res) => {
    try {
      const { id } = req.params;
      const certificate = await Certificate.findOne({_id: id});

      await fs.unlink(path.join(`public/${certificate.imageUrl}`));
      await certificate.remove();

      req.flash('status', 'success');
      req.flash('message', 'Certificate deleted successfully.');

      res.redirect('/admin/certificate');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/certificate');
    }
  },

  viewWebsiteSetting: async (req, res) => {
    try {
      const header = await Header.findOne();
      const aboutMe = await AboutMe.findOne();

      const alert = {
        status: req.flash('status'),
        message: req.flash('message')
      }

      console.log(header);

      const data = {
        title: 'Website Setting',
        header,
        aboutMe,
        alert
      }

      res.render('admin/website_setting/view_website_setting', data);
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('admin/webiste-setting');
    }
  },

  editHeader: async (req, res) => {
    try {
      const { id, title1, title2, subtitle } = req.body;
      const header = await Header.findOneAndUpdate({_id: id}, {
        title: [
          title1,
          title2
        ],
        subtitle,
      });

      req.flash('status', 'success');
      req.flash('message', 'Header updated successfully.');

      res.redirect('/admin/website-setting');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/website-setting');
    }
  },

  editHeaderHero: async (req, res) => {
    try {
      const { id } = req.body;
      const header = await Header.findOne({_id: id});

      if (header.imageUrl) {
        await fs.unlink(path.join(`public/${header.imageUrl}`));
      }

      header.imageUrl = `images/${req.file.filename}`;
      await header.save();
      
      req.flash('status', 'success');
      req.flash('message', 'Hero updated successfully.');

      res.redirect('/admin/website-setting');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/website-setting');
    }
  },

  editAboutMe: async (req, res) => {
    try {
      const { id, description } = req.body;
      const aboutMe = await AboutMe.findOneAndUpdate({_id: id}, { description });

      req.flash('status', 'success');
      req.flash('message', 'About Me updated successfully.');

      res.redirect('/admin/website-setting');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/website-setting');
    }
  },

  editAboutMeHero: async (req, res) => {
    try {
      const { id } = req.body;
      const aboutMe = await AboutMe.findOne();

      if (aboutMe.imageUrl) {
        await fs.unlink(path.join(`public/${aboutMe.imageUrl}`));
      }

      aboutMe.imageUrl = `images/${req.file.filename}`;
      await aboutMe.save();

      req.flash('status', 'success');
      req.flash('message', 'Hero updated successfully.');

      res.redirect('/admin/website-setting');
    } catch (error) {
      req.flash('status', 'danger');
      req.flash('message', `${error.message}`);

      res.redirect('/admin/website-setting');
    }
  },
}