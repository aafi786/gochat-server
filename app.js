const express = require('express');
const Chatkit = require('@pusher/chatkit-server');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:4bf0b57e-fdb6-43ca-a867-22bfe90dbf14',
    key: 'd6fa2cee-328f-484c-9155-ddbe07010269:uUTzIGw2yYyAU5rQ1hCKBykfFyYSmyhH2JHgcwoIb4o=',
})



app.get('/', (req, res) => {
    res.send('Hello From Chatkit Server');
})

app.post('/create-user', (req, res) => {
    chatkit.createUser({
        id: req.body.name,
        name: req.body.name
    })
        .then(() => {
            res.sendStatus(201);
            console.log('User created successfully');
        }).catch((err) => {
            res.sendStatus(200);
            console.log('User Exists Already');
        });
});
app.delete('/delete-msg', (req, res) => {
    console.log(req.body.msg);
    chatkit.deleteMessage({
        id: req.body.msg
    })
        .then(() => {
            res.sendStatus(202);
            console.log('Message Deleted');
        }).catch((err) => {
            res.sendStatus(204);
            console.log('No Delete');
        });
})

app.post('/get-msg', (req, res) => {
    chatkit.getRoomMessages({
        roomId: req.body.romid,
        limit: 30,
    })
        .then(messages => {
            // res.send(messages);
            console.log(messages);
            return chatkit.getRoomMessages({
                roomId: req.body.romid,
                initialId: res[messages.length - 1].id,
            })
        })
        .then(moreMessages => {
            console.log('got the next 10 messages before them')
            for (let m of moreMessages) {
                renderMessage(m)
            }
        })
        .catch(err => console.error(err))
})

app.post('/auth', (req, res) => {
    const authData = chatkit.authenticate({
        userId: req.query.user_id
    });

    res.status(authData.status)
        .send(authData.body);
});

app.listen(5000, () => {
    console.log('Server Started On Port : 5000');
});