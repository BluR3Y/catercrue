import User from "./user.model";
import Password from "./password.model";
import LoginAttempt from "./loginAttempt.model";
import RefreshToken from "./refreshToken.model";
import ContactMethod from "./contactMethod.model";

import EventType from "./eventType.model";

export default function() {
    // User Associations
    User.hasMany(Password, {
        foreignKey: 'userId',
        as: 'Passwords'
    });
    User.hasMany(RefreshToken, {
        foreignKey: 'userId',
        as: 'RefreshTokens'
    });
    User.hasMany(LoginAttempt, {
        foreignKey: 'userId',
        as: 'LoginAttempts'
    })
    User.hasMany(ContactMethod, {
        foreignKey: 'userId',
        as: 'ContactMethods'
    });

    // Password Associations
    Password.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });

    // LogIn Attempts
    LoginAttempt.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });

    // Refresh Token associations
    RefreshToken.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });

    // Contact Method associations
    ContactMethod.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });
}