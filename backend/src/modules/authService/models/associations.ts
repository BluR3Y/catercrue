import User from "./user.model";
import Password from "./password.model";
import RefreshToken from "./refreshToken.model";

export function setupAssociations() {
    // User Associations
    User.hasMany(Password, {
        foreignKey: 'userId',
        as: 'Passwords'
    });
    User.hasMany(RefreshToken, {
        foreignKey: 'userId',
        as: 'RefreshTokens'
    });

    // Password Associations
    Password.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });

    // Refresh Token associations
    RefreshToken.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });
}