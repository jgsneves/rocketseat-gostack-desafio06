import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionRepository.find();

    return transactions.reduce(
      (prev, current) => {
        if (current.type === 'income') {
          return {
            income: prev.income + current.value,
            outcome: prev.outcome,
            total: prev.income + current.value - prev.outcome,
          };
        }
        return {
          income: prev.income,
          outcome: prev.outcome + current.value,
          total: prev.income - prev.outcome - current.value,
        };
      },
      { income: 0, outcome: 0, total: 0 },
    );
  }
}

export default TransactionsRepository;
