import { Router } from "express";
import * as otpController from "../controllers/otp.controller";

export default function(router: Router) {
    router.post("/otp/request", otpController.requestOTP);
    router.post("/otp/verify", otpController.verifyOTP);
}