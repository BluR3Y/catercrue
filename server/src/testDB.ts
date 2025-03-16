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

        const firstEvent = await odm.eventModel.create({
            eventTypeId: 1,
            state: "scheduled",
            location: {
                type: "Point",
                coordinates: [-73.935242, 40.730610]
            },
            schedule: {
                start: Date.now(),
                end: new Date(Date.now() + 1000)
            }
        });
        console.log((firstEvent as any).status);
    } catch (err) {
        console.log(err);
        await transaction.rollback();
    }
}