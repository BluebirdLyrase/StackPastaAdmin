const mongoose = require('mongoose');
const viewHistory = require('./models/viewHistory');
const searchingHistory = require('./models/searchingHistory');
const user = require('./models/user');
const pinnedQuestions = require('./models/pinnedQuestions');
// #5 Change URL to your local mongodb
const bcrypt = require('bcrypt');
const url = "mongodb://localhost:27017/StackOverFlowDB";
// ===============================
const saltRounds = 10;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

//get Data
function getAllViewHistory(req, res) {
    viewHistory.find({}, function (err, data) {
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        res.json(data);
    });
}

function getAllSearchingHistory(req, res) {
    searchingHistory.find({}, function (err, data) {
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        res.json(data);
    });
}

function getAllUser(req, res) {
    user.find({}, function (err, data) {
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        res.json(data);
    });
}

function getOneUser(req, res) {
    var ID = req.params.id;
    user.findOne({ _id: ID }, function (err, data) {
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        res.json(data);
    });
}

//add Data

function addSearchingHistory(req, res) {
    var newId = new mongoose.mongo.ObjectId();
    var payload = req.body; // add _id
    payload._id = newId;
    payload.Date = new Date(payload.Date)
    console.log(payload);
    var NewSearchingHistory = new searchingHistory(payload);
    console.log(NewSearchingHistory);
    NewSearchingHistory.save(function (err) {
        if (err) {
            res.status(500).json(err);
            console.log(err);
        }
        res.json({ status: "added NewSearchingHistory" });
    });
}

function addViewHistory(req, res) {
    var newId = new mongoose.mongo.ObjectId();
    var payload = req.body;
    console.log(payload);
    payload._id = newId; // add _id
    payload.Date = new Date(payload.Date)
    var NewViewHistory = new viewHistory(payload);
    console.log(payload.site)
    console.log("------")
    console.log(NewViewHistory)
    // console.log(req.body.ID);a
    NewViewHistory.save(function (err) {
        if (err) {
            res.status(500).json(err);
            console.log(err);
        }
        res.json({ status: "added NewViewHistory" });
    });
}

function addUser(req, res) {

    var newId = new mongoose.mongo.ObjectId();
    var payload = req.body;
    payload._id = newId; // add _id
    payload.available = true;

    bcrypt.hash(payload.Password, saltRounds, function (err, hash) {
        payload.Password = hash;
        var NewUser = new user(payload);
        console.log(NewUser);
        NewUser.save(function (err) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json({ status: "added NewUser" });
            }
        });
    });

}


//delete Data

function deleteSearchingHistory(req, res) {
    var id = req.params.id;
    searchingHistory.findByIdAndRemove(id, function (err) {
        if (err) res.status(500).json(err);
        res.json({ status: "delete a data" });
    });
}

function deleteViewHistory(req, res) {
    var id = req.params.id;
    viewHistory.findByIdAndRemove(id, function (err) {
        if (err) res.status(500).json(err);
        res.json({ status: "delete a data" });
    });
}

//User Management

function findUser(req, res) {
    var userID = req.params.userid;
    //check if that UserID is already exist
    user.findOne({ UserID: userID }, function (err, data) {
        console.log('sent ' + userID)
        if (data != null) {
            console.log('Dupe')
            res.json(true);
        } else {
            console.log('not Dupe')
            res.json(false);
        }
    });
}

function editUser(req, res) {

    var payload = req.body
    var id = req.params.id;

    bcrypt.hash(payload.Password, saltRounds, function (err, hash) {
        payload.Password = hash;

        console.log(payload)
        user.findByIdAndUpdate(id, payload, function (err,oldData) {

            //Update other data
            //viewHistory
            console.log("oldUserID : "+oldData.UserID)
            viewHistory.find({ UserID: oldData.UserID }, function (err, data) {
                data.forEach(function (item) {
                    
                    var newItem = item;
                    newItem.UserID = payload.UserID ;
                    viewHistory.findByIdAndUpdate(item._id, newItem, 
                        function () {
                            console.log(newItem.UserID + " viewHistory change in"+item._id);
                    });
                });
            });
            // searchingHistory
            searchingHistory.find({ UserID: oldData.UserID }, function (err, data) {
                data.forEach(function (item) {
                    
                    var newItem = item;
                    newItem.UserID = payload.UserID ;
                    searchingHistory.findByIdAndUpdate(item._id, newItem, 
                        function () {
                            console.log(newItem.UserID + " searchingHistory change in"+item._id);
                    });
                });
            });

            // pinned
            pinnedQuestions.find({ UserID: oldData.UserID }, function (err, data) {
                data.forEach(function (item) {
                    var newItem = item;
                    newItem.UserID = payload.UserID ;
                    pinnedQuestions.findByIdAndUpdate(item._id, newItem, 
                        function () {
                            console.log(newItem.UserID + " searchingHistory change in"+item._id);
                    });
                });
            });

            if (err) res.status(500).json(err);
            res.json({ status: "updated user" });
        });
    });

}

function addDefaultAdmin(req, res) {

    user.findOne({ type: "admin" }, function (err, data) {
        if (data == null) {
            bcrypt.hash("admin", saltRounds, function (err, hash) {
                var newId = new mongoose.mongo.ObjectId();
                var NewUser = new user({
                    _id: newId,
                    UserID: "admin",
                    Password: hash,
                    type: "admin",
                    available : true
                });
                console.log(NewUser);
                NewUser.save(function (err) {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.json({ status: "added default admin" });
                    }
                });
            });
        } else {
            res.json({ status: "already have admin" });
        }
    });

}

function RemoveUser(req, res) {
    var id = req.params.id;
    user.findByIdAndRemove(id, function (err,data) {
        if (err) res.status(500).json(err);

        viewHistory.find({ UserID: data.UserID}).remove().exec();
        searchingHistory.find({ UserID: data.UserID}).remove().exec();
        pinnedQuestions.find({ UserID: data.UserID}).remove().exec();

        res.json({ status: "delete a user data : " + data.UserID});
    });
    // ===============================
}

function deleteUser(req, res) {
    var id = req.params.id;
    user.findByIdAndUpdate(id,{"available":false}, function (err) {
        if (err) res.status(500).json(err);
        res.json({ status: "deleted a user" });
    });
    // ===============================
}

function RecoverUser(req, res) {
    var id = req.params.id;
    user.findByIdAndUpdate(id,{"available":true}, function (err) {
        if (err) res.status(500).json(err);
        res.json({ status: "recovered a user" });
    });
    // ===============================
}

//Connection and authen

function authen(req, res) {

    user.findOne({ UserID: req.body.UserID,available: true }, function (err, data) {
        // console.log(req)
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        // console.log(data)
        if (data != null) {

            bcrypt.compare(req.body.Password, data.Password, function (err, result) {
                console.log("authen : "+result);
                res.json(result);
            });

        } else {
            res.json(false);
        }
    });
}

function checkConnection(req, res) {
    status = mongoose.connection.readyState;
    // console.log(status);
    res.json(status)
    //     ready states being:
    // 0: disconnected
    // 1: connected
    // 2: connecting
    // 3: disconnecting
}

function authenAdmin(req, res) {
    //TODO Verification
    user.findOne({ UserID: req.body.UserID, type: "admin" }, function (err, data) {
        // console.log(req)
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        // console.log(data)
        if (data != null) {
            bcrypt.compare(req.body.Password, data.Password, function (err, result) {
                console.log(result);
                res.json(result);
            });

        } else {
            res.json(false);
        }
    });
}

//Dashboard
function distinctTags(req, res) {
    viewHistory.aggregate([
        { $unwind: "$Tags" },
        { $group: { "_id": "$Tags", "count": { $sum: 1 } } },
        { $project: { "Tags": "$_id", "count": 1 } },
        { $sort: { "count": -1 } },

    ], function (err, data) {
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        res.json(data);
    })
}

function findViewByUser(req, res) {
    var userID = req.params.userid;
    viewHistory.find({ UserID: userID }, function (err, data) {
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        res.json(data);
    });
}

function distinctTagsByUser(req, res) {
    var userID = req.params.userid;
    viewHistory.aggregate([
        { $match: { UserID: userID } },
        { $unwind: "$Tags" },
        { $group: { "_id": "$Tags", "count": { $sum: 1 } } },
        { $project: { "Tags": "$_id", "count": 1 } },
        { $sort: { "count": -1 } },

    ], function (err, data) {
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        res.json(data);
    })
}

function findSearchingByUser(req, res) {
    var userID = req.params.userid;
    searchingHistory.find({ UserID: userID }, function (err, data) {
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        res.json(data);
    });
}

function viewFrequency(req, res) {
    viewHistory.aggregate([
        {
            $group: {
                "_id": {
                    month: { $month: "$Date" },
                    year: { $year: "$Date" }
                }, "count": { $sum: 1 }
            }
        },
        { $sort: { "_id.month": 1 } }], function (err, data) {
            if (err) {
                res.status(500).json({ status: "error", message: err });
            }
            res.json(data);
        })
}

function searchingFrequency(req, res) {
    searchingHistory.aggregate([
        {
            $group: {
                "_id": {
                    month: { $month: "$Date" },
                    year: { $year: "$Date" }
                }, "count": { $sum: 1 }
            }
        },
        { $sort: { "_id.month": 1 } }], function (err, data) {
            if (err) {
                res.status(500).json({ status: "error", message: err });
            }
            res.json(data);
        })
}

//Pinned function
function addPin(req, res) {
    var newId = new mongoose.mongo.ObjectId();
    var payload = req.body; // add _id
    payload._id = newId;
    payload.Date = new Date(payload.Date)
    console.log(payload);
    var NewPinnedQuestions = new pinnedQuestions(payload);
    console.log(NewPinnedQuestions);
    NewPinnedQuestions.save(function (err) {
        if (err) {
            res.status(500).send("Error while try to add New Pinned Questions");
            console.log(err);
        }
        res.send("Successfully added New Pinned Questions");
    });
}

function getPinned(req, res) {
    pinnedQuestions.find({}, function (err, data) {
        if (err) {
            res.status(500).json({ status: "error", message: err });
        }
        response = { "item": data }
        res.json(response);
    });
}

function deletePinned(req, res) {
    var id = req.body._id;
    var rUserID = req.body.UserID
    pinnedQuestions.findOne({ _id: id, UserID: rUserID }, function (err, data) {

        if (data != null) {
            pinnedQuestions.findByIdAndRemove(id, function (err) {
                if (err) {
                    res.status(500).json(err);
                    res.send("Successfully deleted pinned Error" + err);
                }
                res.send("Successfully deleted a pinned");
            });
        } else {
            res.send("permisison denied");
        }

    });
}

function deletePinnedByAdmin(req, res) {
    var id = req.params.id;
    pinnedQuestions.findByIdAndRemove(id, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        res.send("delete a pinned by Admin " + data);
    });
}


module.exports = {
    //get
    getAllViewHistory: getAllViewHistory,
    getAllSearchingHistory: getAllSearchingHistory,
    getAllUser: getAllUser,
    getOneUser: getOneUser,
    //add History
    addViewHistory: addViewHistory,
    addSearchingHistory: addSearchingHistory,
    //User Management
    addUser: addUser,
    findUser: findUser,
    editUser: editUser,
    addDefaultAdmin: addDefaultAdmin,
    deleteUser: deleteUser,
    RecoverUser:RecoverUser,
    RemoveUser:RemoveUser,
    //Delete History
    deleteViewHistory: deleteViewHistory,
    deleteSearchingHistory: deleteSearchingHistory,
    //Connecting
    authen: authen,
    checkConnection: checkConnection,
    authenAdmin: authenAdmin,
    //Dash Board
    distinctTags: distinctTags,
    findViewByUser: findViewByUser,
    findSearchingByUser: findSearchingByUser,
    distinctTagsByUser: distinctTagsByUser,
    viewFrequency: viewFrequency,
    searchingFrequency: searchingFrequency,
    //Pinned Function
    addPin: addPin,
    getPinned: getPinned,
    deletePinned: deletePinned,
    deletePinnedByAdmin: deletePinnedByAdmin
};