const mailchimp = require('@mailchimp/mailchimp_marketing');
const md5 = require('md5');
const Validator = require('validator');
const returnError = require('../utils/returnError');

const { SUBSCRIBED, UNSUBSCRIBED } = require('../utils/constants');

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
        const subscriberHash = md5(payload.customer.email.toLowerCase());

        const response = await client.lists.setListMember(listId, subscriberHash, {
            email_address: payload.customer.email,
            merge_fields: {
                FNAME: payload.customer.fullName.split(' ')[0],
                LNAME: payload.customer.fullName.split(' ')[1]
            },
            tags: [SUBSCRIBED],
            status: 'subscribed'
        });
        
        // const response = await mailchimp.lists.addListMember(listId, {
        //     email_address: req.body.email,
        //     tags: [UNSUBSCRIBED],
        //     status: 'subscribed'
        // });

        console.log(response);
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
    var payload = JSON.parse(req.body);
    console.log('Flutterwave request: ', payload);

    // SUBSCRIBE CUSTOMER HERE
    mailchimp.setConfig({
        apiKey: process.env.MAILCHIMP_API_KEY,
        server: process.env.MAILCHIMP_SERVER_PREFIX
    });

    const listId = process.env.MAILCHIMP_LIST_ID;
    const subscriberHash = md5(payload.customer.email.toLowerCase());

    await client.lists.setListMember(listId, subscriberHash, {
        email_address: payload.customer.email,
        merge_fields: {
            FNAME: payload.customer.fullName.split(' ')[0],
            LNAME: payload.customer.fullName.split(' ')[1]
        },
        tags: [SUBSCRIBED],
        status: 'subscribed'
    });

    console.log(`${payload.customer.email} subscribed successfully`);
    return res.status(200).end();
};

exports.createAudience = (req, res) => {

    // mailchimp.setConfig({
    // apiKey: "YOUR_API_KEY",
    // server: "YOUR_SERVER_PREFIX"
    // });

    // const event = {
    // name: "JS Developers Meetup"
    // };

    // const footerContactInfo = {
    // company: "Mailchimp",
    // address1: "675 Ponce de Leon Ave NE",
    // address2: "Suite 5000",
    // city: "Atlanta",
    // state: "GA",
    // zip: "30308",
    // country: "US"
    // };

    // const campaignDefaults = {
    // from_name: "Gettin' Together",
    // from_email: "gettintogether@example.com",
    // subject: "JS Developers Meetup",
    // language: "EN_US"
    // };

    // async function run() {
    //     const response = await mailchimp.lists.createList({
    //         name: event.name,
    //         contact: footerContactInfo,
    //         permission_reminder: "permission_reminder",
    //         email_type_option: true,
    //         campaign_defaults: campaignDefaults
    //     });

    //     console.log(
    //         `Successfully created an audience. The audience id is ${response.id}.`
    //     );
    // }
};