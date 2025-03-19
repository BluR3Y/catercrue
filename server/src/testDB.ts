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
        // Create user password
        const firstUserPassword = await orm.Password.create({
            userId: firstUser.id,
            password: "Password@1234"
        }, {transaction});
        console.log(firstUserPassword)
        // Create register user role
        const firstUserRole = await orm.Worker.create({
            user_id: firstUser.id,
            home_address: { type: "Point", coordinates: [-73.935242, 40.730610] } as any
        }, {transaction});
        console.log(firstUserRole);
        // Create worker weekday availabilities
        const firstWorkerAvails = await orm.WorkerAvailability.bulkCreate([
            {
                worker_id: firstUserRole.id,
                week_day: 'Monday' as any,
                start_time: '08:30',
                end_time: '22:15'
            },
            {
                worker_id: firstUserRole.id,
                week_day: 'Tuesday',
                start_time: '09:15',
                end_time: '12:45'
            },
            {
                worker_id: firstUserRole.id,
                week_day: 'Tuesday',
                start_time: '15:45',
                end_time: '23:59'
            },
            {
                worker_id: firstUserRole.id,
                week_day: 'Wednesday',
                start_time: '10:30',
                end_time: '16:35'
            }
        ], {transaction});
        console.log(firstWorkerAvails)
        const firstWorkerExcs = await orm.WorkerException.bulkCreate([
            {
                worker_id: firstUserRole.id,
                date: '2025-03-18',
                start_time: '12:45',
                end_time: '16:10',
                is_available: true
            },
            {
                worker_id: firstUserRole.id,
                date: '2025-03-19',
                start_time: '10:30',
                end_time: '19:25',
                is_available: true
            },
            {
                worker_id: firstUserRole.id,
                date: '2025-03-19',
                start_time: '00:00',
                end_time: '01:30',
                is_available: true
            },
            {
                worker_id: firstUserRole.id,
                date: '2025-03-19',
                start_time: '01:30',
                end_time: '5:45',
                is_available: true
            }
        ], {transaction});
        console.log(firstWorkerExcs)
        console.log(await firstUserRole.isWorkerAvailable(new Date("2025-03-18T16:10:00.000Z"), new Date("2025-03-19T03:25:00.000Z")))
    } catch (err) {
        console.log(err);
        await transaction.rollback();
    }
}