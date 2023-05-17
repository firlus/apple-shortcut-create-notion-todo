import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import ToDo from './model/todo';
import { ZodError } from 'zod';
import { APIResponseError, Client } from '@notionhq/client';

dotenv.config();

const PORT = process.env.PORT || 80;
const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

const app = express();

app.use(bodyParser.json());

app.post('/newTodo', async (req, res) => {
  try {
    const todo = ToDo.parse(req.body);
    const notion = new Client({ auth: NOTION_KEY });
    await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: todo.name,
              },
            },
          ],
        },
      },
    });
    res.sendStatus(200);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Request schema is invalid.' });
    } else if (error instanceof APIResponseError) {
      res.status(500).json({
        message: `Notion API: ${error.message}`,
      });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
});

app.listen(PORT, () => {
  console.log('🚀 Microservice is running!');
});
