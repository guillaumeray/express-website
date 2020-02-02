#! /usr/bin/env node

console.log('This script populates some test opinions, users, categorys and opinioninstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Opinion = require('./models/opinion')
var User = require('./models/user')
var Category = require('./models/category')
var OpinionInstance = require('./models/opinioninstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var categorys = []
var opinions = []
var opinioninstances = []

function userCreate(first_name, family_name, d_birth, d_death, cb) {
  userdetail = {first_name:first_name , family_name: family_name }
  if (d_birth != false) userdetail.date_of_birth = d_birth
  if (d_death != false) userdetail.date_of_death = d_death
  
  var user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}

function categoryCreate(name, cb) {
  var category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categorys.push(category)
    cb(null, category);
  }   );
}

function opinionCreate(title, content, isbn, user, category, cb) {
  opiniondetail = { 
    title: title,
    content: content,
    user: user,
    isbn: isbn
  }
  if (category != false) opiniondetail.category = category
    
  var opinion = new Opinion(opiniondetail);    
  opinion.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Opinion: ' + opinion);
    opinions.push(opinion)
    cb(null, opinion)
  }  );
}


function opinionInstanceCreate(opinion, imprint, due_back, status, cb) {
  opinioninstancedetail = { 
    opinion: opinion,
    imprint: imprint
  }    
  if (due_back != false) opinioninstancedetail.due_back = due_back
  if (status != false) opinioninstancedetail.status = status
    
  var opinioninstance = new OpinionInstance(opinioninstancedetail);    
  opinioninstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING OpinionInstance: ' + opinioninstance);
      cb(err, null)
      return
    }
    console.log('New OpinionInstance: ' + opinioninstance);
    opinioninstances.push(opinioninstance)
    cb(null, opinion)
  }  );
}


function createCategoryUsers(cb) {
    async.series([
        function(callback) {
          userCreate('Patrick', 'Rothfuss', '1973-06-06', false, callback);
        },
        function(callback) {
          userCreate('Ben', 'Bova', '1932-11-8', false, callback);
        },
        function(callback) {
          userCreate('Isaac', 'Asimov', '1920-01-02', '1992-04-06', callback);
        },
        function(callback) {
          userCreate('Bob', 'Billings', false, false, callback);
        },
        function(callback) {
          userCreate('Jim', 'Jones', '1971-12-16', false, callback);
        },
        function(callback) {
          categoryCreate("Fantasy", callback);
        },
        function(callback) {
          categoryCreate("Science Fiction", callback);
        },
        function(callback) {
          categoryCreate("French Poetry", callback);
        },
        ],
        // optional callback
        cb);
}


function createOpinions(cb) {
    async.parallel([
        function(callback) {
          opinionCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', users[0], [categorys[0],], callback);
        },
        function(callback) {
          opinionCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', users[0], [categorys[0],], callback);
        },
        function(callback) {
          opinionCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', users[0], [categorys[0],], callback);
        },
        function(callback) {
          opinionCreate("Apes and Angels", "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", '9780765379528', users[1], [categorys[1],], callback);
        },
        function(callback) {
          opinionCreate("Death Wave","In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", '9780765379504', users[1], [categorys[1],], callback);
        },
        function(callback) {
          opinionCreate('Test Opinion 1', 'Content of test opinion 1', 'ISBN111111', users[4], [categorys[0],categorys[1]], callback);
        },
        function(callback) {
          opinionCreate('Test Opinion 2', 'Content of test opinion 2', 'ISBN222222', users[4], false, callback)
        }
        ],
        // optional callback
        cb);
}


function createOpinionInstances(cb) {
    async.parallel([
        function(callback) {
          opinionInstanceCreate(opinions[0], 'London Gollancz, 2014.', false, 'Available', callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[1], ' Gollancz, 2011.', false, 'Loaned', callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[2], ' Gollancz, 2015.', false, false, callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Available', callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Maintenance', callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Loaned', callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[0], 'Imprint XXX2', false, false, callback)
        },
        function(callback) {
          opinionInstanceCreate(opinions[1], 'Imprint XXX3', false, false, callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createCategoryUsers,
    createOpinions,
    createOpinionInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+opinioninstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




