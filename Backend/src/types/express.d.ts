import * as express from "express";

declare global {
    namespace Express {
        interface Request {
            user?: { id: number; email?: string }; // Extend as needed
        }
    }
}
