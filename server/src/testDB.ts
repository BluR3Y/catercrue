import { orm } from "./models";

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
        const firstUserPassword = await firstUser.createPassword({ password: "Password@1234" },{ transaction });
        console.log(firstUserPassword)
        // Create register user role
        const firstUserRole = await (firstUser as any).createWorker({
            home_address: { type: "Point", coordinates: [-73.935242, 40.730610] } as any
        }, { transaction })
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
        // console.log(await firstUserRole.isWorkerAvailable(new Date("2025-03-18T16:10:00.000Z"), new Date("2025-03-19T03:25:00.000Z")))
        
        const secondUser = await orm.User.create({
            firstName: "Jade",
            lastName: "Ki Au"
        }, { transaction });
        console.log(secondUser);
        const secondUserRole = await secondUser.createVendor({
            business_name: "Rey's catering company",
            business_address: { type: "Point", coordinates: [-73.935242, 40.730610] } as any,
            industry_id: 1
        },{transaction});
        console.log(secondUserRole);
        const vendorServices = await orm.VendorService.bulkCreate([
            {
                vendor_id: secondUserRole.id,
                service_id: 1
            },
            {
                vendor_id: secondUserRole.id,
                service_id: 2
            },
            {
                vendor_id: secondUserRole.id,
                service_id: 3
            }
        ], { transaction });
        console.log(vendorServices);
        const event = await orm.Event.create({
            type_id: 4,
            state: 'drafted' as any,
            location: { type: "Point", coordinates: [-73.935242, 40.730610] } as any,
            start: new Date(Date.now() + 200),
            end: (new Date(Date.now() + 1000))
        },{transaction})
        console.log(event)
        const firstEventVendor = await event.createVendor({
            vendor_id: secondUserRole.id,
            services: [
                'Food Preparation',
                'Beverage Service'
            ]
        },{transaction})
        console.log(firstEventVendor)
        const firstShift = await event.createShift({
            event_id: event.id,
            assigner_type: 'vendor' as any,
            assigner_id: firstEventVendor.id,
            worker_id: firstUserRole.id,
            role_id: 2,
            shift_start: new Date(Date.now() + 1000),
            shift_end: new Date(Date.now() + 10000)
        }, {transaction});
        // console.log(await orm.EventVendor.findOne({
        //     where: {
        //         event_id: event.id
        //     },
        //     transaction,
        //     include: [
        //         {
        //             model: orm.Event,
        //             as: 'event'
        //         },
        //         {
        //             model: orm.Vendor,
        //             as: 'vendor',
        //             include: [
        //                 {
        //                     model: orm.User,
        //                     as: 'user'
        //                 }
        //             ]
        //         }
        //     ]
        // }))
        const managementWorker = await event.getShifts({
            include: [
                {
                    model: orm.IndustryRole,
                    as: 'role',
                    include: [{
                        model: orm.VendorIndustry,
                        as: 'industry',
                        where: { name: 'Event Planning & Management' }
                    }]
                }
            ],
            transaction
        });
        console.log(managementWorker)
    } catch (err) {
        console.log(err);
        await transaction.rollback();
    }
}