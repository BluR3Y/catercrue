import User from "./user.model";
import Password from "./password.model";
import LoginAttempt from "./loginAttempt.model";
import RefreshToken from "./refreshToken.model";
import ContactMethod from "./contactMethod.model";

import EventType from "./eventType.model";

import VendorIndustry from "./vendorIndustry.model";
import IndustryService from "./industryService.model";
import Vendor from "./vendor.model";
import IndustryRole from "./industryRole.model";
import Worker from "./worker.model";
import WorkerAvailability from "./workerAvailability.model";
import WorkerException from "./workerException.model";

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
    User.hasOne(Worker, {
        foreignKey: 'userId',
        as: 'Worker'
    });
    User.hasOne(Vendor, {
        foreignKey: 'userId',
        as: 'Vendor'
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

    // Worker associations
    Worker.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });

    // Vendor associations
    Vendor.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });

    
}