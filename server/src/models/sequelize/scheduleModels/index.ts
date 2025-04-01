// import { Sequelize } from "sequelize";
// import { Shift, initShiftModel } from "./shift.model";
// import { ClockLog, initClockLogModel } from "./clockLog.model";

// export default function(sequelize: Sequelize) {
//     // Initialize schedule related models
//     initShiftModel(sequelize);
//     initClockLogModel(sequelize);

//     return {
//         Shift,
//         ClockLog
//     };
// }

import { Sequelize } from "sequelize";
import { Shift, initShiftModel, associateShiftModel } from "./shift.model";

export const initScheduleModels = (sequelize: Sequelize) => {
    // Initialize scheduling related models
    initShiftModel(sequelize);
    
    return {
        Shift
    }
}

export const associateScheduleModels = (orm: any) => {
    associateShiftModel(orm);
}