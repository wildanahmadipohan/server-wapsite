var mongoose = require('mongoose');
var seeder = require('mongoose-seed');

// Connect to MongoDB via Mongoose
// mongodb://localhost:27017/db_portfolio
seeder.connect('mongodb+srv://wildanahmadipohan:RN7U9js2zsitWDX@cluster0.podhl0t.mongodb.net/db_wapsite?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: true,
  useUnifiedTopology: true
}, function () {

  // Load Mongoose models
  seeder.loadModels([
    './models/User'
  ]);

  // Clear specified collections
  seeder.clearModels(['User'], function () {

    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });

  });
});

var data = [
  {
    'model': 'User',
    'documents': [
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903345'),
        username: 'welldann',
        password: '099612Wap-wapsite',
      }
    ]
  }
];