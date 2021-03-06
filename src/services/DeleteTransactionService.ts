import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    try {
      await transactionRepository.delete(id);
    } catch (error) {
      throw new AppError(`Não foi possível deletar esta transação: ${error}`);
    }
  }
}

export default DeleteTransactionService;
