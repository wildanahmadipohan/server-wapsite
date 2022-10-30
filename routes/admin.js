const router = require('express').Router();
const adminController = require('../controllers/AdminController');

const { upload, uploadMultiple } = require('../midlewares/multer'); 

const auth = require('../midlewares/auth');

router.use(auth);
// dashboard
router.get('/dashboard', adminController.viewDashboard);

// project
router.get('/project', adminController.viewProject);
router.get('/project/:id', adminController.detailProject);
router.post('/project', uploadMultiple, adminController.addProject);
router.get('/project/edit/:id', adminController.editProject);
router.put('/project', uploadMultiple, adminController.updateProject);
router.delete('/project/:id', adminController.deleteProject);

// project setting
router.get('/project-setting', adminController.viewProjectSetting);

// project setting | category
router.post('/project-setting/category', adminController.addCategory);
router.put('/project-setting/category', adminController.editCategory);
router.delete('/project-setting/category/:id', adminController.deleteCategory);

// project setting | stack
router.post('/project-setting/stack', adminController.addStack);
router.put('/project-setting/stack', adminController.editStack);
router.delete('/project-setting/stack/:id', adminController.deleteStack);

// ability
router.get('/ability', adminController.viewAbility);
router.post('/ability', upload, adminController.addAbility);
router.put('/ability', upload, adminController.editAbility);
router.delete('/ability/:id', adminController.deleteAbility);

// certificate
router.get('/certificate', adminController.viewCertificate);
router.post('/certificate', upload, adminController.addCertificate);
router.put('/certificate', upload, adminController.editCertificate);
router.delete('/certificate/:id', adminController.deleteCertificate);

// website setting
router.get('/website-setting', adminController.viewWebsiteSetting);

// website setting | change header hero
router.put('/website-setting/header-hero', upload, adminController.editHeaderHero);
router.put('/website-setting/aboutme-hero', upload, adminController.editAboutMeHero);
router.put('/website-setting/header', adminController.editHeader);
router.put('/website-setting/aboutme', adminController.editAboutMe);

module.exports = router;