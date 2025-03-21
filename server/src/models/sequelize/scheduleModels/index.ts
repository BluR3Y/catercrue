import { Sequelize } from "sequelize";
import { Shift, initShiftModel } from "./shift.model";
import { ClockLog, initClockLogModel } from "./clockLog.model";

export default function(sequelize: Sequelize) {
    // Initialize schedule related models
    initShiftModel(sequelize);
    initClockLogModel(sequelize);

    return {
        Shift,
        ClockLog
    };
}