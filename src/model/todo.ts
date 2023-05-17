import { z } from 'zod';

const ToDo = z.object({
  name: z.string(),
});

type ToDoType = z.infer<typeof ToDo>;

export default ToDo;
