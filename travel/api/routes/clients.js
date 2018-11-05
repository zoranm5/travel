const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');



const Client = require("../models/clients");

router.get("/", (req, res, next) => {
  Client.find()
    .select("name  _id ")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        client: docs.map(doc => {
          return {
            name: doc.name,
            id: doc._id,
            
            request: {
              type: "GET",
              url: "http://localhost:3000/clients/" + doc._id
            }
          };
        })
      };
      
      res.status(200).json(response); 
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:clientId", (req, res, next) => {
    const id = req.params.clientId;
    Client.findById(id)
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              client: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/clients'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

router.post("/", checkAuth, (req, res, next) => {
  const client = new Client({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  });
  client
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Client created successfully",
        createdClient: {
            name: result.name,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/clients/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:clientId", checkAuth, (req, res, next) => {
    const id = req.params.clientId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Client.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Client updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/clients/' + id
            }
        
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
  router.delete("/:clientId", checkAuth, (req, res, next) => {
    const id = req.params.clientId;
    Client.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Client deleted',
            request: {
                type: 'DELETE',
                url: 'http://localhost:3000/clients',
              
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });



module.exports = router;