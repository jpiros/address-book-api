const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Contact } = require('./models/contact');

const app = express();
const port = process.env.PORT || 3000;

const swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'RESTful API with Swagger'
  },
  host: 'vast-shore-36257.herokuapp.com',
  basePath: '/',
};

const options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./server/server.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
     // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * definition:
 *   Contact:
 *     properties:
 *       firstName:
 *         type: string
 *         example: John
 *       lastName:
 *         type: string
 *         example: Smith
 *       email:
 *         type: string
 *         example: johnsmith@gmail.com
 *       phone:
 *         type: string
 *         example: (123)456-7890
 *       contactType:
 *         type: string
 *         example: Family
 */


/**
 * @swagger
 * /contacts:
 *   post:
 *     tags:
 *       - Contacts
 *     description: Creates a new contact
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: contact
 *         description: Contact object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Contact'
 *     responses:
 *       200:
 *         description: Sucessfully created
 */
app.post('/contacts', (req, res) => {
  const contact = new Contact({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    contactType: req.body.type,
    createdAt: new Date().getTime()
  });

  contact.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

/**
 * @swagger
 * /contacts:
 *   get:
 *     tags:
 *       - Contacts
 *     description: Returns all contacts
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of contacts
 *         schema:
 *           $ref: '#/definitions/Todo'
 */
app.get('/contacts', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     tags:
 *       - Contacts
 *     description: Returns a single contact
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Contact's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single contact
 *         schema:
 *           $ref: '#/definitions/Contact'
 */
app.get('/contacts/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Contact.findById(id).then((contact) => {
    if (!contact) {
      return res.status(404).send();
    }

    res.send({contact});
  }).catch((e) => {
    res.status(400).send();
  });

});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     tags:
 *       - Contacts
 *     description: Deletes a single contact
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Contact's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Sucessfully deleted
 */
app.delete('/contacts/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Contact.findByIdAndRemove(id).then((contact) => {
    if (!contact) {
      return res.status(404).send();
    }

    res.send({contact});
  }).catch((e) => {
    res.status(400).send();
  });
});

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     tags:
 *       - Contacts
 *     description: Updates a single contact
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Contact's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: contact
 *         description: Contact object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Contact'
 *     responses:
 *       200:
 *         description: Sucessfully updated
 */
app.patch('/contacts/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, [
    'firstName', 
    'lastName',
    'email',
    'phone',
    'type'
  ]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Contact.findByIdAndUpdate(id, {$set: body}, {new: true}).then((contact) => {
    if (!contact) {
      return res.status(404).send();
    }

    res.send({contact});
  }).catch((e) => {
    res.status(400).send();
  })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };