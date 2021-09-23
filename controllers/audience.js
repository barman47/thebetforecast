const mailchimp = require('@mailchimp/mailchimp_marketing');
const md5 = require('md5');
const SendXRestApi = require('send_x_rest_api');

const moment = require('moment-timezone');

const Validator = require('validator');
const returnError = require('../utils/returnError');

const { SUBSCRIBED, UNSUBSCRIBED } = require('../utils/constants');
const Subscriber = require('../models/Subscriber');
// const sendEmail = require('../utils/sendEmail');

exports.addContact = async (req, res) => {
    try {
        if (!Validator.isEmail(req.body.email)) {
            return res.status(400).json({
                success: false,
                errors: { email: 'Invalid email address!' }
            });
        }

        mailchimp.setConfig({
            apiKey: process.env.MAILCHIMP_API_KEY,
            server: process.env.MAILCHIMP_SERVER_PREFIX
        });

        const listId = process.env.MAILCHIMP_LIST_ID;
        // const subscriberHash = md5(req.body.email.toLowerCase());
        
        // const response = await mailchimp.lists.setListMember(listId, subscriberHash);
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: req.body.email,
            tags: [UNSUBSCRIBED],
            status: 'subscribed'
        });

        const subscriber = new Subscriber({
            email: req.body.email
        });

        await subscriber.save();

        console.log(`Successfully added contact as an audience member. The contact's ID is ${response.id}`);
        return res.status(201).json({
            success: true,
            data: { msg: 'Contact successfully added', id: response.id, paymentUrl: 'https://flutterwave.com/pay/thebetforecastsubscribe' }
        });

    } catch (err) {
        const title = 'Member Exists';
        if (err.response.body.title === title) {
            console.log(err.response.body.detail);
            return res.status(201).json({
                success: true,
                data: { msg: 'Contact successfully added', paymentUrl: 'https://flutterwave.com/pay/thebetforecastsubscribe' }
            });
        }
        return returnError(err, res, 500, 'Unable to add contact');
    }
};

exports.subscribeContact = async (req, res) => {
    try {

        // {
        //     "id": 126122,
        //     "txRef": "rave-pos-121775237991",
        //     "flwRef": "FLW-MOCK-72d0b2d66273fad0bb32fdea9f0fa298",
        //     "orderRef": "URF_1523185223111_833935",
        //     "paymentPlan": null,
        //     "createdAt": "2018-04-08T11:00:23.000Z",
        //     "amount": 1000,
        //     "charged_amount": 1000,
        //     "status": "successful",
        //     "IP": "197.149.95.62",
        //     "currency": "NGN",
        //     "customer": {
        //       "id": 22836,
        //       "phone": null,
        //       "fullName": "Anonymous customer",
        //       "customertoken": null,
        //       "email": "salesmode@ravepay.co",
        //       "createdAt": "2018-04-08T11:00:22.000Z",
        //       "updatedAt": "2018-04-08T11:00:22.000Z",
        //       "deletedAt": null,
        //       "AccountId": 134
        //     },
        //     "entity": {
        //       "card6": "539983",
        //       "card_last4": "8381"
        //     },
        //     "event.type": "CARD_TRANSACTION"
        //   }
    
        // retrieve the signature from the header
        const hash = req.headers["verif-hash"];
    
        if(!hash) {
            return res.status(403).end();
        }
    
        const secret_hash = process.env.FLUTTWERWAVE_VERF_HASH;
    
        if(hash !== secret_hash) {
            return res.status(403).end();
        }

        const payload = req.body;
        // console.log('Flutterwave request: ', payload);

        // SUBSCRIBE CUSTOMER HERE

        const { email, name } = payload.data.customer;

        const contactDetails = new SendXRestApi.ContactRequest(); // {ContactRequest} Contact details

        contactDetails.email = email;
        contactDetails.firstName = name.split(' ')[0];
        contactDetails.lastName = name.split(' ')[1];
        contactDetails.tags = ["Developer"];

        const callback = function(error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully. Returned data: ' + data);
        }
        };
        api.contactIdentifyPost(apiKey, teamId, contactDetails, callback);

        const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

        if (!subscriber) {
            await Subscriber.create({
                email,
                firstName: name.split(' ')[0],
                lastName: name.split(' ')[1],
                subscriptionDate: moment(Date.now()).tz('Africa/Bangui'),
                subscribed: true
            });
        }

        subscriber.subscribed = true;
        subscriber.subscriptionDate = moment(new Date()).tz('Africa/Bangui');
        await subscriber.save();

        console.log(`${email} subscribed successfully`);
        return res.status(200).end();
    } catch (err) {
        return returnError(err, res, 500, 'Unable to subscribe contact');
    }
};

exports.checkAddContact = (req, res) => {
    const contactDetails = new SendXRestApi.ContactRequest(); // {ContactRequest} Contact details

    const api = new SendXRestApi.ContactApi();

    const apiKey = process.env.SENDX_API_KEY;
    const teamId = process.env.SENDX_TEAM_ID;

    contactDetails.email = req.body.email;
    contactDetails.firstName = req.body.firstName
    contactDetails.lastName = req.body.lastName
    contactDetails.tags = ["Developer"];

    api.contactIdentifyPost(apiKey, teamId, contactDetails, (err, data, response) => {
        if (err) {
            return console.err(error);
        } 

        console.log('API called successfully. Returned data: ' + data);
        return res.status(200).json({
            msg: 'Contact added successfully',
            data,
            response
        });
    });
};

exports.checkContacts = async () => {
    try {
        console.log('Checking contacts');
        mailchimp.setConfig({
            apiKey: process.env.MAILCHIMP_API_KEY,
            server: process.env.MAILCHIMP_SERVER_PREFIX
        });

        const listId = process.env.MAILCHIMP_LIST_ID;
        const subscribers = await Subscriber.find({ subscribed: true });

        const todayDate = moment(new Date()).tz('Africa/Bangui');
        const thisYear = todayDate.format('YYYY');
        
        subscribers.forEach(async (subscriber) => {
            const oldDate = new Date(subscriber.subscriptionDate);
            const thatYear = oldDate.getFullYear();
            
            if(thisYear - thatYear > 1) {
                const subscriberHash = md5(subscriber.email);

                await mailchimp.lists.updateListMemberTags(listId, subscriberHash, {
                    tags: [{ name: SUBSCRIBED, status: 'inactive' }, { name: UNSUBSCRIBED, status: 'active' }]
                });

                // Send optional email telling them that subscription has ended
                subscriber.subscribed = false;
                await subscriber.save();
                console.log(`Cancelled subscription for ${subscriber.email}`);
            }
        });
    } catch (err) {
        console.error(err);
    }
};