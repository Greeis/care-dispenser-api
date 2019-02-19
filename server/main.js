// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';

Meteor.methods({

    'saveAccount'(user) {
        return Accounts.createUser(user);
    }

});