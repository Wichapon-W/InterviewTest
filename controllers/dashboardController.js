const Transaction = require('../models/transaction');

const buildPipeline = (year) => ([
  {
    $match: {
      date: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`)
      }
    }
  },
  {
    $group: {
      _id: { month: { $month: "$date" }, type: "$type" },
      total: { $sum: "$amount" }
    }
  }
]);

const formatMonthlyData = (data) => {
  const result = Array(12).fill(0).map(() => ({ income: 0, expense: 0 }));
  data.forEach(item => {
    const month = item._id.month - 1;
    result[month][item._id.type] = item.total;
  });
  return result;
};

const calculateGrowth = (current, previous) => {
  return previous === 0 ? 100 : ((current - previous) / previous) * 100;
};

const calculateTotals = (monthlyData) => {
  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);
  return { totalIncome, totalExpense };
};

const getYearlyData = async (year) => {
  const data = await Transaction.aggregate(buildPipeline(year));
  return formatMonthlyData(data);
};

exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const thisYear = now.getFullYear();
    const lastYear = thisYear - 1;

    const thisYearMonthly = await getYearlyData(thisYear);
    const lastYearMonthly = await getYearlyData(lastYear);

    const { totalIncome, totalExpense } = calculateTotals(thisYearMonthly);
    const { totalIncome: lastIncome, totalExpense: lastExpense } = calculateTotals(lastYearMonthly);

    const growthIncome = calculateGrowth(totalIncome, lastIncome);
    const growthExpense = calculateGrowth(totalExpense, lastExpense);

    res.json({
      thisYearMonthly,
      totalIncome,
      totalExpense,
      growthIncome,
      growthExpense
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};