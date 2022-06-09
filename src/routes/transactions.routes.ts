import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (_, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();

  const body = {
    transactions,
    balance,
  };

  return response.json(body);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, category, type } = request.body;

  const createTransactionService = new CreateTransactionService();
  const newTransaction = await createTransactionService.execute({
    title,
    value,
    category,
    type,
  });

  return response.json(newTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute(id);

  return response.json({ success: `Transação com id ${id} foi deletada.` });
});

transactionsRouter.post(
  '/import',
  upload.single('csv'),
  async (request, response) => {
    // const { filename } = request.file;
    const importTransactionService = new ImportTransactionsService();

    await importTransactionService.execute();

    return response.json({ success: 'Arquivo CSV enviado com sucesso' });
  },
);

export default transactionsRouter;
