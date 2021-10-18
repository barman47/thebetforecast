const request = require('request');
const moment = require('moment-timezone');

const Validator = require('validator');
const returnError = require('../utils/returnError');

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

        const listId = process.env.UNPAID_LIST_ID;
        const email = req.body.email.toLowerCase().trim();

        const data = {
            api_key: `${process.env.SENDY_API_KEY}`,
            email,
            list: listId,
            DateAdded: moment(Date.now()).tz('Africa/Bangui').toString()
        };

        request.post({  url: `${process.env.SENDY_URL}/subscribe`, formData: data}, async (err, httpResponse, body) => {
            if (err) {
                return console.error('upload failed:', err);
            }

            await Subscriber.findOneAndUpdate({ email }, { $set: { email, subscribed: false, createdAt: moment(Date.now()).tz('Africa/Bangui') } }, { new: true, upsert: true, runValidators: true });

            return res.status(201).json({
                success: true,
                data: { msg: 'Contact successfully added', paymentUrl: 'https://flutterwave.com/pay/thebetforecastsubscribe' }
            });
        });
    } catch (err) {
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
        // const hash = req.headers["verif-hash"];
    
        // if(!hash) {
        //     return res.status(403).end();
        // }
    
        // const secret_hash = process.env.FLUTTWERWAVE_VERF_HASH;
    
        // if(hash !== secret_hash) {
        //     return res.status(403).end();
        // }

        const payload = req.body;
        // console.log('Flutterwave request: ', payload);

        // SUBSCRIBE CUSTOMER HERE
        let { email, name } = payload.data.customer;

        const paidListId = process.env.PAID_LIST_ID;
        const unpaidListId = process.env.UNPAID_LIST_ID;
        const expiredListId = process.env.EXPIRED_LIST_ID;
        email = email.toLowerCase().trim();

        const paidData = {
            api_key: `${process.env.SENDY_API_KEY}`,
            email,
            list: paidListId,
            Name: name,
            DateAdded: moment(Date.now()).tz('Africa/Bangui').toString()
        };

        const unpaidData = {
            api_key: `${process.env.SENDY_API_KEY}`,
            email,
            list_id: unpaidListId,
            DateAdded: moment(Date.now()).tz('Africa/Bangui').toString()
        };

        const expiredData = {
            api_key: `${process.env.SENDY_API_KEY}`,
            email,
            list_id: expiredListId,
            Name: name,
            DateAdded: moment(Date.now()).tz('Africa/Bangui').toString()
        };

        // Add subscriber to paid list
        request.post({  url: `${process.env.SENDY_URL}/subscribe`, formData: paidData}, async (err, httpResponse, body) => {
            if (err) {
                return console.error('upload failed:', err);
            }

            await Subscriber.findOneAndUpdate({ email }, { $set: { firstName: name.split(' ')[0], lastName: name.split(' ')[1], subscribed: true, subscriptionDate: moment(Date.now()).tz('Africa/Bangui') } }, { new: true, runValidators: true });
            
            // Delete subscriber from unpaid list
            request.post({  url: `${process.env.SENDY_URL}/api/subscribers/delete.php`, formData: unpaidData}, async (err, httpResponse, body) => {
                if (err) {
                    return console.error('upload failed:', err);
                }
                console.log(`${email} subscribed successfully`);
                return res.status(200).end();
            });
            
            // Delete subscriber from expired list if he's already there list
            request.post({  url: `${process.env.SENDY_URL}/api/subscribers/delete.php`, formData: expiredData}, async (err, httpResponse, body) => {
                if (err) {
                    return console.error('upload failed:', err);
                }
                return res.status(200).end();
            });
        });
    } catch (err) {
        return returnError(err, res, 500, 'Unable to subscribe contact');
    }
};

exports.checkContacts = async () => {
    try {
        console.log('Checking contacts');

        const paidListId = process.env.PAID_LIST_ID;
        const expiredListId = process.env.EXPIRED_LIST_ID;

        const expiredData = {
            api_key: `${process.env.SENDY_API_KEY}`,
            list: expiredListId,
            DateAdded: moment(Date.now()).tz('Africa/Bangui').toString()
        };

        const subscribedData = {
            api_key: `${process.env.SENDY_API_KEY}`,
            list_id: paidListId,
            DateAdded: moment(Date.now()).tz('Africa/Bangui').toString()
        };

        const subscribers = await Subscriber.find({ subscribed: true });

        const todayDate = moment(new Date()).tz('Africa/Bangui');
        const thisYear = todayDate.format('YYYY');
        
        subscribers.forEach(async (subscriber) => {
            const oldDate = new Date(subscriber.subscriptionDate);
            const thatYear = oldDate.getFullYear();
            
            if(thisYear - thatYear > 1) {
                
                // Add user to expired list
                request.post({  url: `${process.env.SENDY_URL}/subscribe`, formData: { ...expiredData, email: subscriber.email }}, async (err, httpResponse, body) => {
                    if (err) {
                        return console.error('upload failed:', err);
                    }
        
                    // Delete subscriber from paid list
                    request.post({  url: `${process.env.SENDY_URL}/api/subscribers/delete.php`, formData: { ...subscribedData, email: subscriber.email }}, async (err, httpResponse, body) => {
                        if (err) {
                            return console.error('upload failed:', err);
                        }
                        // Send optional email telling them that subscription has ended
                        subscriber.subscribed = false;
                        subscriber.expiryDate = moment(Date.now()).tz('Africa/Bangui');
                        await subscriber.save();
                        console.log(`Cancelled subscription for ${subscriber.email}`);
                        
                    });
                });
            }
        });
    } catch (err) {
        console.error(err);
    }
};