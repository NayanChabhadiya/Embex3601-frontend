// utils/salaryMonth.js
export function getSalaryMonthRange() {
  const today = new Date();
  let start, end;

  if (today.getDate() >= 20) {
    // Salary of current month
    start = new Date(today.getFullYear(), today.getMonth(), 20);
    end = new Date(today.getFullYear(), today.getMonth() + 1, 19, 23, 59, 59);
  } else {
    // Salary of previous month
    start = new Date(today.getFullYear(), today.getMonth() - 1, 20);
    end = new Date(today.getFullYear(), today.getMonth(), 19, 23, 59, 59);
  }

  return { start, end };
}

export function getLeaveMonthRange() {
  const today = new Date();
  let month, year;

  if (today.getDate() >= 20) {
    month = today.getMonth(); // current month
    year = today.getFullYear();
  } else {
    month = today.getMonth() - 1; // previous month
    year = today.getFullYear();
  }

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59); // last day of month

  return { start, end };
}

export function calculateBalanceSalary(worker) {
  const { start: salaryMonthStart, end: salaryMonthEnd } = getLeaveMonthRange(); // 1 → 30
  const { start: advanceStart, end: advanceEnd } = getSalaryMonthRange(); // 20 → 19

  const salary = worker.salary || 0;
  const perDaySalary = salary / 30;

  // Determine worked days based on joiningDate
  let joinDate = worker.joiningDate ? new Date(worker.joiningDate) : null;
  let effectiveStart = salaryMonthStart;

  if (joinDate) {
    if (joinDate > salaryMonthEnd) {
      return 0; // Joined after salary month
    } else if (joinDate > salaryMonthStart) {
      effectiveStart = joinDate;
    }
  }

  // Always count 30-day month
  const workedDays = 30 - (effectiveStart.getDate() - 1);

  // Total leave in salary month
  const totalLeave =
    worker.leaveHistory?.filter((l) => {
      const d = new Date(l.date);
      return d >= salaryMonthStart && d <= salaryMonthEnd;
    }).length || 0;

  // Total advance in advance month range
  const totalAdvance =
    worker.advanceHistory
      ?.filter((a) => {
        const d = new Date(a.date);
        return d >= advanceStart && d <= advanceEnd;
      })
      .reduce((sum, a) => sum + a.amount, 0) || 0;

  // Balance salary
  const balance =
    workedDays * perDaySalary - totalLeave * perDaySalary - totalAdvance;

  return Math.round(balance);
}
