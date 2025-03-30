import { NextRequest, NextResponse } from "next/server";

export default function(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

}