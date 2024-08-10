import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { StatusCodes } from "http-status-codes";

export function validateData(
  schema: z.ZodObject<any, any> | z.ZodEffects<any, any>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: issue.message,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "failed", message: errorMessages[0].message });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ status: "failed", message: "Internal Server Error" });
      }
    }
  };
}
