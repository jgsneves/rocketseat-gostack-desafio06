import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const categoryRepository = getRepository(Category);

    const [categoryFromDatabase] = await categoryRepository.find({
      where: {
        title: category,
      },
    });

    if (!categoryFromDatabase) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);

      const newTransaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: newCategory.id,
      });

      try {
        await transactionRepository.save(newTransaction);

        return newTransaction;
      } catch (error) {
        throw new AppError(
          `Não foi possível criar uma nova transação. Error: ${error}`,
        );
      }
    }

    const newTransaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryFromDatabase.id,
    });

    try {
      await transactionRepository.save(newTransaction);

      return newTransaction;
    } catch (error) {
      throw new AppError(
        `Não foi possível criar uma nova transação. Error: ${error}`,
      );
    }
  }
}

export default CreateTransactionService;
