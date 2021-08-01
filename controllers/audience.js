const mailchimp = require('@mailchimp/mailchimp_marketing');
const md5 = require('md5');
const Validator = require('validator');
const returnError = require('../utils/returnError');

const { SUBSCRIBED, UNSUBSCRIBED } = require('../utils/constants');
const sendEmail = require('../utils/sendEmail');

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
        
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: req.body.email,
            tags: [UNSUBSCRIBED],
            status: 'subscribed'
        });

        await sendEmail(req.body.email);

        console.log(`Successfully added contact as an audience member. The contact's ID is ${response.id}`);
        return res.status(201).json({
            success: true,
            data: { msg: 'Contact successfully added', id: response.id }
        });

    } catch (err) {
        return returnError(err, res, 500, 'Unable to subscribe contact');
    }
};

exports.subscribeContact = async (req, res) => {

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

    // Retrieve the req's body
    var payload = req.body;
    console.log('Flutterwave request: ', payload);

    // SUBSCRIBE CUSTOMER HERE
    mailchimp.setConfig({
        apiKey: process.env.MAILCHIMP_API_KEY,
        server: process.env.MAILCHIMP_SERVER_PREFIX
    });

    const listId = process.env.MAILCHIMP_LIST_ID;
    const subscriberHash = md5(payload.email.toLowerCase());

    await mailchimp.lists.updateListMemberTags(listId, subscriberHash, {
        tags: [{ name: SUBSCRIBED, status: 'active' }, { name: UNSUBSCRIBED, status: 'inactive' }]
    });

    await client.lists.setListMember(listId, subscriberHash, {
        email_address: payload.email,
        merge_fields: {
            FNAME: payload.name.split(' ')[0],
            LNAME: payload.name.split(' ')[1]
        },
        status: 'subscribed'
    });

    console.log(`${payload.customer.email} subscribed successfully`);
    return res.status(200).end();
};