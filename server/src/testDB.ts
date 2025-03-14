import { orm, odm } from "./models";

export default async function() {
    // Start Sequelize transaction
    const transaction = await orm.sequelize.transaction();
    try {
        // Create Platform user
        const firstUser = await orm.User.create({
            firstName: "Rey",
            lastName: "Flores",
        }, { transaction });
        console.log(firstUser)
        const firstUserPassword = await orm.Password.create({
            userId: firstUser.id,
            password: "Password@1234"
        }, {transaction});
        console.log(firstUserPassword)

        const firstCaterer = new odm.catererModel({
            userId: firstUser.id,
            name: "Rey's Catering Group",
            location: [-73.935242, 40.730610],
            contact: {
                email: 'reyhector1234@gmail.com',
                website: 'https://www.reyhector.com'
            },
            services: ['staffing']
        });
        console.log(firstCaterer)

        const firstEvent = new odm.eventModel({
            eventType: 5,
            status: "drafted",
            location: [-73.935242, 40.730610],
            scheduledStart: Date.now(),
            scheduledEnd: new Date(Date.now() + 10000)
        });
        console.log(firstEvent)
    } catch (err) {
        await transaction.rollback();
    }
}