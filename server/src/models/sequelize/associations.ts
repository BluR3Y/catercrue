import User from "./user.model";
import Password from "./password.model";
import LoginAttempt from "./loginAttempt.model";
import RefreshToken from "./refreshToken.model";
import ContactMethod from "./contactMethod.model";

import VendorIndustry from "./vendorIndustry.model";
import IndustryService from "./industryService.model";
import Vendor from "./vendor.model";
import VendorService from "./vendorService.model";

import IndustryRole from "./industryRole.model";
import Worker from "./worker.model";
import WorkerAvailability from "./workerAvailability.model";
import WorkerException from "./workerException.model";

import EventType from "./eventType.model";
import Event from "./event.model";
import EventVendor from "./eventVendor.model";
import Shift from "./shift.model";

import ClockLog from "./clockLog.model";


export default function() {
    // User Associations
    User.hasMany(Password, {
        foreignKey: 'user_id',
        as: 'Passwords'
    });
    User.hasMany(RefreshToken, {
        foreignKey: 'user_id',
        as: 'RefreshTokens'
    });
    User.hasMany(LoginAttempt, {
        foreignKey: 'user_id',
        as: 'LoginAttempts'
    })
    User.hasMany(ContactMethod, {
        foreignKey: 'user_id',
        as: 'ContactMethods'
    });
    User.hasOne(Worker, {
        foreignKey: 'user_id',
        as: 'Worker'
    });
    User.hasOne(Vendor, {
        foreignKey: 'user_id',
        as: 'Vendor'
    });

    // Password Associations
    Password.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // LogIn Attempts
    LoginAttempt.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // Refresh Token associations
    RefreshToken.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // Contact Method associations
    ContactMethod.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // Client associations
    // ** Missing

    // Vendor associations
    Vendor.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // Worker associations
    Worker.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    
}