import z from "zod";

export const createSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(250, { message: 'Name is too long' }),
  username: z.string().min(1, { message: 'Username is required' }).max(100, { message: 'Username is too long' }),
  followers: z.coerce.number().positive({ message: 'Followers must be a positive number' }),
  image: z.string().min(1, { message: 'Image is required' }),
  recommended: z.preprocess(val => {
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return val;
  }, z.boolean()),
})

export const updateSchema = z.object({
  name: z.string().min(1, { message: 'Name minimum length is 1' }).max(250, { message: 'Name is too long' }).optional(),
  username: z.string().min(1, { message: 'Username minimum length is 1' }).max(100, { message: 'Username is too long' }).optional(),
  followers: z.coerce.number().positive({ message: 'Followers must be a positive number' }).optional(),
  image: z.string().min(1, { message: 'Image is required' }).optional(),
  recommended: z.preprocess((val) => {
    if (val === undefined || val === '') return undefined;
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return val;
  }, z.boolean()).optional(),
})
